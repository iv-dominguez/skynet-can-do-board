# SkyNet Can Do Board

An AI-powered productivity kanban board with a Terminator/SkyNet aesthetic. Built as a Progressive Web App (PWA) with voice input, Siri integration, and intelligent task analysis.

![Theme: Dark cyberpunk with red accents](icons/icon-512x512.png)

## Features

**Board Management** â Five columns (Draft, To Do, In Progress, Delayed, Complete) with drag-and-drop task movement, expandable descriptions, and undo support.

**AI Task Analysis** â When tasks move to the "To Do" column, Claude AI automatically analyzes them and provides actionable breakdowns, time estimates, and priority suggestions.

**Voice Input** â Dictate tasks using the Web Speech API. Works on desktop and mobile browsers that support speech recognition.

**Siri Integration** â Add tasks from iOS Shortcuts using URL parameters (`?addDraft=` and `?addTodo=`). See the [Siri Shortcuts Setup](#siri-shortcuts-setup) section below.

**Offline Capable** â Full PWA with service worker caching. Works without an internet connection (AI analysis requires connectivity).

**Productivity Stats** â Track your completion count, daily streak, and completion rate right from the board.

**Task Templates** â Quick-start templates to pre-populate common task types.

**Export & Share** â Export your entire board to a text file or share it via an encoded URL.

**Confetti Celebrations** â Because completing tasks should feel good.

## Quick Start

### Option 1: Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/skynet-can-do-board.git
   cd skynet-can-do-board
   ```

2. Serve locally (any static server works):
   ```bash
   # Using Python
   python3 -m http.server 8000

   # Using Node.js
   npx serve .

   # Using PHP
   php -S localhost:8000
   ```

3. Open `http://localhost:8000` in your browser.

### Option 2: GitHub Pages Deployment

See [DEPLOY.md](docs/DEPLOY.md) for full deployment instructions.

### Option 3: Direct File

Open `index.html` directly in a browser. Note: PWA features (service worker, install prompt) require serving over HTTPS or localhost.

## Project Structure

```
skynet-can-do-board/
âââ index.html          # Main application (self-contained React app)
âââ manifest.json       # PWA manifest for installability
âââ sw.js               # Service worker for offline caching
âââ icons/
â   âââ icon-192x192.png   # App icon (standard)
â   âââ icon-512x512.png   # App icon (high-res)
âââ docs/
â   âââ DEPLOY.md          # Deployment guide
âââ README.md           # This file
```

## AI Task Analysis Setup

The AI analysis feature uses the Anthropic Claude API. To enable it:

1. Get an API key from [console.anthropic.com](https://console.anthropic.com)
2. When prompted in the app, enter your API key
3. Your key is stored locally in your browser and never sent anywhere except directly to the Anthropic API

The app uses `claude-sonnet-4-20250514` for fast, intelligent task breakdowns.

## Siri Shortcuts Setup

SkyNet Can Do Board integrates with iOS Shortcuts, allowing you to add tasks via Siri voice commands.

### Creating a "Add Draft" Shortcut

1. Open the **Shortcuts** app on your iPhone/iPad
2. Tap **+** to create a new shortcut
3. Add the action **"Ask for Input"** â set the prompt to "What task do you want to add?"
4. Add the action **"URL"** â set it to:
   ```
   https://YOUR_DOMAIN/?addDraft=[Ask for Input result]
   ```
5. Add the action **"Open URLs"**
6. Name the shortcut "Add SkyNet Draft" (or whatever you prefer)
7. Now say: **"Hey Siri, Add SkyNet Draft"**

### Creating a "Add To Do" Shortcut (with AI Analysis)

Follow the same steps above, but use this URL in step 4:
```
https://YOUR_DOMAIN/?addTodo=[Ask for Input result]
```

Tasks added via `?addTodo=` will automatically trigger AI analysis when the board loads.

### URL Parameter Reference

| Parameter | Description | Example |
|-----------|-------------|---------|
| `?addDraft=TaskName` | Adds a task to the Draft column | `?addDraft=Buy+groceries` |
| `?addTodo=TaskName` | Adds a task to To Do (triggers AI analysis) | `?addTodo=Plan+project+meeting` |

**Tip:** URL-encode spaces as `+` or `%20`. The app handles both formats.

### Advanced: Multi-Task Shortcut

You can create a shortcut that lets you choose which column to add to:

1. Add **"Ask for Input"** â prompt: "Task name?"
2. Add **"Choose from Menu"** â options: "Draft", "To Do"
3. In the "Draft" branch: URL action with `?addDraft=[input]`
4. In the "To Do" branch: URL action with `?addTodo=[input]`
5. Add **"Open URLs"** after the menu

## Browser Compatibility

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| Core Board | Yes | Yes | Yes | Yes |
| PWA Install | Yes | Yes* | No | Yes |
| Voice Input | Yes | Yes | No | Yes |
| AI Analysis | Yes | Yes | Yes | Yes |
| Offline Mode | Yes | Yes | Yes | Yes |

*Safari PWA install uses "Add to Home Screen" from the share menu.

## Keyboard Shortcuts

The board is fully accessible via keyboard navigation. Tab through columns and tasks, use Enter to expand/collapse task details.

## Data Storage

All data is stored locally in your browser using `localStorage`. Your tasks, settings, and API key never leave your device (except API key, which is sent only to Anthropic's API for task analysis).

To back up your data, use the **Export** feature to save your board as a text file.

## Customization

### Changing the AI Model

The app uses `claude-sonnet-4-20250514` by default. To change the model, search for `claude-sonnet-4-20250514` in `index.html` and replace it with your preferred model identifier.

### Changing Colors

The primary colors are defined as CSS custom properties and Tailwind classes:
- Background: `#0f172a` (slate-900), `#1f2937` (gray-800)
- Accent: `#dc2626` (red-600)
- Terminal green: `#22c55e` (green-500)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

## License

MIT License. See [LICENSE](LICENSE) for details.

## Acknowledgments

- Built with [React 18](https://react.dev) and [Tailwind CSS](https://tailwindcss.com)
- AI powered by [Anthropic Claude](https://anthropic.com)
- Icons from [Lucide](https://lucide.dev)
- Inspired by the Terminator franchise aesthetic
