# Bun-Discord-Bot: Simple Discord Multi-Language Bot

A lightweight, interactive Discord bot built with **TypeScript** and **Bun**. Supports direct messages, multi-language responses, and button-based language switching. Designed for zero-config execution using Bun's native runtime features.

## ✨ Features
- 🌍 Multi-language support (English & Spanish by default, easily extensible)
- 💬 Works in both servers and direct messages
- 🖱️ Interactive button-based language selection
- ⚡ Powered by Bun (native TS execution, fast startup, zero build step)
- 📦 Minimal dependencies (`discord.js` only)
- 🔒 Secure token handling via `.env`
- 📝 Customizable responses via `messages.json`

## 📋 Requirements
- [Bun](https://bun.sh/) `v1.0.0` or higher *(required for `Bun.file`, `Bun.inspect`, and top-level `await`)*
- A Discord Application & Bot Token
- Git (optional)

> ⚠️ **Node.js is not supported.** This bot uses Bun-native APIs and will not run on Node without significant refactoring.

## 🚀 Quick Setup

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd <repo-folder>
bun install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
BOT_TOKEN=your_discord_bot_token_here
```
*(No quotes, no spaces around `=`)*

### 3. Enable Discord Intents
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application → **Bot** tab
3. Scroll to **Privileged Gateway Intents** and enable:
   - ✅ `MESSAGE CONTENT INTENT` **(Required)**
   - ✅ `SERVER MEMBERS INTENT` (recommended)
4. Go to **OAuth2 → URL Generator**
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: `Send Messages`, `Read Message History`, `Use External Emojis`
   - Copy the generated URL and invite the bot to your server

### 4. Run
```bash
bun run bot.ts
```
Expected output:
```
[DD.MM.YYYY, HH:MM:SS] ✅ Ready! Logged in as YourBot#1234
```

## 📝 Message Configuration
The bot includes built-in fallback messages. To customize them, create `messages.json` in the root directory:
```json
{
  "en": {
    "welcome": { "text": "👋 Hello! Welcome." },
    "default_response": { "text": "Message received!" },
    "language_prompt": { "text": "🌍 Choose language:" },
    "language_changed": { "text": "✅ Language updated." },
    "help": { "text": "📖 Commands:\n/start\n/language\n/help" }
  },
  "es": {
    "welcome": { "text": "👋 ¡Hola!" },
    "default_response": { "text": "¡Mensaje recibido!" },
    "language_prompt": { "text": "🌍 Elige idioma:" },
    "language_changed": { "text": "✅ Idioma actualizado." },
    "help": { "text": "📖 Comandos:\n/start\n/language\n/help" }
  }
}
```
Add more languages by following the same structure. The bot loads them automatically on startup.

## 📁 Project Structure
```
├── bot.ts              # Main bot logic
├── .env                # Environment variables (gitignored)
├── messages.json       # Optional custom messages
├── package.json        # Dependencies & metadata
├── .gitignore          # Ignores .env, node_modules, etc.
└── README.md           # This file
```

## ⚠️ Important Notes
- **DM Support**: You can DM the bot directly, but Discord requires you to share at least one server with it first.
- **No Webhooks**: This is a full bot user using Discord's WebSocket gateway. Webhooks are neither used nor required.
- **Security**: Never commit `.env` or `BOT_TOKEN` to version control. A `.gitignore` is included for safety.
- **Timezone**: Logs use `Europe/Moscow`. Change `timeZone` in the logger block if needed.

## 🔍 Troubleshooting
| Issue | Solution |
|-------|----------|
| `❌ BOT_TOKEN is missing!` | Create `.env` with `BOT_TOKEN=...` (no quotes/spaces) |
| Bot doesn't respond to messages | Enable `MESSAGE CONTENT INTENT` in Discord Developer Portal |
| `messages.json file not found!` | Normal. Bot uses built-in defaults. Create the file to customize. |
| `SyntaxError` in `messages.json` | Invalid JSON. Validate with [JSONLint](https://jsonlint.com) |
| Can't DM the bot | You must share a server with it. Check `Settings → Privacy & Safety → Allow DMs from server members` |

## 📜 License & Credits
- **Author**: Ivan Deus
- **Runtime**: [Bun](https://bun.sh/)
- **Library**: [discord.js v14](https://discord.js.org/)
- **License**: MIT

---
💡 *Found a bug or want to contribute? Open an issue or pull request!* 🚀
```
2026 [ ivan deus ]
