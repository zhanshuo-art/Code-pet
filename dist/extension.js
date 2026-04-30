"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var commandId = "code-pet.spawn";
var resetPositionCommandId = "code-pet.resetPosition";
var panelViewType = "code-pet.panel";
var sidebarViewType = "code-pet.view";
var installPromptStateKey = "code-pet.hasShownInstallPrompt";
var spawnPetAction = "Spawn Pet";
function activate(context) {
  const controller = new CodePetController(context);
  context.subscriptions.push(
    vscode.commands.registerCommand(commandId, () => controller.spawnOrReveal()),
    vscode.commands.registerCommand(resetPositionCommandId, () => controller.resetPosition()),
    controller,
    vscode.window.registerWebviewViewProvider(sidebarViewType, controller, {
      webviewOptions: {
        retainContextWhenHidden: true
      }
    }),
    vscode.workspace.onDidChangeTextDocument((event) => controller.handleTextDocumentChange(event)),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("code-pet.sound")) {
        void controller.refreshConfig();
      }
    }),
    vscode.window.registerWebviewPanelSerializer(panelViewType, {
      async deserializeWebviewPanel(panel) {
        controller.restore(panel);
      }
    })
  );
  void showInstallPrompt(context);
}
function deactivate() {
}
async function showInstallPrompt(context) {
  if (context.globalState.get(installPromptStateKey)) {
    return;
  }
  await context.globalState.update(installPromptStateKey, true);
  const selection = await vscode.window.showInformationMessage(
    "Code Pet is installed. Spawn your pet in the Explorer?",
    spawnPetAction
  );
  if (selection === spawnPetAction) {
    await vscode.commands.executeCommand(commandId);
  }
}
var CodePetController = class {
  constructor(context) {
    this.context = context;
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.statusBarItem.text = "$(sparkle) Code Pet";
    this.statusBarItem.tooltip = "Spawn or reveal Code Pet in the Explorer";
    this.statusBarItem.command = commandId;
    this.statusBarItem.show();
    this.disposables.push(this.statusBarItem);
  }
  context;
  panel;
  view;
  disposables = [];
  statusBarItem;
  pendingCommand;
  spawnOrReveal() {
    void this.revealSidebarView();
  }
  resetPosition() {
    this.pendingCommand = "resetPosition";
    void this.revealSidebarView({ notifySpawn: false }).then(() => this.flushPendingCommand());
  }
  restore(panel) {
    this.attachPanel(panel);
  }
  resolveWebviewView(view) {
    this.view = view;
    view.webview.options = this.getWebviewOptions();
    view.webview.html = this.getHtml(view.webview);
    const viewDisposables = [];
    view.onDidDispose(
      () => {
        if (this.view === view) {
          this.view = void 0;
        }
        while (viewDisposables.length) {
          viewDisposables.pop()?.dispose();
        }
      },
      void 0,
      viewDisposables
    );
    view.webview.onDidReceiveMessage(
      (message) => this.handleWebviewMessage(view, message),
      void 0,
      viewDisposables
    );
  }
  async revealSidebarView(options = { notifySpawn: true }) {
    try {
      await vscode.commands.executeCommand("workbench.view.explorer");
      await vscode.commands.executeCommand(`${sidebarViewType}.focus`);
      if (options.notifySpawn) {
        this.postActivity("spawn");
      }
    } catch (error) {
      console.error(`[Code Pet] failed to focus sidebar view: ${String(error)}`);
      void vscode.window.showErrorMessage("Code Pet could not reveal the Explorer view.");
    }
  }
  dispose() {
    while (this.disposables.length) {
      this.disposables.pop()?.dispose();
    }
    this.panel?.dispose();
    this.panel = void 0;
  }
  attachPanel(panel) {
    this.panel = panel;
    panel.webview.options = this.getWebviewOptions();
    panel.webview.html = this.getHtml(panel.webview);
    const panelDisposables = [];
    panel.onDidDispose(
      () => {
        if (this.panel === panel) {
          this.panel = void 0;
        }
        while (panelDisposables.length) {
          panelDisposables.pop()?.dispose();
        }
      },
      void 0,
      panelDisposables
    );
    panel.webview.onDidReceiveMessage(
      (message) => this.handleWebviewMessage(panel, message),
      void 0,
      panelDisposables
    );
  }
  handleWebviewMessage(host, message) {
    switch (message.type) {
      case "ready":
        void this.sendInitialState(host);
        return;
      case "interaction":
        console.debug(`[Code Pet] interaction: ${message.name}`);
        return;
      case "error":
        console.error(`[Code Pet] webview error: ${message.message}`);
        return;
    }
  }
  handleTextDocumentChange(event) {
    if (event.contentChanges.length === 0) {
      return;
    }
    this.postActivity("typing");
  }
  async refreshConfig() {
    await Promise.all(
      [this.view, this.panel].flatMap((host) => host ? [this.sendConfig(host)] : [])
    );
  }
  async sendInitialState(host) {
    try {
      await this.sendConfig(host);
      await host.webview.postMessage({
        type: "activity",
        activity: "spawn"
      });
      this.flushPendingCommand();
    } catch (error) {
      console.error(`[Code Pet] failed to initialize webview: ${String(error)}`);
    }
  }
  async sendConfig(host) {
    await host.webview.postMessage(await this.getConfigMessage(host.webview));
  }
  postActivity(activity) {
    const message = { type: "activity", activity };
    void this.view?.webview.postMessage(message);
    void this.panel?.webview.postMessage(message);
  }
  postCommand(command) {
    const message = { type: "command", command };
    void this.view?.webview.postMessage(message);
    void this.panel?.webview.postMessage(message);
  }
  flushPendingCommand() {
    if (!this.pendingCommand || !this.view && !this.panel) {
      return;
    }
    this.postCommand(this.pendingCommand);
    this.pendingCommand = void 0;
  }
  getWebviewOptions() {
    return {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, "media")]
    };
  }
  getHtml(webview) {
    const nonce = getNonce();
    const stylesUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "media", "code-pet.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "media", "code-pet.js")
    );
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; media-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
  <link href="${stylesUri}" rel="stylesheet">
  <title>Code Pet</title>
