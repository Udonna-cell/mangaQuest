var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = {
    title: "Tonikawa over the moon",
    genre: "romance.drama.slice of life",
    color: "background: linear-gradient(87deg, #2596be 50%, rgba(37, 150, 190,0.05))"
  }
  res.render('index', { title: 'Express', logo: "it's fun time!", isNotify: true, data: [data]});
});

module.exports = router;
