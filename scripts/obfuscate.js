const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');
const HtmlMinifier = require('html-minifier-terser');

const OUT_DIR = path.join(__dirname, '../out');

// Traverses a directory recursively
function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      files.push(name);
    }
  }
  return files;
}

// Compress SVG content by removing comments and extra whitespace
function minifySvg(content) {
  return content
    .replace(/<!--[\s\S]*?-->/g, '') // remove comments
    .replace(/>\s+?</g, '><') // remove whitespace between tags
    .trim();
}

async function run() {
  console.log('Starting post-build optimization, minification, and obfuscation...');

  if (!fs.existsSync(OUT_DIR)) {
    console.error(`Error: Output directory ${OUT_DIR} does not exist. Run npm run build first.`);
    process.exit(1);
  }

  const files = getFiles(OUT_DIR);
  console.log(`Found ${files.length} files to process.`);

  let jsCount = 0;
  let htmlCount = 0;
  let svgCount = 0;
  let deletedMapCount = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();

    // 1. Delete source map files
    if (ext === '.map') {
      fs.unlinkSync(file);
      deletedMapCount++;
      continue;
    }

    // 2. Obfuscate JavaScript files
    if (ext === '.js') {
      const code = fs.readFileSync(file, 'utf8');
      
      // Safe yet strong obfuscation configuration
      const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
        compact: true,
        controlFlowFlattening: false, // Disabled for performance
        deadCodeInjection: false,
        debugProtection: false,
        disableConsoleOutput: false,
        identifierNamesGenerator: 'mangled',
        log: false,
        numbersToExpressions: false,
        renameGlobals: false, // Critical: keep Next.js/React globals intact
        selfDefending: false,
        simplify: true,
        splitStrings: false,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 0.8,
        transformObjectKeys: true,
        unicodeEscapeSequence: false
      });

      fs.writeFileSync(file, obfuscationResult.getObfuscatedCode(), 'utf8');
      jsCount++;
    }

    // 3. Minify HTML files
    if (ext === '.html') {
      const htmlContent = fs.readFileSync(file, 'utf8');
      
      try {
        const minifiedHtml = await HtmlMinifier.minify(htmlContent, {
          collapseWhitespace: true,
          removeComments: true,
          minifyJS: true,
          minifyCSS: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true
        });

        fs.writeFileSync(file, minifiedHtml, 'utf8');
        htmlCount++;
      } catch (err) {
        console.error(`Failed to minify HTML file: ${file}`, err);
      }
    }

    // 4. Minify SVG assets
    if (ext === '.svg') {
      const svgContent = fs.readFileSync(file, 'utf8');
      const minifiedSvg = minifySvg(svgContent);
      fs.writeFileSync(file, minifiedSvg, 'utf8');
      svgCount++;
    }
  }

  console.log('\nPost-build process completed successfully!');
  console.log(`- Obfuscated JS files: ${jsCount}`);
  console.log(`- Minified HTML files: ${htmlCount}`);
  console.log(`- Optimized SVG files: ${svgCount}`);
  console.log(`- Deleted source maps: ${deletedMapCount}`);
}

run().catch(err => {
  console.error('Error during post-build processing:', err);
  process.exit(1);
});
