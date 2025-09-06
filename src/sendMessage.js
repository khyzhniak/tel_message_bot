require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

bot.sendMessage(process.env.TEST_CHAT_ID, "Привіт! Це тестове повідомлення від коду 😎")
  .then(() => console.log("✅ Повідомлення надіслано"))
  .catch(err => console.error("❌ Помилка:", err));
