const bot = require("./telegramBot/bot.js");
const botMessages = require("./botMessages.json");
const axios = require("axios");
const prisma = require("./db/db.config.js");

/* 
* userInfo
 {
  message_id: 178,
  from: {
    id: number,
    is_bot: false,
    first_name: 'Harsh',
    last_name: 'Jha',
    username: 'harshjha872',
    language_code: 'en'
  },
  chat: {
    id: number,
    first_name: 'Harsh',
    last_name: 'Jha',
    username: 'harshjha872',
    type: 'private'
  },
  date: 1710914378,
  text: 'H'
}
*/

const unsubscribeUser = async (userInfo) => {
  const user = await prisma.user.findUnique({
    where: {
      chatId: userInfo.chat.id,
    },
  });
  if (user && user.isSub === true) {
    await prisma.user.update({
      where: {
        chatId: userInfo.chat.id,
      },
      data: {
        isSub: false,
      },
    });
    bot.sendMessage(userInfo.chat.id, "user unsubscribed");
  } else {
    bot.sendMessage(
      userInfo.chat.id,
      "user not subscribed, use /subscribe for daily weather updates"
    );
  }
};

const subscribeUser = async (userInfo) => {
  const user = await prisma.user.findUnique({
    where: {
      chatId: userInfo.chat.id,
    },
  });

  if (user) {
    if (user.isSub === true) {
      bot.sendMessage(user.chatId, "user already subscribed");
    } else {
      await prisma.user.update({
        where: {
          chatId: user.chatId,
        },
        data: {
          isSub: true,
        },
      });
      bot.sendMessage(userInfo.chat.id, "user subscribed");
    }
  } else {
    const newUser = await prisma.user.create({
      data: {
        first_name: userInfo.from.first_name,
        username: userInfo.from.username,
        chatId: userInfo.chat.id,
        created_at: new Date(userInfo.date),
        isSub: true,
      },
    });
    console.log("user added to database", newUser);
    bot.sendMessage(userInfo.chat.id, "user subscribed");
  }
};

const sayHello = async (userInfo) => {
  bot.sendMessage(
    userInfo.chat.id,
    `Hello ${userInfo.from.first_name}, Welcome to the weather bot ☁️\n\n${botMessages.instructions}`
  );
  await subscribeUser(userInfo);
};

const utils = {
  sayHello,
  subscribeUser,
  unsubscribeUser,
};

module.exports = utils;
