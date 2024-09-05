require("dotenv").config();
var createError = require("http-errors");
var mysql = require("mysql");
var express = require("express");
var path = require("path");
var fs = require("fs");
const axios = require("axios");

var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { Telegraf } = require("telegraf");

const Search = require("./utility/search");
const trim = require("./utility/trim");
const generateUniqueId = require("./utility/generateUniqueId");
const getManga = require("./utility/getManga")
const getRating = require("./utility/getRating")
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const { Markup } = require("telegraf");

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
let userMessage = "mangaQuest";
let chatId = 0;
let totalManga = 0;
let mangaIndex = 0;
let msgId = 0;

// Example: Respond to /start command
// bot.start((ctx) => {
//   const chatId = ctx.update.message.chat.id; // Replace with your actual chat ID (without quotes)

//   // ctx.reply(`Welcome <b>${ctx.update.message.from.first_name} ${ctx.update.message.from.last_name}</b> to MangaQuest`, {parse_mode: "HTML"});
// });
bot.start((ctx) => {
  chatId = ctx.update.message.chat.id;
  // const chatId = ctx.update.message.chat.id;
  const args = ctx.message.text.split(" ");
  if (args.length > 1) {
    const param = args[1]; // Extract the parameter after /start
    if (param.startsWith("search_")) {
      const searchTerm = param.replace("search_", "");
      // Handle the search term
      userMessage = searchTerm;
      console.log(userMessage);
      async function smaile(txt) {
        const { data } = await axios.get(
          `https://api.mangadex.org/manga/${txt}?includes[]=author&includes[]=artist&includes[]=cover_art`,
          {
            params: { limit: 1, offset: 0 },
          }
        );
        let {relationships, attributes, id} = data.data
        let {title, description, year} = attributes
        let cover = relationships.filter(obj => obj.type == "cover_art")
        cover = `https://uploads.mangadex.org/covers/${id}/${cover[0].attributes.fileName}`
        // console.log(cover);
        let rate = await getRating(id);
        rate = rate.toFixed(2)


        // search(data.data.attributes.title.en, chatId, 1, mangaIndex);
        bot.telegram.sendPhoto(chatId, cover, {
          reply_markup: {
            inline_keyboard: [
              // [
              //   { text: "PREV", callback_data: "prev", hide: true },
              //   {
              //     text: `${mangaIndex + 1} / ${results}`,
              //     callback_data: "test",
              //     hide: true,
              //   },
              //   { text: "NEXT", callback_data: "next", hide: true },
              // ],
              [{ text: "Download 🚀", callback_data: "btn_1", hide: true }],
            ],
          },
          caption: `📖${title.en}\nRate: ${rate}⭐️⭐️\n💎Year: ${year}\n\nPLOT\n${trim(description.en, 50)}`,
        });
      }
      smaile(userMessage);
      // ctx.reply(`Searching for: ${searchTerm}`);
      // Add your search logic here
    } else {
      ctx.reply("Invalid parameter.");
    }
  } else {
    bot.telegram.sendPhoto(
      chatId,
      "https://raw.githubusercontent.com/Udonna-cell/mangaQuest/master/public/images/wallpaperflare.com_wallpaper%20(1).jpg",
      {
        reply_markup: {
          // inline_keyboard: [
          //     [{ text: 'test button', callback_data: 'test', hide: true }],
          // ],
        },
        caption: `Welcome <b><b>${ctx.update.message.from.first_name} ${ctx.update.message.from.last_name}</b></b> to MangaQuest bot where you can easily search, read and download your favourite mangas\n\n<pre>Here are some common used commands</pre>\n\nSearch for a manga using the command /search`,
        parse_mode: "HTML",
      }
    );
  }
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
            text: `https://t.me/MangaQuest_bot?start=search_${MangaTitle}`,
            url: "https://t.me/MangaQuest_bot/MangaQuest",
          },
        ],
      ],
    },
  });
});
async function search(text, id, limit, offset) {
  // body...
  let { results, MangaID, MangaCover, MangaPlot, MangaTitle } = await Search(
    text,
    limit,
    offset
  );
  // console.log(offset);
  totalManga = results;
  bot.telegram
    .sendPhoto(id, MangaCover, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "PREV", callback_data: "prev", hide: true },
            {
              text: `${mangaIndex + 1} / ${results}`,
              callback_data: "test",
              hide: true,
            },
            { text: "NEXT", callback_data: "next", hide: true },
          ],
          [{ text: "Download 🚀", callback_data: "btn_1", hide: true }],
        ],
      },
      caption: `📖${MangaTitle}\nRate: 67⭐️⭐️\n💎Type: ${"Manga.type"}\n\nPLOT\n${MangaPlot}`,
    })
    .then((message) => {
      msgId = message.message_id;
    });
}
bot.command("search", (ctx) => {
  isWaitingReply = true;
  mangaIndex = 0;
  ctx.reply("Enter a Manga Title:");
  bot.on("text", (ctx) => {
    if (isWaitingReply) {
      // console.log(ctx.update.message, ">>>>>\n\n>>>");
      userMessage = ctx.message.text;
      chatId = ctx.update.message.chat.id;
      // async function display(params, id) {
      //   let { results, MangaID, MangaCover, MangaPlot, MangaTitle } = await Search(params);
      //   // console.log(respond, "gdh");
      //   bot.telegram.sendPhoto(id, MangaCover, {
      //     reply_markup: {
      //       inline_keyboard: [
      //         [{ text: 'PREV', callback_data: 'test', hide: true }, { text: '4 / 56', callback_data: 'test', hide: true }, { text: 'NEXT', callback_data: 'test', hide: true }],
      //         [{ text: 'Download 🚀', callback_data: 'btn_1', hide: true }],
      //       ],
      //     },
      //     caption: `📖${MangaTitle}\nRate: 67⭐️⭐️\n💎Type: ${"Manga.type"}\n\nPLOT\n${MangaPlot}`,
      //   });
      //   // ctx.reply(`${MangaTitle}\nType: ${"Manga.type"}\n${MangaPlot}`);
      //   // ctx.telegram.sendPhoto()
      // }
      search(userMessage, chatId, 1, mangaIndex);
      isWaitingReply = false;
      // msgId = ctx.update.message.message_id
      // console.log(ctx.update.message.message_id);
    } else {
      ctx.reply("Use the /help to explor more");
    }
  });
});
bot.command("help", (ctx) => {
  ctx.reply("You clicked help");
});
bot.command("random", (ctx) => {
  ctx.reply("You clicked random");
});
bot.action("next", (ctx) => {
  // ctx.reply("You clicked Button 1");
  if (!(mangaIndex + 1 == totalManga)) {
    mangaIndex += 1;
  }

  // Delete the original message
  bot.telegram.deleteMessage(chatId, msgId);

  search(userMessage, chatId, 1, mangaIndex);
  // console.log(ctx.update.message.message_id);
});
bot.action("prev", (ctx) => {
  // ctx.reply("You clicked Button 1");
  if (!(mangaIndex == 0)) {
    mangaIndex -= 1;
  }

  // Delete the original message
  bot.telegram.deleteMessage(chatId, msgId);

  search(userMessage, chatId, 1, mangaIndex);
  // console.log(ctx.update.message.message_id);
});

