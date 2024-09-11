require("dotenv").config();
const axios = require("axios");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { update, editUpdate } = require("../app");
const { message } = require("telegraf/filters");

async function download(chap, msgID, chatID, ctx) {
  // console.log(chap);
  let messageID = 0
  update()
  // bot.telegram.sendMessage(chatID, "Download progress here.....").then((message)=>{
  //   messageID = message.message_id
  // })
  let { data } = await axios(
    `https://api.mangadex.org/at-home/server/${chap.id}`
  );

  // Creating a new PDF document
  const doc = new PDFDocument({ autoFirstPage: false });

  // Piping the document to a file
  doc.pipe(fs.createWriteStream(path.resolve(__dirname, "../test.pdf")));

  // console.log(data);

  let baseUrl = data.baseUrl;
  let hash = data.chapter.hash;
  let pickpage = data.chapter.data[0].split(".")[1] != "png";
  let pages = pickpage ? data.chapter.data : data.chapter.dataSaver;
  // console.log(pages);

  for (const [i, page] of pages.entries()) {
    let url = (pickpage)?(`${baseUrl}/data/${hash}/${page}`) : (`${baseUrl}/data-saver/${hash}/${page}`);
    // let ext = url.split(".");
    // ext = ext[ext.length - 1];
    let imgPath = path.resolve(__dirname, `../img-${i}.jpg`);
    // Wait for the image to be downloaded
    await downloadImage(url, imgPath).then((data) => {
      console.log(data);
      editUpdate()
      // bot.telegram.editMessageText(chatID, messageID, null, `Downloaded page ${i + 1}`)
    });

    console.log(`Successfully Downloaded page (${i} / ${pages.length})`);
    // ctx.telegram.editMessageText(chatID, msgID, null, `downloaded page ${i}`)
    // Open the image and get its dimensions
    const img = doc.openImage(`${imgPath}`);

    // Add a new page with the size of the image
    doc.addPage({ size: [img.width, img.height] });

    // Add the image to the page
    doc.image(img, 0, 0);

    // Add image to the PDF document
    // doc.image(imgPath, 0, 15,{
    //   width: 610, // Adjust fit size as necessary
    //   align: 'center',
    //   valign: 'center'
    // });

    // Add a new page if not the last page
    // if (i + 1 !== pages.length) {
    //   doc.addPage();
    // }
  }

  // Finalize the PDF
  doc.end();
  console.log("PDF created successfully");
  editUpdate()
  // bot.telegram.editMessageText(chatID, messageID, null, `Downloaded page ${i + 1}`)
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

    writer.on("finish", ()=>{
      resolve("okay")
    });
    writer.on("error", reject);
  });
}

module.exports = download;
