const axios = require("axios");

async function getCover(id) {
  let i = 0;

  async function worker() {
    try {
      const response = await axios.get(
        `https://api.mangadex.org/cover?limit=10&manga%5B%5D=${id}&order%5BcreatedAt%5D=asc&order%5BupdatedAt%5D=asc&order%5Bvolume%5D=asc`
      );
      i = `https://uploads.mangadex.org/covers/${id}/${response.data.data[0].attributes.fileName}`;
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

module.exports = getCover;
