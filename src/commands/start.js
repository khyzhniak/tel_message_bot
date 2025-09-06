const { logEvent } = require('../middlewares/logger');

module.exports = (bot) => {
  bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Привіт 👋 Я твій масштабований бот!");
    const user = msg.from?.username || msg.from?.first_name || "unknown";
    logEvent(`Команда /start від ${user}`);
  });
};
