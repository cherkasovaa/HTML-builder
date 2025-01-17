const fs = require('fs');
const {
  mkdir,
  readdir,
  copyFile,
  readFile,
  createWriteStream,
  createReadStream,
} = fs;
const path = require('path');

const outputFolder = 'project-dist';
const output = path.join(__dirname, outputFolder);

function createDist(dist) {
  mkdir(dist, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

function createHTML() {
  const template = createReadStream(path.join(__dirname, 'template.html'));

  const regEx = /(?<={{)([\s\S]+?)(?=})/g;
  let indexFile;
  let chunks = [];

  template.on('data', (chunk) => {
    let temp = chunk.toString();
    chunks = [...temp.match(regEx)];

    chunks.forEach((chunk) => {
      const stream = createReadStream(
        path.join(`${__dirname}`, 'components', `${chunk}.html`),
      );

      stream.on('data', (data) => {
        temp = temp.replace(`{{${chunk}}}`, data);
        indexFile = createWriteStream(
          path.join(__dirname, outputFolder, 'index.html'),
        );
        indexFile.write(temp);
      });
    });
  });
}

function createStyles() {
  const dist = path.join(__dirname, 'styles');
  const stream = createWriteStream(
    path.join(__dirname, outputFolder, 'style.css'),
  );

  readdir(dist, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      if (path.extname(file.name) === '.css' && file.isFile()) {
        readFile(`${dist}/${file.name}`, (err, data) => {
          if (err) throw err;

          stream.write(data + '\n');
        });
      }
    });
  });
}

function copyAssets(src, dist) {
  createDist(dist);

  readdir(src, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const input = path.join(src, file.name);
      const output = path.join(dist, file.name);

      if (file.isDirectory()) {
        copyAssets(input, output);
      } else {
        copyFile(input, output, (err) => {
          if (err) throw err;
        });
      }
    });
  });
}

function build() {
  createDist(output);
  createHTML();
  createStyles();
  copyAssets(
    path.join(__dirname, 'assets'),
    path.join(__dirname, outputFolder, 'assets'),
  );
}

build();
