# CiaoClipBoard

[English](#overview) | [中文说明](#概述)

## Overview
CiaoClipBoard is a privacy-focused clipboard cleaning tool available as both a Chrome extension and a standalone web application. It provides instant clipboard content cleaning with a modern, user-friendly interface.

## Features
- One-click clipboard cleaning
- Instant visual feedback
- Usage statistics tracking
- Cross-device compatibility
- Privacy-focused design
- No data collection
- Modern UI with animations
- Draggable floating bubble (Chrome Extension)
- Restorable bubble interface
- Interactive popup page
- PRO features coming soon

## Variants

### 1. Chrome Extension Version
- Floating bubble interface
- Draggable position
- Always accessible while browsing
- Modern Claude-inspired design
- Animated cleaning effects
- Usage statistics
- Restorable bubble from popup
- Interactive status feedback
- PRO version preview
- Installation steps:
  1. Open Chrome Extensions (chrome://extensions/)
  2. Enable Developer Mode
  3. Click "Load unpacked"
  4. Select the `ChromeExtensionVersion` folder

### 2. Standalone Web Application
- Single HTML file
- No installation required
- Works in any modern browser
- Offline capable
- [Try it now](https://ciaoclipboard.pages.dev/CiaoClipBoard)

## Project Structure
```
CiaoClipBoard/
├── CiaoClipBoard.html          # Standalone web application
├── README.md                   # Documentation
├── PRIVACY.md                  # Privacy policy
└── ChromeExtensionVersion/     # Chrome extension variant
    ├── manifest.json           # Extension configuration
    ├── bubble.js              # Core functionality
    ├── bubble.css             # Bubble styles
    ├── background.js          # Background service
    ├── popup.html             # Extension popup page
    ├── popup.css              # Popup styles
    ├── popup.js               # Popup functionality
    └── icons/                 # Extension icons
        ├── icon.svg           # Source icon
        ├── icon16.png         # Generated icons
        ├── icon32.png
        ├── icon48.png
        └── icon128.png
```

## Technical Details

### Chrome Extension Features
- Modern floating bubble UI
- Claude-inspired orange gradient theme
- Animated SVG cleaning effects
- Draggable positioning
- Position memory
- Usage statistics
- One-click clearing
- Progress animation
- Success notifications
- Interactive popup interface
- Bubble restoration
- Status synchronization
- Privacy-focused design
- PRO features preview

### Security & Privacy
- No data collection
- Local storage only
- No external dependencies
- Clipboard content immediately destroyed
- No tracking or analytics
- Content Security Policy
- Secure messaging system
- Error handling
- Isolated storage

## Browser Compatibility
- Chrome Extension: Chrome 88+
- Web Version: All modern browsers
- Required APIs:
  - Clipboard API
  - Storage API
  - Chrome Extension APIs
  - CSS Grid/Flexbox
  - SVG Animations

## Contributing
Contributions are welcome! Please feel free to submit issues and pull requests.

## License
This project is open source and available under the MIT License.

## Privacy Policy
See [PRIVACY.md](PRIVACY.md) for detailed privacy policy.

---

# 中文说明

## 概述
CiaoClipBoard 是一个注重隐私的剪贴板清理工具，提供 Chrome 扩展和独立网页应用两种版本。它具有现代化的用户界面，可以即时清理剪贴板内容。

## 功能特点
- 一键清理剪贴板
- 即时视觉反馈
- 使用次数统计
- 跨设备兼容
- 注重隐私设计
- 无数据收集
- 现代化界面动画
- 可拖动悬浮球（Chrome 扩展版）
- 可恢复的悬浮界面
- 交互式弹出页面
- PRO 功能即将推出

## 版本说明

### 1. Chrome 扩展版
- 悬浮球界面
- 可拖动定位
- 浏览时随时可用
- Claude 风格设计
- 动画清理效果
- 使用统计
- 可从弹出窗口恢复悬浮球
- 交互式状态反馈
- PRO 版本预览
- 安装步骤：
  1. 打开 Chrome 扩展页面 (chrome://extensions/)
  2. 开启开发者模式
  3. 点击"加载已解压的扩展程序"
  4. 选择 `ChromeExtensionVersion` 文件夹

### 2. 网页版
- 单一 HTML 文件
- 无需安装
- 支持所有现代浏览器
- 可离线使用
- [立即体验](https://ciaoclipboard.pages.dev/CiaoClipBoard)

## 项目结构
```
CiaoClipBoard/
├── CiaoClipBoard.html          # 网页版应用
├── README.md                   # 说明文档
├── PRIVACY.md                  # 隐私政策
└── ChromeExtensionVersion/     # Chrome 扩展版
    ├── manifest.json           # 扩展配置
    ├── bubble.js              # 核心功能
    ├── bubble.css             # 样式
    ├── background.js          # 后台服务
    ├── popup.html             # 扩展弹出页面
    ├── popup.css              # 弹出页面样式
    ├── popup.js               # 弹出页面功能
    └── icons/                 # 扩展图标
        ├── icon.svg           # 源图标
        ├── icon16.png         # 生成的图标
        ├── icon32.png
        ├── icon48.png
        └── icon128.png
```

## 技术细节

### Chrome 扩展功能
- 现代悬浮球界面
- Claude 风格橙色渐变主题
- 动画清理效果
- 可拖动定位
- 位置记忆
- 使用统计
- 一键清理
- 进度动画
- 成功提示
- 交互式弹出界面
- 悬浮球恢复
- 状态同步
- 注重隐私设计
- PRO 功能预览

### 安全与隐私
- 无数据收集
- 仅本地存储
- 无外部依赖
- 剪贴板内容即时销毁
- 无跟踪分析
- 内容安全策略
- 安全消息系统
- 错误处理
- 隔离存储

## 浏览器兼容性
- Chrome 扩展：Chrome 88+
- 网页版：所有现代浏览器
- 所需 API：
  - 剪贴板 API
  - 存储 API
  - Chrome 扩展 API
  - CSS Grid/Flexbox
  - SVG 动画

## 参与贡献
欢迎提交问题和拉取请求！

## 开源协议
本项目采用 MIT 许可证开源。

## 隐私政策
请查看 [PRIVACY.md](PRIVACY.md) 获取详细隐私政策。