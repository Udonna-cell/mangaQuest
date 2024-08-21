require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { Telegraf } = require('telegraf');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();



const bot = new Telegraf(process.env.BOT_TOKEN);

// Example: Respond to /start command
bot.start((ctx) => {
    const chatId = 1948498964; // Replace with your actual chat ID (without quotes)
    bot.telegram.sendPhoto(chatId, './public/images/img2.png', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'test button', callback_data: 'test', hide: true }],
            ],
        },
        caption: 'cute kitty',
    });
    ctx.reply('Welcome\!');
});

// Example: Handle messages containing 'hi'
bot.hears('hi', (ctx) => ctx.reply('Hey there\!'));
bot.command("inline", (ctx) => {
    ctx.reply("Hi there!", {
        reply_markup: {
            inline_keyboard: [
                /* Inline buttons. 2 side-by-side */
                [ { text: "Button 1", callback_data: "btn-1" }, { text: "Button 2", callback_data: "btn-2" } ],

                /* One button */
                [ { text: "Next", callback_data: "next" } ],
                
                /* Also, we can have URL buttons. */
                [ { text: "Open in browser", url: "https://t.me/MangaQuest_bot/MangaQuest" } ]
            ]
        }
    });
});





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

bot.launch()
module.exports = app;
