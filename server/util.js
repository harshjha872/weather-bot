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
    bot.sendMessage(userInfo.chat.id, "You are now unsubscribed :(");
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
      `Thanks ${userInfo.from.first_name} for sharing your location, you are now subscribed to daily weather report of your location.`
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

//* send weather update to subs

const sendWeatherDataToSubs = async () => {
  const subscribeUsers = await prisma.user.findMany({
    where: {
      isSub: true,
    },
  });

  subscribeUsers.forEach(async (user) => {
    const weatherData = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
        user.latitude +
        "&lon=" +
        user.longitude +
        "&appid=e69c31ccd31205ed81fc6df0c2580a19"
    );

    const temperature = `${(weatherData.data.main.temp - 273.15).toFixed(2)}°C`;
    const weatherDes = weatherData.data.weather[0].description;

    bot.sendMessage(
      user.chatId,
      `Hii ${user.first_name}, Today we are having ${weatherDes} with a temperature of ${temperature}`
    );
  });
};

// {
//     "coord": {
//         "lon": 78.5992,
//         "lat": 25.4296
//     },
//     "weather": [
//         {
//             "id": 800,
//             "main": "Clear",
//             "description": "clear sky",
//             "icon": "01d"
//         }
//     ],
//     "base": "stations",
//     "main": {
//         "temp": 310.95,
//         "feels_like": 307.87,
//         "temp_min": 310.95,
//         "temp_max": 310.95,
//         "pressure": 1003,
//         "humidity": 8,
//         "sea_level": 1003,
//         "grnd_level": 976
//     },
//     "visibility": 10000,
//     "wind": {
//         "speed": 5.23,
//         "deg": 316,
//         "gust": 5.33
//     },
//     "clouds": {
//         "all": 6
//     },
//     "dt": 1711191176,
//     "sys": {
//         "country": "IN",
//         "sunrise": 1711154778,
//         "sunset": 1711198673
//     },
//     "timezone": 19800,
//     "id": 1269006,
//     "name": "Jhānsi",
//     "cod": 200
// }

const utils = {
  sayHello,
  subscribeUser,
  unsubscribeUser,
  onLocation,
  checkstatus,
  sendWeatherDataToSubs,
};

module.exports = utils;
