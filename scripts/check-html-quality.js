#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const srcDir = path.join(root, 'src');

let checked = 0;
let errors = [];
let warnings = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function addError(file, message) {
  errors.push(`${file} — ${message}`);
}

function addWarning(file, message) {
  warnings.push(`${file} — ${message}`);
}

function stripComments(text) {
  return text.replace(/<!--([\s\S]*?)-->/g, '');
}

function countMatches(text, regex) {
  return (text.match(regex) || []).length;
}

function hasMetaDescription(text) {
  return /<meta\s+[^>]*name=["']description["'][^>]*content=["'][^"']{20,}["'][^>]*>/i.test(text)
    || /<meta\s+[^>]*content=["'][^"']{20,}["'][^>]*name=["']description["'][^>]*>/i.test(text);
}

function findImagesWithoutAlt(text) {
  const matches = text.match(/<img\b[^>]*>/gi) || [];
  return matches.filter(tag => !/\salt\s*=\s*["'][^"']*["']/i.test(tag));
}

for (const fullPath of walk(srcDir)) {
  checked++;
  const file = path.relative(root, fullPath);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const text = stripComments(raw);
  const lower = text.toLowerCase();

  const titleCount = countMatches(text, /<title\b[^>]*>[\s\S]*?<\/title>/gi);
  if (titleCount !== 1) {
    addError(file, `un seul <title> attendu, trouvé : ${titleCount}`);
  } else if (!/<title\b[^>]*>\s*[^<]{8,}\s*<\/title>/i.test(text)) {
    addError(file, '<title> trop court ou vide');
  }

  if (!hasMetaDescription(text)) {
    addError(file, 'meta description absente ou trop courte');
  }

  const h1Count = countMatches(text, /<h1\b[^>]*>[\s\S]*?<\/h1>/gi);
  if (h1Count !== 1) {
    addError(file, `un seul <h1> attendu, trouvé : ${h1Count}`);
  }

  const missingAlt = findImagesWithoutAlt(text);
  if (missingAlt.length) {
    addError(file, `${missingAlt.length} image(s) sans attribut alt`);
  }

  if (!/name=["']viewport["']/i.test(text)) {
    addWarning(file, 'meta viewport absente');
  }

  const isCriticalBusinessModule = /stock|tfi|commande|livraison|securite|sécurité|erp/i.test(file) || /stock|tfi|commande|livraison|sécurité|securite|erp/i.test(text);
  if (isCriticalBusinessModule && !lower.includes('validation humaine')) {
    addWarning(file, 'module critique sans mention explicite de validation humaine');
  }
}

console.log('Contrôle qualité HTML');
console.log('======================');
console.log(`Fichiers HTML contrôlés : ${checked}`);

if (warnings.length) {
  console.log('\nAvertissements :');
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error('\nErreurs bloquantes :');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('\nQualité HTML minimale OK.');
