#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const srcDir = path.join(root, 'src');

const errors = [];
const warnings = [];
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

for (const filePath of walk(srcDir)) {
  checkedFiles++;
  const relativeFile = path.relative(root, filePath).replace(/\\/g, '/');
  const html = fs.readFileSync(filePath, 'utf8');
  const hrefs = extractHrefs(html);

  for (const href of hrefs) {
    if (isIgnoredHref(href)) continue;
    checkedLinks++;
    const target = resolveTarget(filePath, href);
    if (!target) continue;

    const relativeTarget = path.relative(root, target).replace(/\\/g, '/');
    if (!fs.existsSync(target)) {
      errors.push(`${relativeFile} — lien local introuvable : ${href} → ${relativeTarget}`);
      continue;
    }

    if (!target.startsWith(root)) {
      warnings.push(`${relativeFile} — lien local sortant du dépôt : ${href}`);
    }
  }
}

console.log('Contrôle liens locaux HTML');
console.log('==========================');
console.log(`Fichiers HTML contrôlés : ${checkedFiles}`);
console.log(`Liens locaux contrôlés : ${checkedLinks}`);

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
