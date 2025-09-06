// src/services/scheduler.js
const wordService = require('./wordService');

let intervalHandle = null;

function startScheduler(bot, chatId) {
  if (intervalHandle) clearInterval(intervalHandle);

  intervalHandle = setInterval(() => {
    const now = new Date();
    const hour = now.getHours();
    const settings = wordService.getSettings();
    if (hour >= settings.interval.start_hour && hour <= settings.interval.end_hour) {
      const phrase = wordService.getRandomPhrase();
      if (phrase) {
        bot.sendMessage(chatId, phrase);
      }
    }
  }, 60 * 60 * 1000); // кожну годину
}

module.exports = { startScheduler };
