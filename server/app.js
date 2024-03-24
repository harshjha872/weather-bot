const express = require("express");
const app = express();
const cors = require("cors");
const bot = require("./telegramBot/bot");
const utils = require("./util");
const cron = require("cron");
const axios = require("axios");
const prisma = require("./db/db.config");
const bodyparser = require("body-parser");

// Body-parser middleware
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(cors());

const PORT = 8080;

const botCommands = ["/start", "/subscribe", "/unsubscribe", "/checkstatus"];

bot.on("message", async (msg) => {
  if (!botCommands.includes(msg.text) && !msg.location) {
    console.log(msg);
    bot.sendMessage(
      msg.chat.id,
      `Hello ${msg.from.first_name}, use /start for more details about using this bot if you're not already subsribed`
    );
  }
});

bot.onText(/\/start/, utils.sayHello);

bot.onText(/\/subscribe/, utils.subscribeUser);

bot.onText(/\/unsubscribe/, utils.unsubscribeUser);

bot.onText(/\/checkstatus/, utils.checkstatus);

bot.on("location", utils.onLocation);

const sendingWeatherUpdateToSubscribers = new cron.CronJob(
  "0 11,17 * * *",
  utils.sendWeatherDataToSubs
);

// const sendingWeatherUpdateToSubscribers = new cron.CronJob(
//   "* * * * *",
//   utils.sendWeatherDataToSubs
// );

sendingWeatherUpdateToSubscribers.start();

app.get("/", (req, res) => {
  res.json({ msg: "what's up bot!!!" });
});

app.get("/getAllUsers", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/deleteUser", async (req, res) => {
  const { chatId } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        chatId: chatId,
      },
    });
    if (user) {
      await prisma.user.delete({
        where: {
          chatId: chatId,
        },
      });
      res.json({ msg: "User deleted" });
    } else {
      res.json({ msg: "User not found" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/unsubUser", async (req, res) => {
  const { chatId } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        chatId: chatId,
      },
    });
    if (user && user.isSub) {
      await prisma.user.update({
        where: {
          chatId: chatId,
        },
        data: {
          isSub: false,
        },
      });
      res.json({ msg: "User unsubscribed" });
    } else if (!user.isSub) {
      res.json({ msg: "User already not subscribed" });
    } else {
      res.json({ msg: "User not found" });
    }
  } catch (err) {
    console.log(err);
  }
});
app.post("/makeSub", async (req, res) => {
  const { chatId } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        chatId: chatId,
      },
    });
    if (user && !user.isSub) {
      await prisma.user.update({
        where: {
          chatId: chatId,
        },
        data: {
          isSub: true,
        },
      });
      res.json({ msg: "User subscribed" });
    } else if (user.isSub) {
      res.json({ msg: "User already subscribed" });
    } else {
      res.json({ msg: "User not found" });
    }
  } catch (err) {
    console.log(err);
  }
});
app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
