const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const destDir = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(destDir, 'bundle.css');

fs.readdir(stylesDir, (err, files) => {
  if (err) throw err;
  const cssFiles = files.filter((file) => path.extname(file) === '.css');
  fs.writeFile(bundleFilePath, '', err => {
    if (err) throw err;
  });
  cssFiles.forEach(file => {
    const stylesFilePath = path.join(stylesDir, file);
    fs.readFile(stylesFilePath, 'utf8', (err, data) => {
      if (err) throw err;
      fs.appendFile(bundleFilePath, data, err => {
        if (err) throw err;
        console.log(`Файл ${file} был добавлен в bundle.css`);
      });
    });
  });
});