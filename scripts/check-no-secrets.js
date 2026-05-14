#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const scanDirs = ['docs', 'src', 'templates', 'data', 'projets'];
const ignoredDirs = new Set(['node_modules', '.git']);
const allowedExtensions = new Set(['.html', '.js', '.css', '.json', '.md', '.csv', '.txt', '.yml', '.yaml']);

const patterns = [
  { label: 'Mot de passe potentiel', regex: /\b(password|passwd|pwd)\s*[:=]\s*['\"][^'\"]{4,}/i },
  { label: 'Token potentiel', regex: /\b(token|access_token|refresh_token)\s*[:=]\s*['\"][^'\"]{8,}/i },
  { label: 'Clé API potentielle', regex: /\b(api[_-]?key|apikey)\s*[:=]\s*['\"][^'\"]{8,}/i },
  { label: 'Secret potentiel', regex: /\b(secret|client_secret)\s*[:=]\s*['\"][^'\"]{8,}/i },
  { label: 'Chaîne ODBC potentielle', regex: /ODBC|Driver=|DSN=/i },
  { label: 'Risque AS400 / IBM i', regex: /AS400|IBM i|IBMi|iSeries/i },
  { label: 'Requête SQL potentielle', regex: /\b(SELECT|INSERT|UPDATE|DELETE)\b[\s\S]{0,80}\b(FROM|INTO|SET)\b/i }
];

let findings = [];
let checked = 0;

function walk(relativeDir) {
  const fullDir = path.join(root, relativeDir);
  if (!fs.existsSync(fullDir)) return [];

  let files = [];
  for (const entry of fs.readdirSync(fullDir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const fullPath = path.join(fullDir, entry.name);
    const relPath = path.relative(root, fullPath);

    if (entry.isDirectory()) {
      files = files.concat(walk(relPath));
    } else if (entry.isFile() && allowedExtensions.has(path.extname(entry.name))) {
      files.push(relPath);
    }
  }
  return files;
}

for (const dir of scanDirs) {
  for (const file of walk(dir)) {
    checked++;
    const content = fs.readFileSync(path.join(root, file), 'utf8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      for (const pattern of patterns) {
        if (pattern.regex.test(line)) {
          findings.push({ file, line: index + 1, label: pattern.label, sample: line.trim().slice(0, 180) });
        }
      }
    });
  }
}

console.log('Contrôle anti-secrets');
console.log('=====================');
console.log(`Fichiers contrôlés : ${checked}`);

if (findings.length) {
  console.error('\nSignaux à contrôler :');
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} — ${finding.label} — ${finding.sample}`);
  }
  console.error('\nContrôle bloquant : vérifier et supprimer tout secret réel.');
  process.exit(1);
}

console.log('Aucun signal critique détecté.');
