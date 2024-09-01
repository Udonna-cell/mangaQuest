const axios = require("axios");

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

module.exports = getPlot;
