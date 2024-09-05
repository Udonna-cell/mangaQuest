const axios = require("axios");

async function getChapter(base, mangaID) {
  // https://api.mangadex.org/manga
  const response = await axios.get("https://api.mangadex.org/chapter/", {
    params: { manga: "58b09ce2-ea05-405e-8e1c-a9361df9bdd9", limit: 100, offset: 0 },
  });

  return response.data.data[0].id;
}

module.exports = getChapter;
