const express = require("express");
const router = express.Router();
const getId = require("../utility/getId");
const getChpter = require("../utility/getChapter");
const axios = require("axios");

router.get("/:userID/:mangaID/:chapter/:volume", async (req, res, next) => {
  let { volume, chapter, mangaID } = req.params;
  // let { id } = await getId("https://api.mangadex.org/manga", "horimiya", 1, 1);

  try {
    volume = parseInt(volume)
    chapter = parseInt(chapter)
    const h = await axios.get(
      `https://api.mangadex.org/manga/${mangaID}?includes[]=author&includes[]=artist&includes[]=cover_art`,
      {
        params: { limit: 1, offset: 0 },
      }
    );
    let { id } = h.data.data;

    let chapters = await getChpter(id);
    // console.log(volume);
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
    res.render("chapter", { pagesMap });
  } catch (error) {
    console.log("\n\n\n");
    console.log(error);
    res.render("error")
    
  }

  // console.log(pagesMap);
  // console.log(pages);
  
});

module.exports = router;
