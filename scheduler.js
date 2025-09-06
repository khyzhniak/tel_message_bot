const TelegramBot = require('node-telegram-bot-api');
const token = 'YOUR_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

const wordService = require('./src/services/wordService');
wordService.loadData();

require('./src/commands/commands')(bot);

// Відправка повідомлень по інтервалу
setInterval(() => {
  const now = new Date();
  const hour = now.getHours();
  const settings = wordService.getSettings();
  if (hour >= settings.interval.start_hour && hour <= settings.interval.end_hour) {
    const phrase = wordService.getRandomPhrase();
    if (phrase) {
      // Заміни CHAT_ID на свій або зберігай userId при взаємодії
      bot.sendMessage(CHAT_ID, phrase);
    }
  }
}, 60 * 60 * 1000); // кожну годину
