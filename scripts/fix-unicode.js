const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'components', 'site', 'naturel');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let totalFixed = 0;

files.forEach(f => {
  const fp = path.join(dir, f);
  let content = fs.readFileSync(fp, 'utf8');
  const original = content;

  // Replace \uXXXX unicode escape sequences with actual UTF-8 characters
  content = content.replace(/\\u([0-9A-Fa-f]{4})/g, (match, hex) => {
    const code = parseInt(hex, 16);
    // Skip surrogate pairs (emoji) - they work fine as-is
    if (code >= 0xD800 && code <= 0xDFFF) return match;
    return String.fromCharCode(code);
  });

  // Also fix &middot; HTML entities
  content = content.replace(/&middot;/g, '·');

  if (content !== original) {
    fs.writeFileSync(fp, content, 'utf8');
    totalFixed++;
    console.log('Fixed:', f);
  } else {
    console.log('No change:', f);
  }
});

// Also fix naturel-products.ts
const dataFile = path.join(__dirname, '..', 'lib', 'data', 'naturel-products.ts');
if (fs.existsSync(dataFile)) {
  let content = fs.readFileSync(dataFile, 'utf8');
  const original = content;
  content = content.replace(/\\u([0-9A-Fa-f]{4})/g, (match, hex) => {
    const code = parseInt(hex, 16);
    if (code >= 0xD800 && code <= 0xDFFF) return match;
    return String.fromCharCode(code);
  });
  if (content !== original) {
    fs.writeFileSync(dataFile, content, 'utf8');
    totalFixed++;
    console.log('Fixed: naturel-products.ts');
  }
}

console.log(`\nTotal files fixed: ${totalFixed}`);
