const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'secret-folder');

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.log(`Невозможно прочитать директорию: ${err}`);
  } else if (files.length === 0) {
    console.log('Директория пуста');
  } else {
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      fs.stat(filePath, (error, stats) => {
        if (error) {
          console.log(`Невозможно получить информацию о файлах: ${error}`);
        } else if (stats.isFile()) {
          const fileSizeInBytes = stats.size;
          const fileSizeInKB = fileSizeInBytes / 1024;
          const fileExtension = path.extname(file);
          const fileName = path.basename(file, fileExtension);
          console.log(`${fileName} - ${fileExtension.slice(1)} - ${fileSizeInKB}kb`);
        }
      });
    });
  }
});