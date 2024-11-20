# CiaoClipBoard

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

## Variants

### 1. Chrome Extension Version
- Floating bubble interface
- Draggable position
- Always accessible while browsing
- Modern Claude-inspired design
- Animated cleaning effects
- Usage statistics
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
└── ChromeExtensionVersion/     # Chrome extension variant
    ├── manifest.json           # Extension configuration
    ├── bubble.js              # Core functionality
    ├── bubble.css             # Styles
    ├── background.js          # Background service
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
- Privacy-focused design

### Security & Privacy
- No data collection
- Local storage only
- No external dependencies
- Clipboard content immediately destroyed
- No tracking or analytics

## Browser Compatibility
- Chrome Extension: Chrome 88+
- Web Version: All modern browsers
- Required APIs:
  - Clipboard API
  - Local Storage
  - CSS Grid/Flexbox
  - SVG Animations

## Contributing
Contributions are welcome! Please feel free to submit issues and pull requests.

## License
This project is open source and available under the MIT License.

## Privacy Policy
- No data collection
- No external transmission
- Local storage only
- No cookies
- No tracking
- Complete privacy protection