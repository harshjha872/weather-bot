const express = require("express");
const app = express();
const cors = require("cors");
const bot = require("./telegramBot/bot");
const utils = require("./util");
const cron = require("cron");
const axios = require("axios");

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

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
