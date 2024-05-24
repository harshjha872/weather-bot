const express = require("express");
const app = express();
const cors = require("cors");
// const bot = require("./telegramBot/bot");
const utils = require("./util");
const cron = require("cron");
const axios = require("axios");
const prisma = require("./db/db.config");
const bodyparser = require("body-parser");
const nodemailer = require("nodemailer");
const Parser = require("rss-parser");
// Body-parser middleware
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(cors());

const PORT = 8080;

// const botCommands = ["/start", "/subscribe", "/unsubscribe", "/checkstatus"];

// bot.on("message", async (msg) => {
//   if (!botCommands.includes(msg.text) && !msg.location) {
//     console.log(msg);
//     bot.sendMessage(
//       msg.chat.id,
//       `Hello ${msg.from.first_name}, use /start for more details about using this bot if you're not already subsribed`
//     );
//   }
// });

// bot.onText(/\/start/, utils.sayHello);

// bot.onText(/\/subscribe/, utils.subscribeUser);

// bot.onText(/\/unsubscribe/, utils.unsubscribeUser);

// bot.onText(/\/checkstatus/, utils.checkstatus);

// bot.on("location", utils.onLocation);

const crontest = new cron.CronJob("*/10 * * * *", async () => {
  const news = await fetchAINews();
  const allusers = await prisma.subscribers.findMany();
  const receivers = allusers.map((user) => user.email).join(",");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dailyainews2024",
      pass: process.env.MAIL_PASSWORD,
    },
  });

  if (news.length > 0) {
    let newsHtml = "";
    news.forEach((singleNews) => {
      newsHtml += `<div>${singleNews.categories[0]} - ${singleNews.description}<a href="${singleNews.link}" target="_blank"> more</a></div><br>`;
    });

    const info = await transporter.sendMail({
      from: '"Daily AI" <dailyainews2024@gmail.com>', // sender address
      subject: "Your daily AI News is here", // Subject line
      text: "This is daily ai test", // plain text body
      html: `<b>Latest AI News</b><br><br>${newsHtml}`, // html body
      bcc: `${receivers}`,
    });
    console.log("info", info);
  }
});

crontest.start();

// const sendingWeatherUpdateToSubscribers = new cron.CronJob(
//   "* * * * *",
//   utils.sendWeatherDataToSubs
// );

app.get("/", (req, res) => {
  res.json({ msg: "what's up bot!!!" });
});

app.get("/getAllUsers", async (req, res) => {
  const users = await prisma.subscribers.findMany();
  res.json(users);
});

// app.post("/deleteUser", async (req, res) => {
//   const { chatId } = req.body;
//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         chatId: chatId,
//       },
//     });
//     if (user) {
//       await prisma.user.delete({
//         where: {
//           chatId: chatId,
//         },
//       });
//       res.json({ msg: "User deleted" });
//     } else {
//       res.json({ msg: "User not found" });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post("/unsubUser", async (req, res) => {
//   const { chatId } = req.body;
//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         chatId: chatId,
//       },
//     });
//     if (user && user.isSub) {
//       await prisma.user.update({
//         where: {
//           chatId: chatId,
//         },
//         data: {
//           isSub: false,
//         },
//       });
//       res.json({ msg: "User unsubscribed" });
//     } else if (!user.isSub) {
//       res.json({ msg: "User already not subscribed" });
//     } else {
//       res.json({ msg: "User not found" });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post("/makeSub", async (req, res) => {
//   const { chatId } = req.body;
//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         chatId: chatId,
//       },
//     });
//     if (user && !user.isSub) {
//       await prisma.user.update({
//         where: {
//           chatId: chatId,
//         },
//         data: {
//           isSub: true,
//         },
//       });
//       res.json({ msg: "User subscribed" });
//     } else if (user.isSub) {
//       res.json({ msg: "User already subscribed" });
//     } else {
//       res.json({ msg: "User not found" });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});

async function fetchAINews() {
  try {
    const parser = new Parser();

    const feed = await parser.parseURL(
      "https://www.artificialintelligence-news.com/feed/rss/"
    );

    const aiNews = feed.items.map((item) => ({
      title: item.title,
      description: item.contentSnippet,
      link: item.link,
      date: item.isoDate,
      categories: item.categories,
      creator: item.creator,
    }));

    return aiNews;
  } catch (error) {
    console.error("Error fetching AI news:", error);
    return [];
  }
}
