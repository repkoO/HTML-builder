const path = require('node:path');
const { createReadStream, createWriteStream } = require('node:fs');
const {
  copyFile,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} = require('node:fs/promises');

const copyFiles = async (input, output) => {
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });

  const files = await readdir(input, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      await copyFile(path.join(input, file.name), path.join(output, file.name));
    }
    if (file.isDirectory()) {
      await copyFiles(
        path.join(input, file.name),
        path.join(output, file.name),
      );
    }
  }
};

const createCSS = async (stylesPath, outputPath) => {
  const writeStream = createWriteStream(outputPath);

  const files = await readdir(stylesPath, { withFileTypes: true });
  for (const file of files) {
    if (
      !file.isFile() ||
      path.extname(path.join(stylesPath, file.name)) !== '.css'
    )
      continue;

    const readStream = createReadStream(path.join(stylesPath, file.name));
    readStream.pipe(writeStream);
  }
};

const createHTML = async (componentsPath, outputPath) => {
  const componentFiles = await readdir(componentsPath, { withFileTypes: true });
  const templatePath = path.join(__dirname, 'template.html');

  let html = await readFile(templatePath, 'utf-8');

  for (const file of componentFiles) {
    if (
      !file.isFile() ||
      path.extname(path.join(componentsPath, file.name)) !== '.html'
    )
      continue;

    const componentName = path.parse(path.join(componentsPath, file.name)).name;
    const componentHTML = await readFile(
      path.join(componentsPath, file.name),
      'utf-8',
    );
    html = html.replace(`{{${componentName}}}`, componentHTML);
  }

  const outputFilePath = path.join(outputPath, 'index.html');
  await writeFile(outputFilePath, html);
};

const createBuild = async (input, output) => {
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });

  const componentsPath = path.join(input, 'components');
  await createHTML(componentsPath, output);

  const stylesDirPath = path.join(input, 'styles');
  const stylesDestPath = path.join(output, 'style.css');
  await createCSS(stylesDirPath, stylesDestPath);

  const assetsPath = path.resolve(input, 'assets');
  const assetsDestPath = path.resolve(output, 'assets');
  await copyFiles(assetsPath, assetsDestPath);
};

createBuild(
  path.resolve(__dirname, '.'),
  path.resolve(__dirname, 'project-dist'),
);
