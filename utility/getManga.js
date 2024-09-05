const axios = require("axios");

async function getManga(str, limit, offset) {
  // https://api.mangadex.org/manga
  const { data } = await axios.get(`https://api.mangadex.org/manga?includes[]=author&includes[]=artist&includes[]=cover_art`, {
    params: { title: str, limit, offset },
  });
  let result = []
  data.data.forEach(manga => {
    let { relationships, attributes, id } = manga
    let { title, description, year } = attributes
    let cover = relationships.filter(obj => obj.type == "cover_art")
    cover = `https://uploads.mangadex.org/covers/${id}/${cover[0].attributes.fileName}`
    result.push({
      id,
      title: title.en,
      year,
      description: description.en,
      cover,
    })
  })

  return result;
}

module.exports = getManga;
