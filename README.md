# CiaoClipBoard

## Overview
CiaoClipBoard is a lightweight web application designed to enhance user privacy by providing instant clipboard content cleaning. With a simple click, users can automatically clear their clipboard contents after 1 second, helping protect sensitive information across various devices including laptops, mobile phones, and other network-connected devices.

## Demo
Try it now: [CiaoClipBoard Demo](https://ciaoclipboard.pages.dev/CiaoClipBoard)

## Features
- One-click clipboard cleaning
- 1-second automatic clearing delay
- Cross-device compatibility (desktop & mobile)
- Local storage tracking for usage statistics
- Usage frequency monitoring
- Privacy-focused design
- No data collection or external dependencies
- Visual feedback for successful operations
- Embedded animated SVG logo with waving hand gesture
- Single self-contained HTML file

## Architecture
### Core Components
1. **HTML Interface**
   - Single self-contained HTML file
   - Embedded SVG logo with animations
   - Minimalist UI with clear action button
   - Responsive layout for all devices
   - Success message animation

2. **CSS Styling**
   - CSS variables for consistent theming
   - Responsive design principles
   - Smooth animations and transitions
   - Mobile-first approach
   - Accessible color contrast

3. **JavaScript Modules**
   - Clipboard Management
     - Async clipboard API handling
     - Content clearing mechanism
     - 1-second delay timer
     - Error handling with user feedback
   
   - Local Storage Handler
     - Usage counter
     - Timestamp tracking
     - First use recording
     - Frequency calculator
     - Statistics persistence

4. **Data Flow**
   ```
   User Click → Clipboard Access → Clear Content → Show Success Message
        ↓
   Update Counter → Record Timestamp → Calculate Frequency → Update UI
   ```

### Security Considerations
- No data leaves the device
- Clipboard content is immediately destroyed
- Local storage only contains usage statistics
- No external dependencies or API calls
- Permission-based clipboard access
- Error handling for denied permissions

## Usage
1. Download the single self-contained `CiaoClipBoard.html` file
2. Open it in any modern web browser
3. Click the "Clear Clipboard" button to instantly clear clipboard contents
4. View your usage statistics in the dashboard below

## Statistics Tracking
The application tracks:
- Total number of times used
- Last usage timestamp
- Average usage frequency (times per day)
- First use date (for frequency calculation)

## Browser Compatibility
Works with all modern browsers that support:
- Clipboard API
- Local Storage
- ES6+ JavaScript
- SVG animations

## Installation
No installation required! Simply download the single self-contained `CiaoClipBoard.html` file and open it in your browser. Everything, including the animated logo, is contained within this single file.

## Privacy Policy
- No data collection or external transmission
- All operations performed locally on your device
- Usage statistics stored only in local storage
- No cookies used
- No user tracking
- No external dependencies
- Complete privacy protection
- Data can be cleared through browser settings

## License
This project is open source and available under the MIT License.

## Contributing
Contributions are welcome! Feel free to submit issues and pull requests.

## Project Structure
```
CiaoClipBoard/
├── CiaoClipBoard.html     # Standalone web application
├── README.md              # Documentation
└── ChromeExtensionVersion/# Chrome extension variant
    ├── manifest.json      # Extension configuration
    ├── bubble.css         # Extension styles
    ├── bubble.js          # Extension functionality
    └── icons/            # Extension icons
```

## Variants

### 1. Standalone Web Application
- Single HTML file (`CiaoClipBoard.html`)
- No installation required
- Works in any modern browser
- Offline capable

### 2. Chrome Extension Version
- Located in `ChromeExtensionVersion/` directory
- Floating bubble interface
- Always accessible while browsing
- Installation steps:
  1. Open Chrome Extensions (chrome://extensions/)
  2. Enable Developer Mode
  3. Click "Load unpacked"
  4. Select the `ChromeExtensionVersion` folder