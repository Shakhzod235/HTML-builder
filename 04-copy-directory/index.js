const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'files');
const dest = path.join(__dirname,'files-copy');

fs.mkdir(dest, { recursive: true }, (err) => {
  if (err) throw err;
  fs.readdir(src, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      fs.stat(srcPath, (err, stats) => {
        if (err) throw err;
        if (stats.isFile()) {
          fs.readFile(srcPath, (err, data) => {
            if (err) throw err;
            fs.writeFile(destPath, data, (err) => {
              if (err) throw err;
            });
          });
        }
      });
    });
  });
});