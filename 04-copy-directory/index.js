const path = require('node:path');
const { copyFile, mkdir, readdir, rm } = require('node:fs/promises');

const copyFiles = async (initial, copy) => {
  await rm(copy, { recursive: true, force: true });
  await mkdir(copy, { recursive: true });

  const files = await readdir(initial, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      await copyFile(path.join(initial, file.name), path.join(copy, file.name));
    }
    if (file.isDirectory()) {
      await copyFiles(
        path.join(initial, file.name),
        path.join(copy, file.name),
      );
    }
  }
};

const initial = path.join(__dirname, 'files');
const copy = path.join(__dirname, 'files-copy');
copyFiles(initial, copy);