</head>
<body>
  <main class="pet-stage" aria-label="Code Pet playground">
    <div class="room-background-layer is-active" aria-hidden="true"></div>
    <div class="room-background-layer" aria-hidden="true"></div>
    <div class="background-controls" hidden>
      <button class="background-control" type="button" data-background-step="-1" aria-label="Previous background">&lsaquo;</button>
      <button class="background-control" type="button" data-background-step="1" aria-label="Next background">&rsaquo;</button>
      <button class="background-control" type="button" data-sound-toggle aria-label="Mute pet sounds" aria-pressed="false">S</button>
      <button class="background-control" type="button" data-reset-position aria-label="Reset pet position">R</button>
    </div>
    <div class="pet-shadow" aria-hidden="true"></div>
    <button class="pet" type="button" aria-label="Pet">
      <span class="pet-hover-layer" aria-hidden="true">
        <span class="pet-motion-layer">
          <span class="pet-direction-layer">
            <img class="pet-sprite" alt="" draggable="false">
          </span>
        </span>
      </span>
    </button>
  </main>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }
  async getConfigMessage(webview) {
    const imageBaseUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "media", "images")
    );
    const frameBaseUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "media", "images", "pet")
    );
    const backgroundBaseUri = vscode.Uri.joinPath(
      this.context.extensionUri,
      "media",
      "images",
      "backgrounds"
    );
    const audioBaseUri = vscode.Uri.joinPath(this.context.extensionUri, "media", "audio");
    const manifestUri = vscode.Uri.joinPath(
      this.context.extensionUri,
      "media",
      "images",
      "pet",
      "manifest.json"
    );
    const manifestBytes = await vscode.workspace.fs.readFile(manifestUri);
    const settings = this.getSettings();
    return {
      type: "config",
      config: {
        extensionVersion: String(this.context.extension.packageJSON.version),
        assets: {
          backgrounds: Array.from({ length: 4 }, (_, index) => {
            const roomNumber = String(index + 1).padStart(2, "0");
            const name = `bg-${roomNumber}.png`;
            return {
              id: `bg-${roomNumber}`,
              name,
              uri: webview.asWebviewUri(vscode.Uri.joinPath(backgroundBaseUri, name)).toString()
            };
          }),
          images: imageBaseUri.toString(),
          frameBaseUri: frameBaseUri.toString(),
          sounds: {
            aprehensive: webview.asWebviewUri(vscode.Uri.joinPath(audioBaseUri, "sound-apprehensive.mp3")).toString(),
            aprehensive3: webview.asWebviewUri(vscode.Uri.joinPath(audioBaseUri, "sound-apprehensive2.mp3")).toString(),
            curious: webview.asWebviewUri(vscode.Uri.joinPath(audioBaseUri, "sound-curious.mp3")).toString(),
            dropped1: webview.asWebviewUri(vscode.Uri.joinPath(audioBaseUri, "sound-land1.mp3")).toString(),
            dropped2: webview.asWebviewUri(vscode.Uri.joinPath(audioBaseUri, "sound-land2.mp3")).toString(),
            happy: webview.asWebviewUri(vscode.Uri.joinPath(audioBaseUri, "sound-happy.mp3")).toString(),
            startled: webview.asWebviewUri(vscode.Uri.joinPath(audioBaseUri, "sound-startled.mp3")).toString()
          }
        },
        settings,
        manifest: JSON.parse(Buffer.from(manifestBytes).toString("utf8"))
      }
    };
  }
  getSettings() {
    const configuration = vscode.workspace.getConfiguration("code-pet");
    const soundVolume = configuration.get("sound.volume", 45);
    return {
      soundEnabled: configuration.get("sound.enabled", true),
      soundVolume: clamp(soundVolume, 0, 100) / 100
    };
  }
};
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function getNonce() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let nonce = "";
  for (let index = 0; index < 32; index += 1) {
    nonce += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return nonce;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
