const axios = require("axios");

async function getChapter(mangaID) {
  // https://api.mangadex.org/manga
  var {data} = await axios.get("https://api.mangadex.org/chapter/", {
    params: { manga: mangaID, limit: 100, offset: 0 },
  });
  let {limit, total} = data
  data = data.data
  let offset = 100
  for (let index = Math.floor(total / 100); index > 0; index--) {
    var promise = await axios.get("https://api.mangadex.org/chapter/", {
      params: { manga: mangaID, limit: 100, offset },
    });
    offset += 100
    data = [...data, ...promise.data.data]
    // console.log(offset);
  }

  data = group(data)
  // console.log(Math.floor(total / 100))
  console.log(data.length, ">>> volumes here")
  console.log(data);
  // return response.data.data[0].id;
}

function group(data) {
  let group = []
  let matchLang = data.filter(obj => {
    if (obj.type == "chapter" && obj.attributes.translatedLanguage == "en") {
      return obj
    }
  });

  let preVolume = matchLang[0].attributes.volume
  let VolumeGroup = []
  matchLang.forEach(obj => {
    if (obj.attributes.volume == preVolume) {
      VolumeGroup.push(obj)
    } else {
      group.push(VolumeGroup)
      VolumeGroup = []
      VolumeGroup.push(obj)
      preVolume = obj.attributes.volume
    }
  });
  group.push(VolumeGroup)
 return group
}

module.exports = getChapter;
