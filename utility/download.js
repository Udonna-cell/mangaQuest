require("dotenv").config();
const axios = require("axios");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const {Jimp} = require("jimp"); // destructuring was wrong

async function download(chap, msgID, chatID, ctx, bot, title, vol, chapMark) {
  let messageID = 0;
  let total, count;

  // Wait for message to send and capture messageID
  await bot.telegram
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
  const pdfPath = path.resolve(
    __dirname,
    `../${title.en} vol. ${vol} - chap. ${chapMark}.pdf`
  );
  doc.pipe(fs.createWriteStream(pdfPath));

  // console.log(data.chapter.data);

  let baseUrl = data.baseUrl;
  let hash = data.chapter.hash;
  let pickpage = data.chapter.data[0].split(".")[1] !== "png";
  let pages = pickpage ? data.chapter.data : data.chapter.dataSaver;
  total = pages.length;
  count = 0;

  console.log(pages);

  for (const [i, page] of pages.entries()) {
    let url = pickpage
      ? `${baseUrl}/data/${hash}/${page}`
      : `${baseUrl}/data-saver/${hash}/${page}`;
    
    const imgPath = path.resolve(__dirname, `../img-${i}.jpg`);
    
    count = i + 1;
    await downloadImage(url, imgPath).then(async () => {
      await bot.telegram.editMessageText(
        chatID,
        messageID,
        null,
        `📚 ${title.en}\nVolume ${vol} chapter ${chapMark}\n🔄 Downloading page ( ${count} / ${total} )\n🔘 PDF created successfully\nSending please wait...`
      );
    });

    console.log(`Successfully Downloaded page (${count} / ${pages.length})`);

    // Open the image and get its dimensions
    const img = doc.openImage(imgPath);

    // Add a new page with the size of the image
    doc.addPage({ size: [img.width, img.height] });

    // Add the image to the page
    doc.image(img, 0, 0);
  }

  // Finalize the PDF
  doc.end();
  console.log("PDF created successfully");

  await bot.telegram.deleteMessage(chatID, messageID);
  bot.telegram.sendMessage(
    chatID,
    `📚 ${title.en}\nVolume ${vol} chapter ${chapMark}\n.........\n✅ PDF created successfully and is being sent.`
  );
}

async function downloadImage(url, filePath) {
  const { data } = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  let ext = url.split(".").pop();

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(ext === "jpg" ? filePath : path.resolve(__dirname, `../img.${ext}`));
    data.pipe(writer);

    writer.on("finish", async () => {
      if (ext !== "jpg") {
        let image = await Jimp.read(path.resolve(__dirname, `../img.${ext}`));
        await image.write(filePath);
      }
      resolve("okay");
    });

    writer.on("error", (err) => {
      console.error(err);
      reject(err);
    });
  });
}

module.exports = download;
