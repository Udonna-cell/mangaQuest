require("dotenv").config();
var createError = require("http-errors");
var mysql = require("mysql");
var express = require("express");
var path = require("path");
var fs = require("fs");
var axios = require("axios");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { Telegraf } = require("telegraf");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// con = mysql.createConnection({
//   host: "localhost",
//   user: "admin",
//   password: ""
// });

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("\nConnected!");
// });

const bot = new Telegraf(process.env.BOT_TOKEN);
let isWaitingReply = false;

// Example: Respond to /start command
bot.start((ctx) => {
  const chatId = ctx.update.message.chat.id; // Replace with your actual chat ID (without quotes)

  bot.telegram.sendPhoto(
    chatId,
    "https://raw.githubusercontent.com/Udonna-cell/mangaQuest/master/public/images/wallpaperflare.com_wallpaper%20(1).jpg",
    {
      reply_markup: {
        // inline_keyboard: [
        //     [{ text: 'test button', callback_data: 'test', hide: true }],
        // ],
      },
      caption: `Welcome ${ctx.update.message.from.first_name} ${ctx.update.message.from.last_name} to MangaQuest bot where you can easily search, read and download your favourite mangas\n\nHere are some common used commands\n\nSearch for a manga using the command /search`,
    }
  );
  // ctx.reply(`Welcome <b>${ctx.update.message.from.first_name} ${ctx.update.message.from.last_name}</b> to MangaQuest`, {parse_mode: "HTML"});
});

// Example: Handle messages containing 'hi'
bot.hears("hi", (ctx) => ctx.reply("Hey there!"));
bot.command("inline", (ctx) => {
  ctx.reply("Hi there!", {
    reply_markup: {
      inline_keyboard: [
        /* Inline buttons. 2 side-by-side */
        [
          { text: "Button 1", callback_data: "btn-1" },
          { text: "Button 2", callback_data: "btn-2" },
        ],

        /* One button */
        [{ text: "Next", callback_data: "next" }],

        /* Also, we can have URL buttons. */
        [
          {
            text: "Open in browser",
            url: "https://t.me/MangaQuest_bot/MangaQuest",
          },
        ],
      ],
    },
  });
});

bot.command("search", (ctx) => {
  isWaitingReply = true;
  ctx.reply("Enter a Manga title:");

  bot.on("text", (ctx) => {
    const chatId = ctx.update.message.chat.id;
    const userMessage = ctx.message.text; // Assign the user's message to a variable
    let Manga = {};
    axios
      .get("https://api.mangadex.org/manga", {
        params: {
          title: userMessage,
        },
      })
      .then(({ data }) => {
        Manga.id = data.data[0].id;
        Manga.type = data.data[0].type;
        Manga.title = data.data[0].attributes.title.en;
        Manga.description = data.data[0].attributes.description.en;

        let coverArt = "";
        let fileName = "";
        // getting manga cover
        axios
          .get(
            `https://api.mangadex.org/cover?limit=10&manga%5B%5D=${Manga.id}&order%5BcreatedAt%5D=asc&order%5BupdatedAt%5D=asc&order%5Bvolume%5D=asc`
          )
          .then((d) => {
            coverArt = d.data.data[0].id;

            axios
              .get(`https://api.mangadex.org/cover/${coverArt}`)
              .then((d) => {
                fileName = d.data.data.attributes.fileName;
                // console.log(fileName);
                Manga.cover = `https://uploads.mangadex.org/covers/${Manga.id}/${fileName}`;
                // console.log(Manga.cover);

                bot.telegram.sendPhoto(
                  chatId,
                  Manga.cover,
                  {
                    reply_markup: {
                      // inline_keyboard: [
                      //     [{ text: 'test button', callback_data: 'test', hide: true }],
                      // ],
                    },
                    caption: `${Manga.title}\nType: ${Manga.type}\n${Manga.description}`,
                  }
                );
              });
            // console.log(coverArt);
          });

        // console.log(Manga);
      });
    // Process the user's input as needed
    // ctx.reply(userMessage);
    // console.log(ctx.update);
  });
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

bot.launch();
module.exports = app;