// bot.action('btn_2', (ctx) => {
//   ctx.reply('You clicked Button 2');
// });

bot.on("inline_query", async (ctx) => {
  try {
    const query = ctx.inlineQuery.query;

    if (!query) {
      // Handle empty queries gracefully
      return ctx.answerInlineQuery([], {
        switch_pm_text: "Please enter a search term.",
        switch_pm_parameter: "no_query",
      });
    }
    // Process the query and generate results
    var data = await getManga(
      query,
      40,
      0
    );
    
    const results = [];
    data.forEach(manga => {
      results.push({
        type: "photo",
        id: generateUniqueId(16),
        title: `${manga.title}`,
        photo_url: `${manga.cover}`,
        thumb_url: `${manga.cover}`,
        caption: `${manga.title}\n\n${trim(
          manga.description,
          50
        )}\n\n\nhttps://t.me/MangaQuest_bot?start=search_${manga.id}`,
        description: `${trim(manga.description, 10)}`,
      })
    })
    // console.log(data);
    await ctx.answerInlineQuery(results);
  } catch (error) {
    console.error("Error while processing inline query:", error);

    ctx.answerInlineQuery([], {
      switch_pm_text: "An error occurred, please try again.",
      switch_pm_parameter: "error",
    });
  }
});
// bot.on("inline_query", async (ctx) => {
//   try {
//     const query = ctx.inlineQuery.query;

//     if (!query) {
//       // Handle empty queries gracefully
//       return ctx.answerInlineQuery([], {
//         switch_pm_text: "Please enter a search term.",
//         switch_pm_parameter: "no_query",
//       });
//     }

//     // Respond quickly with a temporary message to avoid timeout
//     await ctx.answerInlineQuery([
//       {
//         type: "article",
//         id: generateUniqueId(16),
//         title: "Searching...",
//         input_message_content: {
//           message_text: "Please wait while we search for your query...",
//         },
//       },
//     ]);

//     // Delay the processing to avoid blocking the initial response
//     setImmediate(async () => {
//       try {
//         // Process the query and generate results
//         const results = [];
//         const mangaSearchIndexes = [0, 1, 2, 3, 4, 5];

//         for (const index of mangaSearchIndexes) {
//           const { MangaID, MangaCover, MangaPlot, MangaTitle } = await Search(
//             query,
//             1,
//             index
//           );

//           results.push({
//             type: "photo",
//             id: generateUniqueId(16),
//             title: `${MangaTitle}`,
//             photo_url: `${MangaCover}`,
//             thumb_url: `${MangaCover}`,
//             caption: `${MangaTitle}\n\n${trim(MangaPlot, 50)}\n\n\nhttps://t.me/MangaQuest_bot?start=search_${MangaTitle}`,
//             description: `${trim(MangaPlot, 10)}`,
//           });
//         }

//         // Ensure the query is still valid before responding
//         if (ctx.inlineQuery.id === ctx.inlineQuery.id) {
//           await ctx.answerInlineQuery(results);
//         }
//       } catch (err) {
//         console.error("Error during inline query processing:", err);

//         // Handle error gracefully
//         ctx.answerInlineQuery([], {
//           switch_pm_text: "An error occurred, please try again.",
//           switch_pm_parameter: "error",
//         });
//       }
//     });
//   } catch (error) {
//     console.error("Error while processing inline query:", error);

//     // Handle generic errors and notify the user
//     ctx.answerInlineQuery([], {
//       switch_pm_text: "An error occurred, please try again.",
//       switch_pm_parameter: "error",
//     });
//   }
// });

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
