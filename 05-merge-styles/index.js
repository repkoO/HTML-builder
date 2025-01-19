const path = require('node:path');
const { createReadStream, createWriteStream } = require('node:fs');
const { readdir } = require('node:fs/promises');

const mergeStyles = async (input, output) => {
  const writeStream = createWriteStream(output);

  const files = await readdir(input, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(input, file.name);
    const fileExt = path.extname(filePath);
    if (!file.isFile() || fileExt !== '.css') continue;

    const readStream = createReadStream(filePath);
    readStream.pipe(writeStream);
  }
};

mergeStyles(
  path.resolve(__dirname, 'styles'),
  path.resolve(__dirname, 'project-dist', 'bundle.css'),
);
