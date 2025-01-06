const fs = require('fs');
const path = require('path');
const pathLink = '03-files-in-folder/secret-folder';

fs.readdir(pathLink, { withFileTypes: true }, (error, data) => {
  if (error) {
    console.log(`Ошибка ${error.message}`);
  }
  data.forEach((el) => {
    if (el.isFile()) {
      const pathToFile = path.resolve(pathLink, el.name);
      fs.stat(pathToFile, (error, stats) => {
        if (error) {
          console.log(`Ошибка ${error.message}`);
        }
        const elementName = el.name.split('.')[0];
        const extensionFile = path.extname(pathToFile).split('.')[1];
        console.log(
          `${elementName} - ${extensionFile} - ${Math.round(
            stats.size / 1024,
          )} kb`,
        );
      });
    }
  });
});
