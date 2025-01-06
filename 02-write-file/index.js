const fs = require('fs');
const path = require('path');
const readline = require('node:readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const writableStream = fs.createWriteStream(
  path.resolve(__dirname, 'text.txt'),
  'utf-8',
);

rl.on('line', (event) => {
  if (event === 'exit') {
    writableStream.close();
    rl.close;
    return;
  }
  writableStream.write(event);
});

rl.on('close', () => console.log('Спасибо'));
