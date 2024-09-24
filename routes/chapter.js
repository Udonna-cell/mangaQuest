const express = require("express");
const router = express.Router();
const getId = require("../utility/getId");
const getChpter = require("../utility/getChapter");
const axios = require("axios");

router.get("/:userID/:mangaID/:chapter/:volume", async (req, res, next) => {
  let { volume, chapter } = req.params;
  let { id } = await getId("https://api.mangadex.org/manga", "horimiya", 1, 1);

  let chapters = await getChpter(id);
  // console.log(chapters.length);
  // console.log(chapters[3]);
  // console.log(chapters[3][1]);
  let chapterID = chapters[volume][chapter].id;
  let { data } = await axios(
    `https://api.mangadex.org/at-home/server/${chapterID}`
  );
  let baseUrl = data.baseUrl;
  let hash = data.chapter.hash;
  let pickPage = data.chapter.data[0].split(".")[1] !== "png";
  let pages = pickPage ? data.chapter.data : data.chapter.dataSaver;
  total = pages.length;
  count = 0;

  let pagesMap = [];
  for (const [i, page] of pages.entries()) {
    let url = pickPage
      ? `${baseUrl}/data/${hash}/${page}`
      : `${baseUrl}/data-saver/${hash}/${page}`;
    pagesMap.push(url);
  }

  console.log(pagesMap);
  // console.log(pages);
  res.render("chapter", { pagesMap });
});

module.exports = router;
