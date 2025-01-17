const fs = require('fs');
const { readdir, stat } = fs;

const path = require('path');
const pathToDir = path.join(__dirname, 'secret-folder');

const { stdout } = process;

readdir(pathToDir, { withFileTypes: true }, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    const pathToFile = `${pathToDir}/${file.name}`;

    stat(pathToFile, (err, stats) => {
      if (err) throw err;
      if (stats.isDirectory()) return;

      const extension = path.extname(pathToFile);
      const name = `${file.name}`.slice(0, -`${extension.length}`);
      const size = stats.size / 1024;

      stdout.write(`${name} - ${extension.slice(1)} - ${size} kb\n`);
    });
  });
});
