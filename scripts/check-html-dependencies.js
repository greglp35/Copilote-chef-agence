#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const srcDir = path.join(root, 'src');
let findings = [];
let checked = 0;

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

const externalPatterns = [
  /<script[^>]+src=["']https?:\/\//i,
  /<link[^>]+href=["']https?:\/\//i,
  /<img[^>]+src=["']https?:\/\//i,
  /fetch\s*\(\s*["']https?:\/\//i,
  /XMLHttpRequest/i,
  /import\s+.*from\s+["']https?:\/\//i,
  /@import\s+url\(["']?https?:\/\//i
];

for (const fullPath of walk(srcDir)) {
  checked++;
  const relativePath = path.relative(root, fullPath);
  const lines = fs.readFileSync(fullPath, 'utf8').split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const regex of externalPatterns) {
      if (regex.test(line)) {
        findings.push({ file: relativePath, line: index + 1, sample: line.trim().slice(0, 180) });
      }
    }
  });
}

console.log('Contrôle dépendances HTML externes');
console.log('===================================');
console.log(`Fichiers HTML contrôlés : ${checked}`);

if (findings.length) {
  console.error('\nDépendances ou appels externes détectés :');
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} — ${finding.sample}`);
  }
  console.error('\nContrôle bloquant : le projet privilégie le zéro dépendance externe. Justifier ou supprimer.');
  process.exit(1);
}

console.log('Aucune dépendance externe détectée dans /src.');
