const fs = require('fs');
const path = require('path');

// Function to delete files with specific extensions
function deleteFiles(dir, extensions) {
  try {
    fs.readdir(dir, (err, files) => {
      if (err) {
        console.error(`Error reading directory: ${err}`);
        return;
      }
      let ff = files
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const fileExt = path.extname(file).toLowerCase();
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (err) {
            console.log('File does not exist');
          } else {
            console.log('File exists');
            if (extensions.includes(fileExt)) {
              fs.unlink(filePath, err => {
                if (err) {
                  console.error(`Error deleting file ${filePath}: ${err}`);
                } else {
                  console.log(`Deleted file: ${filePath}`);
                }
              });
            }
          }
        });


      });
    });
  } catch (e) {
    console.log("an error fake");
  }
};

module.exports = deleteFiles