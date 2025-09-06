const TelegramBot = require('node-telegram-bot-api');
const { TOKEN } = require('./config/config');
const { logMessage, logError, logEvent } = require('./middlewares/logger');

// 1️⃣ Створюємо бота
const bot = new TelegramBot(TOKEN, { polling: true });

// 2️⃣ Логування
bot.on('message', (msg) => logMessage(msg));
bot.on('polling_error', (err) => logError(err));
bot.on('webhook_error', (err) => logError(err));

logEvent("Бот підключився до Telegram API");

// 3️⃣ Підключення команд
require('./commands/start')(bot);
require('./commands/help')(bot);
require('./commands/echo')(bot);
require('./commands/id')(bot);
require('./commands/clear_buttons')(bot);

// 4️⃣ Експорт бота
module.exports = { bot };
