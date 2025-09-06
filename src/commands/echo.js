const { logEvent } = require('../middlewares/logger');

module.exports = (bot) => {
  bot.onText(/\/echo (.+)/, (msg, match) => {
    const resp = match[1];
    bot.sendMessage(msg.chat.id, resp);
    const user = msg.from?.username || msg.from?.first_name || "unknown";
    logEvent(`Команда /echo від ${user}: "${resp}"`);
  });
};
