// src/middlewares/logger.js
const chalk = require('chalk');

function logMessage(msg) {
  const from = msg.from?.username || msg.from?.first_name || "unknown";
  console.log(chalk.blue(`[MESSAGE ${new Date().toISOString()}]`) + ' ' + chalk.green(`${from}: ${msg.text}`));
}

function logError(error) {
  console.error(chalk.red(`[ERROR ${new Date().toISOString()}]`) + ' ' + error.message);
}

function logEvent(event) {
  console.log(chalk.yellow(`[EVENT ${new Date().toISOString()}]`) + ' ' + event);
}

module.exports = { logMessage, logError, logEvent };
