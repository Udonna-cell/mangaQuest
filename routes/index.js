var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  let data = {
    title: "Tonikawa over the moon",
    genre: "romance.drama.slice of life",
    color: "background: linear-gradient(87deg, #2596be 50%, rgba(37, 150, 190,0.05))"
  }
  
  let forYou = {
    data: [{
      title: "rent a girlfriend",
      genre: "romance . slice of life . Drama",
      chapter: 34
    },
    {
      title: "demon slayer",
      genre: "action . adventure . Drama",
      chapter: 344
    },
    {
      title: "just twilight",
      genre: "romance . Drama",
      chapter: 124
    },
    {
      title: "dangers in my heart",
      genre: "romance . slice of life . Drama",
      chapter: 334
    },
    {
      title: "demon slayer",
      genre: "action . adventure . Drama",
      chapter: 344
    },
    {
      title: "demon slayer",
      genre: "action . adventure . Drama",
      chapter: 344
    }]
  }
  forYou.length = forYou.data.length
  
  res.render('index', { title: 'Express', logo: "it's fun time!", isNotify: true, data: [data], forYou});
});

module.exports = router;
