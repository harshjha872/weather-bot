const TelegramBot = require("node-telegram-bot-api");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

const bot = new TelegramBot(`${process.env.TELEGRAM_BOT_TOKEN}`, {
  polling: true,
});

module.exports = bot;
