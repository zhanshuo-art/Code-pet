# Code Pet

<p align="center">
  <img src="media/icon.png" alt="Code Pet Icon" width="128" />
</p>

<p align="center">
  <strong>一个生活在 VS Code 资源管理器中的互动桌宠伴侣</strong>
</p>

<p align="center">
  <a href="README_en.md">English</a> · <a href="README_cn.md">中文</a>
</p>

---

## 📖 简介

Code Pet 是一款为 VS Code 打造的互动桌宠扩展。它会在编辑器的资源管理器侧边栏中生成一个可爱的动画角色，陪伴你的编程时光。你可以拖拽它、点击摸头、观察它对你打字的反应，还能切换不同的房间背景。

## ✨ 功能特性

| 功能                       | 说明                                                            |
| -------------------------- | --------------------------------------------------------------- |
| 🎭**资源管理器伴侣** | Code Pet 会在专属的侧边栏视图中出现,不会占用你的编辑器标签页     |
| 👆**直接交互**       | 拖拽小宠物、单击摸头、或在它获得焦点时按 `Enter`/`Space` 键 |
| ⌨️**工作反应**     | Code Pet 会在召唤时挥手打招呼,并对你的打字做出兴奋或惊讶的反应   |
| 😴**待机行为**       | 长时间不操作时,Code Pet 会先发呆,然后感到无聊,最后睡着           |
| 🖼️**房间背景**     | 内置4张精美背景图,可通过视图左上角的控制按钮切换                |
| 🔊**反馈音效**       | 摸头、拾起、放下、拖拽等动作都有对应的音效反馈                  |
| 🔄**位置重置**       | 从命令面板或视图中的 `R` 按钮快速重置宠物位置                 |

## 🎮 宠物交互系统

### 互动动画 (9种)

1. **idle (待机)** - 平静地站立呼吸
2. **bored (无聊)** - 45秒无操作后开始发呆
3. **sleep (睡觉)** - 2分15秒无操作后睡着
4. **wave (招手)** - 召唤时的打招呼动画
5. **cheering (欢呼)** - 打字时的兴奋反应
6. **wow (惊讶)** - 打字时的惊讶反应
7. **headpat (摸头)** - 点击时的开心反应 ❤️
8. **dragged (拖拽中)** - 被拖拽时的动画
9. **dropRecovery (落地恢复)** - 放下后的恢复动作

### 交互方式

| 操作                   | 触发方式                            | 效果                                 |
| ---------------------- | ----------------------------------- | ------------------------------------ |
| 🫳**摸头**       | 鼠标单击宠物                        | 播放摸头动画 + 开心音效              |
| 🖱️**拖拽**     | 按住宠物拖动                        | 跟随鼠标移动,播放拖拽动画 + 惊叫音效 |
| 🪂**落地**       | 松开拖拽                            | 宠物自由落体到底部 + 落地动画和音效  |
| ⌨️**键盘互动** | 焦点状态下按 `Enter` 或 `Space` | 与点击效果相同(摸头)                 |
| 🚶**自主徘徊**   | 待机时                              | 宠物会自己在视图中左右走动           |
| 💬**打字反应**   | 在编辑器中输入文字                  | 交替播放欢呼/惊讶动画(3秒冷却)       |

### 音效系统 (7种)

| 音效                     | 触发时机           | 冷却时间 |
| ------------------------ | ------------------ | -------- |
| 🎵**happy**        | 摸头时             | 200ms    |
| 😱**startled**     | 开始拖拽时         | 700ms    |
| 💥**dropped1/2**   | 落地时(随机二选一) | 700ms    |
| 😰**apprehensive** | 拖拽到远处时       | 1000ms   |
| 🤔**curious**      | 预留音效           | 700ms    |

## 🚀 快速开始

### 方式一:从 VS Code 市场安装

1. 打开 VS Code
2. 按 `Ctrl+Shift+X` 打开扩展市场
3. 搜索 "Code Pet"
4. 点击"安装"

### 方式二:本地开发安装

1. 下载本项目

```bash
git clone https://github.com/zhanshuo-art/code-pet.git
cd code-pet
```

2. 安装依赖

```bash
npm install
```

3. 编译扩展

```bash
npm run compile
```

4. 在 VS Code 中打开项目文件夹,按 `F5` 启动调试
5. 在弹出的扩展开发窗口中,按 `Ctrl+Shift+P` 输入 `Code Pet: Spawn Pet` 召唤宠物

## 🎯 使用说明

### 召唤宠物

- **命令面板**: `Ctrl+Shift+P` → `Code Pet: Spawn Pet`
- **状态栏**: 点击底部状态栏的 `✨ Code Pet` 按钮
- **侧边栏**: 打开资源管理器 (Explorer),宠物会自动出现在 `CODE PET` 面板中

### 控制按钮

将鼠标移到宠物视图上方,会出现4个控制按钮:

