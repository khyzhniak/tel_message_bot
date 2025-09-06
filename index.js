require('dotenv').config();
const { bot } = require('./src/bot');
const wordService = require('./src/services/wordService');

wordService.loadData();
const users = new Set();
const userStates = {}; // chatId -> { action, tempWord }

function showMainMenu(chatId) {
  const keyboard = {
    reply_markup: {
      keyboard: [
        [{ text:'Додати слово' }, { text:'Додати фразу' }],
        [{ text:'Додати фрази списком' }, { text:'Видалити слово' }],
        [{ text:'Видалити фразу' }, { text:'Поточне слово' }],
        [{ text:'Список слів' }, { text:'Список фраз' }],
        [{ text:'Встановити інтервал' }],
        [{ text:'Головне меню' }]
      ],
      resize_keyboard:true,
      one_time_keyboard:false
    }
  };
  bot.sendMessage(chatId, 'Виберіть команду:', keyboard);
}

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  users.add(chatId);

  if (text === 'Головне меню') {
    showMainMenu(chatId);
    delete userStates[chatId];
    return;
  }

  const state = userStates[chatId];

  if (state) {
    switch (state.action) {
      case 'addWord':
        if (wordService.addWord(text)) bot.sendMessage(chatId, `✅ Слово "${text}" додано.`);
        else bot.sendMessage(chatId, `⚠ Слово "${text}" вже існує.`);
        delete userStates[chatId];
        showMainMenu(chatId);
        break;

      case 'addPhrase':
        if (!state.tempWord) {
          if (!wordService.listWords().includes(text)) return bot.sendMessage(chatId, `⚠ Слово "${text}" не знайдено.`);
          state.tempWord = text;
          bot.sendMessage(chatId, `Введіть фразу для слова "${text}":`);
        } else {
          wordService.addPhrase(state.tempWord, text);
          bot.sendMessage(chatId, `✅ Фраза додана для слова "${state.tempWord}".`);
          delete userStates[chatId];
          showMainMenu(chatId);
        }
        break;

      case 'addPhrasesList':
        if (!state.tempWord) {
          if (!wordService.listWords().includes(text)) return bot.sendMessage(chatId, `⚠ Слово "${text}" не знайдено.`);
          state.tempWord = text;
          bot.sendMessage(chatId, `Введіть фрази через новий рядок для слова "${text}":`);
        } else {
          const phrases = text.split('\n').map(p=>p.trim()).filter(p=>p);
          phrases.forEach(p => wordService.addPhrase(state.tempWord, p));
          bot.sendMessage(chatId, `✅ Додано ${phrases.length} фраз для слова "${state.tempWord}".`);
          delete userStates[chatId];
          showMainMenu(chatId);
        }
        break;

      case 'deleteWord':
        if (wordService.deleteWord(text)) bot.sendMessage(chatId, `✅ Слово "${text}" видалено.`);
        else bot.sendMessage(chatId, `⚠ Слово "${text}" не знайдено.`);
        delete userStates[chatId];
        showMainMenu(chatId);
        break;

      case 'deletePhrase':
        if (!state.tempWord) {
          if (!wordService.listWords().includes(text)) return bot.sendMessage(chatId, `⚠ Слово "${text}" не знайдено.`);
          state.tempWord = text;
          const list = wordService.listPhrases(text).map((p,i)=>`${i+1}. ${p.text}`).join('\n');
          bot.sendMessage(chatId, `Введіть номер фрази для видалення:\n${list}`);
        } else {
          const idx = parseInt(text)-1;
          if (isNaN(idx)||idx<0||idx>=wordService.listPhrases(state.tempWord).length) return bot.sendMessage(chatId,'⚠ Невірний номер.');
          wordService.deletePhrase(state.tempWord, idx);
          bot.sendMessage(chatId, `✅ Фраза видалена зі слова "${state.tempWord}".`);
          delete userStates[chatId];
          showMainMenu(chatId);
        }
        break;

      case 'setInterval':
        const minutes = parseInt(text);
        if(!isNaN(minutes) && minutes>0){
          wordService.setIntervalMinutes(minutes);
          bot.sendMessage(chatId, `✅ Фрази будуть надсилатися кожні ${minutes} хвилин між 7:00 та 22:00`);
        } else {
          bot.sendMessage(chatId, `⚠ Введіть число хвилин, наприклад: 30`);
        }
        delete userStates[chatId];
        showMainMenu(chatId);
        break;

      case 'listPhrases':
        const phrases = wordService.listPhrases(text);
        if (!phrases) bot.sendMessage(chatId, `⚠ Слово "${text}" не знайдено.`);
        else bot.sendMessage(chatId, phrases.map((p,i)=>`${i+1}. ${p.text} (показано: ${p.count})`).join('\n')||'Фраз немає.');
        delete userStates[chatId];
        showMainMenu(chatId);
        break;
    }
    return;
  }

  switch (text) {
    case '/start':
      showMainMenu(chatId);
      break;
    case 'Додати слово':
      userStates[chatId] = { action:'addWord' };
      bot.sendMessage(chatId,'Введіть слово:');
      break;
    case 'Додати фразу':
      userStates[chatId] = { action:'addPhrase', tempWord:null };
      bot.sendMessage(chatId,'Введіть слово:');
      break;
    case 'Додати фрази списком':
      userStates[chatId] = { action:'addPhrasesList', tempWord:null };
      bot.sendMessage(chatId,'Введіть слово:');
      break;
    case 'Видалити слово':
      userStates[chatId] = { action:'deleteWord' };
      bot.sendMessage(chatId,'Введіть слово для видалення:');
      break;
    case 'Видалити фразу':
      userStates[chatId] = { action:'deletePhrase', tempWord:null };
      bot.sendMessage(chatId,'Введіть слово:');
      break;
    case 'Поточне слово':
      bot.sendMessage(chatId, `Поточне слово: ${wordService.getSettings().currentWord}`);
      break;
    case 'Список слів':
      bot.sendMessage(chatId, wordService.listWords().join(', ')||'Список слів порожній.');
      break;
    case 'Список фраз':
      userStates[chatId] = { action:'listPhrases' };
      bot.sendMessage(chatId,'Введіть слово для перегляду фраз:');
      break;
    case 'Встановити інтервал':
      userStates[chatId] = { action:'setInterval' };
      bot.sendMessage(chatId,'Введіть інтервал у хвилинах:');
      break;
    default:
      bot.sendMessage(chatId,'⚠ Натисніть кнопку з меню або "Головне меню" для повернення.');
  }
});

// Scheduler з урахуванням хвилинного інтервалу
let lastSentTime = 0;
setInterval(()=>{
  const now = new Date();
  const interval = wordService.getInterval();
  const currentMinutes = now.getHours()*60 + now.getMinutes();
  const startMinutes = interval.start_hour*60;
  const endMinutes = interval.end_hour*60;

  if(currentMinutes >= startMinutes && currentMinutes <= endMinutes){
    if(currentMinutes - lastSentTime >= interval.minutes){
      const phrase = wordService.getRandomPhrase();
      if(phrase) users.forEach(chatId => bot.sendMessage(chatId, phrase));
      lastSentTime = currentMinutes;
    }
  }
}, 60*1000);

console.log("✅ Бот запущений і слухає повідомлення...");