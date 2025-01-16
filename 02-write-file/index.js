const fs = require('fs');
const path = require('path');
const currentPath = path.join(__dirname, 'text.txt');

const output = fs.createWriteStream(currentPath);

const { stdin, stdout } = process;

stdout.write('Hi! Please, enter text below\n');

stdin.on('data', (data) => {
  if (data.toString().includes('exit')) sayBye();

  output.write(`${data}`);
});

process.on('SIGINT', () => {
  sayBye();
});

function sayBye() {
  stdout.write('Good bye!');
  process.exit();
}
