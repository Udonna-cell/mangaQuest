const axios = require("axios");

async function getId(base, title, limit, offset) {
  // https://api.mangadex.org/manga
  const response = await axios.get(base, {
    params: { title: title, limit, offset },
  });

  return response.data.data[0].id;
}

module.exports = getId;
