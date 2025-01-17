const fs = require('fs');
const { mkdir, readdir, copyFile, unlink } = fs;

const path = require('path');
const pathToDir = path.join(__dirname, 'files');
const pathToCopy = path.join(__dirname, 'files-copy');

function createDirection() {
  mkdir(pathToCopy, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

function removeDir() {
  readdir(pathToCopy, (err, files) => {
    if (err) throw err;

    files.forEach((file) =>
      unlink(`${pathToCopy}/${file}`, (err) => {
        if (err) throw err;
      }),
    );
  });
}

function copyFiles() {
  removeDir();

  readdir(pathToDir, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const pathToFile = `${pathToDir}/${file}`;
      const pathToCopyFile = `${pathToCopy}/${file}`;

      copyFile(pathToFile, pathToCopyFile, (err) => {
        if (err) throw err;
      });
    });
  });
}

function copy() {
  createDirection();
  copyFiles();
}

copy();
