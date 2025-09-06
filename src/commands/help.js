const { logEvent } = require('../middlewares/logger');

module.exports = (bot) => {
  bot.onText(/\/help/, (msg) => {
    const helpText = `/start - почати\n/help - допомога\n/echo <текст> - повторити текст\n/id - дізнатися свій CHAT_ID`;
    bot.sendMessage(msg.chat.id, helpText);
    const user = msg.from?.username || msg.from?.first_name || "unknown";
    logEvent(`Команда /help від ${user}`);
  });
};
