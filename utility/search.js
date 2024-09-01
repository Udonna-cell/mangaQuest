const axios = require("axios");
const trim = require("./trim");

async function Search(title) {
  let baseUrl = "https://api.mangadex.org/manga";
  // let results = getResult(baseUrl, title);
  try {
    const results = await getResult(baseUrl, title);
    const MangaID = await getId(baseUrl, title)
    const MangaTitle = await getTitle(baseUrl, title)
    let MangaPlot = await getPlot(baseUrl, title)
    MangaPlot = trim(MangaPlot, 120)
    const MangaCover = await getCover(MangaID)
    // console.log(MangaID);
    return {results, MangaID, MangaCover, MangaPlot, MangaTitle}
  } catch (error) {
    console.error('Error during result fetching:', error);
  }
  // return results;
  //   bot.on("text", (ctx) => {
  //     const chatId = ctx.update.message.chat.id;
  //     const userMessage = ctx.message.text; // Assign the user's message to a variable
  //     let Manga = {};
  //     axios
  //       .get("https://api.mangadex.org/manga", {
  //         params: {
  //           title: userMessage,
  //         },
  //       })
  //       .then(({ data }) => {
  //         Manga.id = data.data[0].id;
  //         Manga.type = data.data[0].type;
  //         Manga.title = data.data[0].attributes.title.en;
  //         Manga.description = data.data[0].attributes.description.en;

  //         let coverArt = "";
  //         let fileName = "";
  //         // getting manga cover
  //         axios
  //           .get(
  //             `https://api.mangadex.org/cover?limit=10&manga%5B%5D=${Manga.id}&order%5BcreatedAt%5D=asc&order%5BupdatedAt%5D=asc&order%5Bvolume%5D=asc`
  //           )
  //           .then((d) => {
  //             coverArt = d.data.data[0].id;

  //             axios
  //               .get(`https://api.mangadex.org/cover/${coverArt}`)
  //               .then((d) => {
  //                 fileName = d.data.data.attributes.fileName;
  //                 // console.log(fileName);
  //                 Manga.cover = `https://uploads.mangadex.org/covers/${Manga.id}/${fileName}`;
  //                 // console.log(Manga.cover);

  //                 bot.telegram.sendPhoto(chatId, Manga.cover, {
  //                   reply_markup: {
  //                     // inline_keyboard: [
  //                     //     [{ text: 'test button', callback_data: 'test', hide: true }],
  //                     // ],
  //                   },
  //                   caption: `${Manga.title}\nType: ${Manga.type}\n${Manga.description}`,
  //                 });
  //               });
  //             // console.log(coverArt);
  //           });

  //         // console.log(Manga);
  //       });
  //     // Process the user's input as needed
  //     // ctx.reply(userMessage);
  //     // console.log(ctx.update);
  //   });
}

function getType() {}
function getAverageRate() {}
function getStatus() {}
function getVolumeCount() {}
function getTotalChapters() {}
function getGenre() {}


async function getCover(id) {
  let i = 0;

  async function worker() {
    try {
      const response = await axios.get(`https://api.mangadex.org/cover?limit=10&manga%5B%5D=${id}&order%5BcreatedAt%5D=asc&order%5BupdatedAt%5D=asc&order%5Bvolume%5D=asc`);
      i = `https://uploads.mangadex.org/covers/${id}/${response.data.data[0].attributes.fileName}`
      return i;
    } catch (error) {
      console.error("Error occurred:", error);
      throw error; // rethrow the error to handle it outside the function if necessary
    }
  }

  // Call the worker function and wait for it to complete
  i = await worker();
  // console.log(i, "rr");
  return i; // return i for later usage
}
async function getPlot(base, title) {
  let i = 0;

  async function worker() {
    try {
      const response = await axios.get(base, {
        params: {
          title: title,
        },
      });
      i = response.data.data[0].attributes.description.en;
      return i;
    } catch (error) {
      console.error("Error occurred:", error);
      throw error; // rethrow the error to handle it outside the function if necessary
    }
  }

  // Call the worker function and wait for it to complete
  i = await worker();
  // console.log(i, "rr");
  return i; // return i for later usage
}
async function getId(base, title) {
  // https://api.mangadex.org/manga
  let i = 0;

  async function worker() {
    try {
      const response = await axios.get(base, {
        params: {
          title: title,
        },
      });
      i = response.data.data[0].id;
      return i;
    } catch (error) {
      console.error("Error occurred:", error);
      throw error; // rethrow the error to handle it outside the function if necessary
    }
  }

  // Call the worker function and wait for it to complete
  i = await worker();
  // console.log(i, "rr");
  return i; // return i for later usage
}
async function getResult(base, title) {
  let i = 0;

  async function worker() {
    try {
      const response = await axios.get(base, {
        params: {
          title: title,
        },
      });
      i = response.data.data.length;
      return i;
    } catch (error) {
      console.error("Error occurred:", error);
      throw error; // rethrow the error to handle it outside the function if necessary
    }
  }

  // Call the worker function and wait for it to complete
  i = await worker();
  // console.log(i, "rr");
  return i; // return i for later usage
}
async function getTitle(base, title) {
  let i = 0;

  async function worker() {
    try {
      const response = await axios.get(base, {
        params: {
          title: title,
        },
      });
      i = response.data.data[0].attributes.title.en;
      return i;
    } catch (error) {
      console.error("Error occurred:", error);
      throw error; // rethrow the error to handle it outside the function if necessary
    }
  }

  // Call the worker function and wait for it to complete
  i = await worker();
  // console.log(i, "rr");
  return i; // return i for later usage
}
// function type() {}
// function type() {}
// function type() {}
// function type() {}
// function type() {}

module.exports = Search;
