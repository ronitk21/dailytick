# DailyTick

A minimalist Chrome extension that transforms your new tab into a productivity-focused checklist for managing daily tasks.

## Overview

DailyTick provides a clean, keyboard-driven interface designed to help you maintain focus on what matters most. With separate columns for daily tasks and long-term goals, plus an integrated motivation section, it serves as your personal productivity dashboard every time you open a new tab.

## Key Features

### Task Management
- **Daily Tasks**: Quick task creation with inline editing and instant check/uncheck
- **Long-term Goals**: Dedicated section for tracking broader objectives

### Productivity Tools
- **Motivation Center**: Customizable quote-style note area with auto-resize
- **Daily Reset**: Optional automatic task clearing for fresh starts
- **Persistent Storage**: All data saved locally in your browser

### User Experience
- **Keyboard-First Design**: Complete functionality accessible via shortcuts
- **Dark Mode Support**: Manual toggle or automatic system preference detection
- **Minimal Interface**: Clean design that doesn't distract from your workflow

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+P` | Create new task and focus for immediate editing |
| `Ctrl+D` | Toggle all tasks between done/undone states |
| `Ctrl+C` | Clear all tasks (with confirmation dialog) |

## Technical Details

### File Structure
```
├── manifest.json          # Extension configuration
├── newtab.html            # Main interface layout  
├── styles.css             # UI styling and themes
├── app.js                 # Core application logic
└── storage.js             # Local storage management
```

### Browser Compatibility
- Chrome (Manifest V3)
- Microsoft Edge
- Other Chromium-based browsers

### Data Storage
All data is stored locally using the browser's localStorage API. No external servers or data collection.

## Version History

### v1.0.0
- Initial release
- Core task management functionality
- Keyboard shortcuts implementation
- Dark mode support
- Daily reset feature

## Support

For issues, feature requests, or questions, please [create an issue](https://github.com/yourusername/dailytick/issues) on GitHub.

## License

This project is licensed under the MIT License - see the LICENSE file for details.