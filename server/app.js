const express = require("express");
const app = express();
const cors = require("cors");
const bot = require("./telegramBot/bot");
const utils = require("./util");
const cron = require("cron");

const cronTest = new cron.CronJob("* * * * *", () => {
  console.log("cron just ran brrrrrrrrrrrrrr");
});

// cronTest.start();

const PORT = 8080;

bot.on("message", utils.sayHello);

bot.on("location", (msg) => {
  console.log(msg.location.latitude);
  console.log(msg.location.longitude);
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if (msg.location) {
    const latitude = msg.location.latitude;
    const longitude = msg.location.longitude;

    // Now you have latitude and longitude, you can use it as needed
    console.log(`Received location: (${latitude}, ${longitude})`);
    bot.sendMessage(chatId, `Thanks for sharing your location!`);
  } else {
    bot.sendMessage(chatId, "Please share your location.");
  }
});

app.use(cors());

app.get("/", (req, res) => {
  res.json({ msg: "what's up bot!!!" });
});

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
