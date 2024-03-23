const bot = require("./telegramBot/bot");
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

//* unsubscribe User

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
    bot.sendMessage(userInfo.chat.id, "user unsubscribed :(");
  } else {
    bot.sendMessage(
      userInfo.chat.id,
      `Hey ${userInfo.from.first_name}, You're not subscribed yet, Please share your location to subscribe for daily weather updates, if already did then use /subscribe`
    );
  }
};

//* On getting location from the user

const onLocation = async (userInfo) => {
  const user = await prisma.user.findUnique({
    where: {
      chatId: userInfo.chat.id,
    },
  });

  if (user) {
    if (user.isSub) {
      bot.sendMessage(
        user.chatId,
        `Hey ${userInfo.from.first_name}, You're already subscribed`
      );
    } else {
      await prisma.user.update({
        where: {
          chatId: user.chatId,
        },
        data: {
          isSub: true,
        },
      });
      bot.sendMessage(
        userInfo.chat.id,
        `Hey ${userInfo.from.first_name}, You're now subscribed again, no need to send location if already did once`
      );
    }
  } else {
    const newUser = await prisma.user.create({
      data: {
        first_name: userInfo.from.first_name,
        username: userInfo.from.username || null,
        chatId: userInfo.chat.id,
        created_at: new Date(userInfo.date),
        isSub: true,
        latitude: userInfo.location.latitude,
        longitude: userInfo.location.longitude,
      },
    });
    console.log("user added to database", newUser);
    bot.sendMessage(
      userInfo.chat.id,
      `Thanks ${userInfo.from.first_name} for sharing your location!, you are now subscribed to daily weather report of your location.`
    );
  }
};

//* /start message

const sayHello = (userInfo) => {
  bot.sendMessage(
    userInfo.chat.id,
    `Hello ${userInfo.from.first_name}, Welcome to the weather bot ☁️\n\n${botMessages.instructions}`
  );
};

//* subscribe already existing user

const subscribeUser = async (userInfo) => {
  const user = await prisma.user.findUnique({
    where: {
      chatId: userInfo.chat.id,
    },
  });

  if (user) {
    if (user.isSub)
      bot.sendMessage(
        userInfo.chat.id,
        `Hey ${userInfo.from.first_name}, You're already subscribed`
      );
    else {
      await prisma.user.update({
        where: {
          chatId: userInfo.chat.id,
        },
        data: {
          isSub: true,
        },
      });
      bot.sendMessage(
        userInfo.chat.id,
        `Hello ${userInfo.from.first_name}, you're now subscribed`
      );
    }
  } else {
    bot.sendMessage(
      userInfo.chat.id,
      "Please share your location to subscribe"
    );
  }
};

//* check status of the bot

const checkstatus = async (userInfo) => {
  const user = await prisma.user.findUnique({
    where: {
      chatId: userInfo.chat.id,
    },
  });

  if (user) {
    bot.sendMessage(
      userInfo.chat.id,
      `Hello ${
        user.first_name
      }, seems like you've used this bot before, you're currently ${
        user.isSub ? "subscribed" : "unsubscribed"
      }`
    );
  } else {
    bot.sendMessage(
      userInfo.chat.id,
      `Hello ${userInfo.from.first_name}, seems like you've not used this bot before, use /start for more details`
    );
  }
};

const utils = {
  sayHello,
  subscribeUser,
  unsubscribeUser,
  onLocation,
  checkstatus,
};

module.exports = utils;
