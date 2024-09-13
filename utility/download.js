require("dotenv").config();
const axios = require("axios");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

async function download(chap, msgID, chatID, ctx, bot, title, vol, chapMark) {
  // console.log(chap);
  let messageID = 0;
  let total, count;
  // update()
  bot.telegram
    .sendMessage(chatID, "Please wait while download is processing")
    .then((message) => {
      messageID = message.message_id;
    });
  let { data } = await axios(
    `https://api.mangadex.org/at-home/server/${chap.id}`
  );

  // Creating a new PDF document
  const doc = new PDFDocument({ autoFirstPage: false });

  // Piping the document to a file
  doc.pipe(
    fs.createWriteStream(
      path.resolve(
        __dirname,
        `../${title.en} vol. ${vol} - chap. ${chapMark}.pdf`
      )
    )
  );

  // console.log(data);

  let baseUrl = data.baseUrl;
  let hash = data.chapter.hash;
  let pickpage = data.chapter.data[0].split(".")[1] != "png";
  let pages = pickpage ? data.chapter.data : data.chapter.dataSaver;
  total = pages.length;
  count = 0;
  console.log(pages);
  bot.telegram.editMessageText(
    chatID,
    messageID,
    null,
    `📚${title.en}\nVolume ${vol} chapter ${chapMark}\n🔘Downloading page ( ${count} / ${total} )\n🔘PDF created successfully\nSending please wait...`
  );

  for (const [i, page] of pages.entries()) {
    let url = pickpage
      ? `${baseUrl}/data/${hash}/${page}`
      : `${baseUrl}/data-saver/${hash}/${page}`;

    let ext = url.split(".");
    ext = ext[ext.length - 1];

    if (ext != "jpg") {
    } else {
      let imgPath = path.resolve(__dirname, `../img-${i}.jpg`);
      // Wait for the image to be downloaded
      count = i + 1;
      await downloadImage(url, imgPath).then(async (data) => {
        console.log(data);
        // editUpdate()
        await bot.telegram.editMessageText(
          chatID,
          messageID,
          null,
          `📚 ${title.en}\nVolume ${vol} chapter ${chapMark}\n🔄 Downloading page ( ${count} / ${total} )\n🔘 PDF created successfully\nSending please wait...`
        );
      });

      console.log(`Successfully Downloaded page (${i} / ${pages.length})`);
      // Open the image and get its dimensions
      const img = doc.openImage(`${imgPath}`);

      // Add a new page with the size of the image
      doc.addPage({ size: [img.width, img.height] });

      // Add the image to the page
      doc.image(img, 0, 0);
    }
  }

  // Finalize the PDF
  doc.end();
  console.log("PDF created successfully");
  // editUpdate()
  await bot.telegram.deleteMessage(chatID, messageID);
  bot.telegram.sendMessage(
    chatID,
    `📚 ${title.en}\nVolume ${vol} chapter ${chapMark}\n.........\n✅ Downloading page ( ${count} / ${total} )\n✅ PDF created successfully\nSending please wait...`
  );
}

async function downloadImage(url, filePath) {
  const { data } = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);
    data.pipe(writer);

    writer.on("finish", () => {
      resolve("okay");
    });
    writer.on("error", reject);
  });
}

module.exports = download;
