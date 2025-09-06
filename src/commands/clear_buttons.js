const { logEvent } = require('../middlewares/logger');

module.exports = (bot) => {
  bot.onText(/\/clear_buttons/, async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id; // ID повідомлення, до якого прикріплені кнопки

    try {
      // Очищаємо клавіатуру саме у цьому повідомленні
      await bot.editMessageReplyMarkup(
        { inline_keyboard: [] },
        { chat_id: chatId, message_id: messageId }
      );

      logEvent(`Команда /clear_buttons від ${msg.from?.username || msg.from?.first_name}`);
    } catch (error) {
      console.error("❌ Помилка при очищенні кнопок:", error);
    }
  });
};
