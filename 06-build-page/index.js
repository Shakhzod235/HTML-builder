const fs = require('fs').promises;
const path = require('path');

const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const distDir = path.join(__dirname, 'project-dist');

async function copyAssets(srcDir, destDir) {
  try {
    const stat = await fs.stat(srcDir);
    if (stat.isDirectory()) {
      try {
        await fs.access(destDir, fs.constants.F_OK);
      } catch (error) {
        await fs.mkdir(destDir);
      }
      const files = await fs.readdir(srcDir);
      await Promise.all(files.map(async (file) => {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);
        await copyAssets(srcPath, destPath);
      }));
    } else {
      const content = await fs.readFile(srcDir);
      await fs.writeFile(destDir, content);
    }
  } catch (error) {
    console.error(error);
  }
}

(async function() {
  try {
    try {
      await fs.access(distDir, fs.constants.F_OK)
    } catch (error) {
      await fs.mkdir(distDir);
    }

    const templatePath = path.join(__dirname, 'template.html');
    const template = await fs.readFile(templatePath, 'utf-8');

    const componentNames = template.match(/{{\s*(\S+)\s*}}/g).map(tag => tag.slice(2, -2));

    const components = {};
    for (const componentName of componentNames) {
      const componentPath = path.join(componentsDir, `${componentName}.html`);
      components[componentName] = await fs.readFile(componentPath, 'utf-8');
    }

    let result = template;
    for (const [componentName, componentContent] of Object.entries(components)) {
      const tag = `{{${componentName}}}`;
      result = result.replace(new RegExp(tag, 'g'), componentContent);
    }

    const indexPath = path.join(distDir, 'index.html');
    await fs.writeFile(indexPath, result);

    const styleFiles = await fs.readdir(stylesDir);
    const cssFiles = styleFiles.filter((file) => path.extname(file) === '.css');
    const styles = await Promise.all(cssFiles.map(async (file) => {
      const filePath = path.join(stylesDir, file);
      return await fs.readFile(filePath, 'utf-8');
    }));

    const stylesPath = path.join(distDir, 'style.css');
    await fs.writeFile(stylesPath, styles.join('\n'));

    const assetsDest = path.join(distDir, 'assets');
    await copyAssets(assetsDir, assetsDest);
  } catch (error) {
    console.error(error);
  }
})();