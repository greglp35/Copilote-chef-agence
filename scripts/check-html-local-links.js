#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const srcDir = path.join(root, 'src');
const reportDir = path.join(root, 'rapports');
const reportPath = path.join(reportDir, 'liens-html-locaux.md');

const errors = [];
const warnings = [];
const rows = [];
let checkedFiles = 0;
let checkedLinks = 0;

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
  return files.sort();
}

function stripHashAndQuery(value) {
  return value.split('#')[0].split('?')[0];
}

function isIgnoredHref(href) {
  const value = href.trim().toLowerCase();
  return !value
    || value.startsWith('#')
    || value.startsWith('http://')
    || value.startsWith('https://')
    || value.startsWith('mailto:')
    || value.startsWith('tel:')
    || value.startsWith('javascript:')
    || value.startsWith('data:')
    || value.startsWith('blob:');
}

function resolveTarget(filePath, href) {
  const cleanHref = stripHashAndQuery(href.trim());
  if (!cleanHref) return null;

  if (cleanHref.startsWith('/')) {
    return path.join(root, cleanHref.replace(/^\/+/, ''));
  }

  return path.resolve(path.dirname(filePath), cleanHref);
}

function extractHrefs(html) {
  const hrefs = [];
  const regex = /\bhref\s*=\s*(["'])(.*?)\1/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    hrefs.push(match[2]);
  }
  return hrefs;
}

function rel(filePath) {
  return path.relative(root, filePath).replace(/\\/g, '/');
}

function writeReport() {
  fs.mkdirSync(reportDir, { recursive: true });
  const lines = [];
  lines.push('# Rapport — Liens locaux HTML');
  lines.push('');
  lines.push(`Date : ${new Date().toISOString()}`);
  lines.push(`Verdict : ${errors.length ? 'ECHEC' : 'OK'}`);
  lines.push('');
  lines.push('## Synthèse');
  lines.push('');
  lines.push(`- Fichiers HTML contrôlés : ${checkedFiles}`);
  lines.push(`- Liens locaux contrôlés : ${checkedLinks}`);
  lines.push(`- Erreurs bloquantes : ${errors.length}`);
  lines.push(`- Avertissements : ${warnings.length}`);
  lines.push('');
  lines.push('## Liens par module');
  lines.push('');

  if (rows.length) {
    lines.push('| Module source | Lien | Cible résolue | Statut |');
    lines.push('|---|---|---|---|');
    for (const row of rows) {
      lines.push(`| \`${row.source}\` | \`${row.href}\` | \`${row.target}\` | ${row.status} |`);
    }
  } else {
    lines.push('Aucun lien local relatif détecté dans les fichiers HTML.');
  }

  lines.push('');
  lines.push('## Erreurs bloquantes');
  lines.push('');
  if (errors.length) errors.forEach(error => lines.push(`- ${error}`));
  else lines.push('Aucune erreur bloquante détectée.');

  lines.push('');
  lines.push('## Avertissements');
  lines.push('');
  if (warnings.length) warnings.forEach(warning => lines.push(`- ${warning}`));
  else lines.push('Aucun avertissement détecté.');

  lines.push('');
  lines.push('## Règle de décision');
  lines.push('');
  lines.push('Un lien local HTML est bloquant lorsqu’il pointe vers un fichier absent du dépôt. Les liens externes, ancres, mailto, tel, javascript, data et blob sont ignorés par ce contrôle.');
  lines.push('');

  fs.writeFileSync(reportPath, lines.join('\n'), 'utf8');
}

for (const filePath of walk(srcDir)) {
  checkedFiles++;
  const relativeFile = rel(filePath);
  const html = fs.readFileSync(filePath, 'utf8');
  const hrefs = extractHrefs(html);

  for (const href of hrefs) {
    if (isIgnoredHref(href)) continue;
    checkedLinks++;
    const target = resolveTarget(filePath, href);
    if (!target) continue;

    const relativeTarget = rel(target);
    const row = {
      source: relativeFile,
      href,
      target: relativeTarget,
      status: 'OK'
    };

    if (!target.startsWith(root)) {
      row.status = 'AVERTISSEMENT';
      warnings.push(`${relativeFile} — lien local sortant du dépôt : ${href}`);
      rows.push(row);
      continue;
    }

    if (!fs.existsSync(target)) {
      row.status = 'MANQUANT';
      errors.push(`${relativeFile} — lien local introuvable : ${href} → ${relativeTarget}`);
      rows.push(row);
      continue;
    }

    rows.push(row);
  }
}

writeReport();

console.log('Contrôle liens locaux HTML');
console.log('==========================');
console.log(`Fichiers HTML contrôlés : ${checkedFiles}`);
console.log(`Liens locaux contrôlés : ${checkedLinks}`);
console.log(`Rapport : ${rel(reportPath)}`);

if (warnings.length) {
  console.log('\nAvertissements :');
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error('\nErreurs bloquantes :');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('\nLiens locaux HTML OK.');
