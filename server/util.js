const bot = require("./telegramBot/bot");
const botMessages = require("./botMessages.json");

const utils = {
  sayHello(userInfo) {
    bot.sendMessage(
      userInfo.chat.id,
      `Hello ${userInfo.from.first_name}, Welcome to the weather bot ☁️\n\n${botMessages.instructions}`
    );
  },
};

module.exports = utils;
