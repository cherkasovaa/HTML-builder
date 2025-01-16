const fs = require('fs');
const path = require('path');
const currentPath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(currentPath);

const { stdout } = process;

stream.on('data', (chunk) => stdout.write(chunk));
