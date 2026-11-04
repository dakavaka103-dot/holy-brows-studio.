# Holy Brows Telegram backend

Render settings: Root Directory `backend` (if files are in a backend folder), Build `npm install`, Start `npm start`.
Set private environment variables in Render: `BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `ALLOWED_ORIGIN` (exact Netlify site URL).
Never commit `.env` or expose the bot token in frontend code.

The bot account must have sent `/start` to @HolyBrowsStudio_bot before it can receive messages.
