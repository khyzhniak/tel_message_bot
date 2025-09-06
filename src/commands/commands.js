const wordService = require('../services/wordService');

module.exports = (bot) => {

  bot.onText(/\/addword (.+)/, (msg, match) => {
    const word = match[1];
    if (wordService.addWord(word)) {
      bot.sendMessage(msg.chat.id, `Слово "${word}" додано.`);
    } else {
      bot.sendMessage(msg.chat.id, `Слово "${word}" вже існує.`);
    }
  });

  bot.onText(/\/setword (.+)/, (msg, match) => {
    const word = match[1];
    if (wordService.setCurrentWord(word)) {
      bot.sendMessage(msg.chat.id, `Поточне слово змінено на "${word}".`);
    } else {
      bot.sendMessage(msg.chat.id, `Слово "${word}" не знайдено.`);
    }
  });

  bot.onText(/\/addphrase (\S+) (.+)/, (msg, match) => {
    const word = match[1];
    const phrase = match[2];
    if (wordService.addPhrase(word, phrase)) {
      bot.sendMessage(msg.chat.id, `Фраза додана до слова "${word}".`);
    } else {
      bot.sendMessage(msg.chat.id, `Слово "${word}" не знайдено.`);
    }
  });

  bot.onText(/\/setinterval (\d+)-(\d+)/, (msg, match) => {
    const start = parseInt(match[1]);
    const end = parseInt(match[2]);
    wordService.setIntervalHours(start, end);
    bot.sendMessage(msg.chat.id, `Інтервал відправки встановлено з ${start} до ${end}.`);
  });

  bot.onText(/\/listwords/, (msg) => {
    const words = wordService.listWords();
    bot.sendMessage(msg.chat.id, `Слова: ${words.join(', ')}`);
  });

  bot.onText(/\/listphrases (.+)/, (msg, match) => {
    const word = match[1];
    const phrases = wordService.listPhrases(word);
    if (!phrases) return bot.sendMessage(msg.chat.id, `Слово "${word}" не знайдено.`);
    const text = phrases.map((p, i) => `${i+1}. ${p.text} (показано: ${p.count})`).join('\n');
    bot.sendMessage(msg.chat.id, text);
  });

  bot.onText(/\/currentsettings/, (msg) => {
    const settings = wordService.getSettings();
    bot.sendMessage(msg.chat.id, `Поточне слово: ${settings.currentWord}\nІнтервал: ${settings.interval.start_hour} - ${settings.interval.end_hour}`);
  });

};
