const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../../data.json');

let data = {
  currentWord: null,
  words: {},
  interval: { start_hour: 7, end_hour: 22, minutes: 60 } // додано поле minutes
};

function loadData() {
  if (fs.existsSync(DATA_PATH)) {
    data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  }
}

function saveData() {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function addWord(word) {
  if (!data.words[word]) {
    data.words[word] = { phrases: [] };
    if (!data.currentWord) data.currentWord = word;
    saveData();
    return true;
  }
  return false;
}

function setCurrentWord(word) {
  if (data.words[word]) {
    data.currentWord = word;
    saveData();
    return true;
  }
  return false;
}

function addPhrase(word, phrase) {
  if (!data.words[word]) return false;
  data.words[word].phrases.push({ text: phrase, count: 0 });
  saveData();
  return true;
}

function getRandomPhrase() {
  const word = data.currentWord;
  if (!word || !data.words[word] || data.words[word].phrases.length === 0) return null;
  const phrases = data.words[word].phrases;
  const idx = Math.floor(Math.random() * phrases.length);
  phrases[idx].count += 1;
  saveData();
  return phrases[idx].text;
}

function getSettings() {
  return { currentWord: data.currentWord, interval: data.interval };
}

function setIntervalHours(start, end) {
  data.interval.start_hour = start;
  data.interval.end_hour = end;
  saveData();
}

// Новий метод для зміни інтервалу хвилин
function setIntervalMinutes(minutes) {
  data.interval.minutes = minutes;
  saveData();
}

function getInterval() {
  return data.interval;
}

function listWords() {
  return Object.keys(data.words);
}

function listPhrases(word) {
  if (!data.words[word]) return null;
  return data.words[word].phrases;
}

function deleteWord(word) {
  if (!data.words[word]) return false;
  delete data.words[word];
  if (data.currentWord === word) data.currentWord = Object.keys(data.words)[0] || null;
  saveData();
  return true;
}

function deletePhrase(word, index) {
  if (!data.words[word] || index < 0 || index >= data.words[word].phrases.length) return false;
  data.words[word].phrases.splice(index, 1);
  saveData();
  return true;
}

module.exports = {
  loadData,
  addWord,
  setCurrentWord,
  addPhrase,
  getRandomPhrase,
  getSettings,
  setIntervalHours,
  setIntervalMinutes,
  getInterval,
  listWords,
  listPhrases,
  deleteWord,
  deletePhrase
};