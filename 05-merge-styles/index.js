const fs = require('fs');
const path = require('path');
const pathToStyles = path.join(__dirname, 'styles');
const output = path.join(__dirname, 'project-dist', 'bundle.css');

const { readdir, readFile } = fs;
const stream = fs.createWriteStream(output);

function createBundle() {
  readdir(pathToStyles, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      if (path.extname(file.name) === '.css' && file.isFile()) {
        readFile(`${pathToStyles}/${file.name}`, (err, data) => {
          if (err) throw err;

          stream.write(data + '\n');
        });
      }
    });
  });
}

createBundle();
