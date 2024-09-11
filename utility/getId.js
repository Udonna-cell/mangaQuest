const axios = require("axios");

async function getId(base, title, limit, offset) {
  // https://api.mangadex.org/manga
  const response = await axios.get(base, {
    params: { title: title, limit, offset },
  });
  let year = (response.data.data[0].attributes.year);
  return {id: response.data.data[0].id, year};
}

module.exports = getId;