| 按钮   | 功能               |
| ------ | ------------------ |
| `‹` | 切换到上一张背景   |
| `›` | 切换到下一张背景   |
| `S`  | 静音/取消静音      |
| `R`  | 重置宠物位置到中央 |

### 命令列表

| 命令                            | 说明                       |
| ------------------------------- | -------------------------- |
| `Code Pet: Spawn Pet`          | 在资源管理器中显示宠物     |
| `Code Pet: Reset Pet Position` | 重置宠物位置到默认中心位置 |

## ⚙️ 配置选项

在 VS Code 设置中搜索 "Code Pet" 可找到以下配置项:

| 设置项                     | 类型        | 默认值   | 说明              |
| -------------------------- | ----------- | -------- | ----------------- |
| `code-pet.sound.enabled` | `boolean` | `true` | 启用/禁用宠物音效 |
| `code-pet.sound.volume`  | `number`  | `45`   | 音效音量(0-100)   |

打开设置的方式:

- `Ctrl+,` → 搜索 "Code Pet"
- 或直接编辑 `settings.json`:

```json
{
  "code-pet.sound.enabled": true,
  "code-pet.sound.volume": 45
}
```

## 🛠️ 技术细节

### 项目结构

```
Code Pet/
├── src/
│   └── extension.ts              # TypeScript 后端(430行)
├── media/
│   ├── qutedva.js                # 前端 WebView 逻辑(1,060行)
│   ├── qutedva.css               # 样式和动画(426行)
│   ├── icon.png                  # 插件图标
│   ├── audio/                    # 7个音效文件
│   │   ├── sound-happy.mp3
│   │   ├── sound-startled.mp3
│   │   ├── sound-land1.mp3
│   │   ├── sound-land2.mp3
│   │   ├── sound-apprehensive.mp3
│   │   ├── sound-apprehensive2.mp3
│   │   └── sound-curious.mp3
│   └── images/
│       ├── pet/
│       │   ├── manifest.json     # 动画定义文件
│       │   └── sheet*.png        # 100张精灵帧(50+50)
│       └── backgrounds/          # 4张背景图
│           ├── bg-01.png
│           ├── bg-02.png
│           ├── bg-03.png
│           └── bg-04.png
├── dist/
│   └── extension.js              # 编译后的扩展包
└── package.json                  # 项目配置
```

### 精灵资源

- **总帧数**: 100帧 (sheet1: 50帧, sheet2: 50帧)
- **命名规则**: `sheet{1|2}-r{1-5}-c{1-5}.png`
- **帧尺寸**: 288×288 像素 (透明 PNG)
- **动画配置**: `media/images/pet/manifest.json`

manifest.json 包含:

- `frames`: 所有精灵帧的目录和坐标信息
- `source`: 每一帧在原始图上的裁剪区域
- `pivot`: 每一帧的变换原点(用于动画和物理)
- `animations`: 从帧目录定义的动画序列

### 物理引擎参数

```javascript
// 重力系统
gravityAcceleration: 0.0018      // 重力加速度
maxVelocity: 1.1                 // 最大下落速度
floorInsetRatio: 0.46            // 地板内缩比例

// 拖拽手感
positionLerp: 0.24               // 位置平滑系数
anchorLerp: 0.055                // 头部锚点平滑系数
apprehensiveDistancePx: 118      // 触发不安音效的距离

// 徘徊行为
wanderSpeed: 0.034 px/ms         // 徘徊移动速度
minDelayMs: 4000                 // 最小等待时间
maxDelayMs: 10000                // 最大等待时间
```

### 开发命令

| 任务             | 命令                       |
| ---------------- | -------------------------- |
| 类型检查和打包   | `npm run compile`        |
| 生产环境打包     | `npm run package`        |
| 完整本地验证     | `npm run ci`             |
| 代码检查         | `npm run lint`           |
| 代码格式化       | `npm run format`         |
| 格式检查         | `npm run format:check`   |
| 重新生成精灵资源 | `npm run process-assets` |
| 打包 VSIX        | `npm run vsix`           |

## 🐛 常见问题

**Q: 按 F5 调试后新窗口里看不到宠物面板**
A: 点击左侧 Explorer 图标,面板可能被折叠了,往下滚动找 `CODE PET` 区域。

**Q: 宠物出现但没有背景图(纯色背景)**
A: 这是正常的,说明背景图还未替换,替换 `media/images/backgrounds/` 中的图片即可。

**Q: 修改了代码,重启调试没生效**
A: 先在终端运行 `npm run compile`,再按 `Ctrl+Shift+F5` 重启调试。

**Q: 音效没有声音**
A: 检查面板里的 `S` 按钮是否处于静音状态,同时检查系统音量设置。

**Q: 如何快速重新加载插件(不关闭调试窗口)**
A: 在扩展开发窗口中按 `Ctrl+Shift+P` → `Developer: Reload Window`。

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。
