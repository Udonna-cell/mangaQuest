const axios = require("axios");

async function getId(base, title) {
  // https://api.mangadex.org/manga
  const response = await axios.get(base, {
    params: {},
  });

  return response.data.data[0].id;
}

module.exports = getId;
