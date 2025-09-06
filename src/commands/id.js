const { logEvent } = require('../middlewares/logger');

module.exports = (bot) => {
  bot.onText(/\/id/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Твій CHAT_ID: ${chatId}`);
    const user = msg.from?.username || msg.from?.first_name || "unknown";
    logEvent(`Команда /id від ${user} (chatId: ${chatId})`);
  });
};
