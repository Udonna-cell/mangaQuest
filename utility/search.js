const axios = require("axios");
const getRating = require("./getRating")
// const getId = require("./getId");
// const getId = require("./getId");
// const getId = require("./getId");

async function Search(txt, limit, offset) {
    const { data } = await axios.get(
      `https://api.mangadex.org/manga?title=${txt}&includes[]=author&includes[]=artist&includes[]=cover_art`,
      {
        params: { limit, offset },
      }
    );
    let { relationships, attributes, id } = data.data[0];
    let { title, description, year } = attributes;
    let cover = relationships.filter((obj) => obj.type == "cover_art");
    cover = `https://uploads.mangadex.org/covers/${id}/${cover[0].attributes.fileName}`;
    // console.log(cover);
    let rate = await getRating(id);
    rate = rate.toFixed(2);
    let results = data.total
    // description = trim(description, 50)
    
    return { results, id, title, description, year, rate, cover };
}

module.exports = Search;
