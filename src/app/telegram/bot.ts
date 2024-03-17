'use server';

import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(`${process.env.TELEGRAM_BOT_TOKEN}`, { polling: true })

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(chatId)
    bot.sendMessage(chatId, 'Received your message');
})

export default bot;