#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const scanDirs = ['data', 'projets', 'templates'];
let errors = [];
let checked = 0;

function walk(dir) {
  const fullDir = path.join(root, dir);
  if (!fs.existsSync(fullDir)) return [];

  const entries = fs.readdirSync(fullDir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const fullPath = path.join(fullDir, entry.name);
    const relativePath = path.relative(root, fullPath);

    if (entry.isDirectory()) {
      files = files.concat(walk(relativePath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(relativePath);
    }
  }

  return files;
}

for (const dir of scanDirs) {
  const files = walk(dir);
  for (const file of files) {
    checked++;
    const fullPath = path.join(root, file);
    try {
      JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    } catch (error) {
      errors.push(`${file} : ${error.message}`);
    }
  }
}

console.log('Contrôle JSON');
console.log('============');
console.log(`Fichiers JSON contrôlés : ${checked}`);

if (errors.length) {
  console.error('\nJSON invalides :');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('JSON OK.');
