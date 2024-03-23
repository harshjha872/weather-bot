const express = require("express");
const app = express();
const cors = require("cors");
const bot = require("./telegramBot/bot");
const utils = require("./util");
const cron = require("cron");

app.use(cors());

const cronTest = new cron.CronJob("* * * * *", () => {
  console.log("cron just ran brrrrrrrrrrrrrr");
});

// cronTest.start();

const PORT = 8080;

const reservedTexts = ["/start", "/subscribe", "/unsubscribe", "/checkstatus"];

bot.on("message", async (msg) => {
  if (!reservedTexts.includes(msg.text) && !msg.location) {
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

app.get("/", (req, res) => {
  res.json({ msg: "what's up bot!!!" });
});

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
