const axios = require("axios");

async function getRating(id) {
  let i = 0;

  async function worker() {
    try {
      const response = await axios.get(
        `https://api.mangadex.org/statistics/manga/${id}`
      );
      i = response.data.statistics[`${id}`].rating.average;
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

module.exports = getRating;
