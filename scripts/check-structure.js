#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();

const requiredDirs = [
  'docs',
  'src',
  'templates',
  'data',
  'projets',
  'docs/skills'
];

const recommendedDirs = [
  'exports',
  'rapports',
  '.github/workflows'
];

const requiredFiles = [
  'README.md',
  'docs/STRUCTURE_PROJET.md',
  'docs/skills/README.md',
  'docs/skills/MATRICE_COMPETENCES_COPILOTE_AGENCE.md'
];

let errors = [];
let warnings = [];

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

for (const dir of requiredDirs) {
  if (!exists(dir)) {
    errors.push(`Dossier obligatoire manquant : ${dir}`);
  }
}

for (const dir of recommendedDirs) {
  if (!exists(dir)) {
    warnings.push(`Dossier recommandé absent : ${dir}`);
  }
}

for (const file of requiredFiles) {
  if (!exists(file)) {
    errors.push(`Fichier obligatoire manquant : ${file}`);
  }
}

console.log('Contrôle structure projet');
console.log('==========================');

if (warnings.length) {
  console.log('\nAvertissements :');
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error('\nErreurs bloquantes :');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('\nStructure minimale OK.');
