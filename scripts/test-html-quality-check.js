#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const scriptPath = path.join(repoRoot, 'scripts', 'check-html-quality.js');

function makeWorkspace(name) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `copilote-${name}-`));
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
  return dir;
}

function runCheck(cwd) {
  return spawnSync(process.execPath, [scriptPath], {
    cwd,
    encoding: 'utf8'
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`ECHEC TEST : ${message}`);
    process.exit(1);
  }
}

const validWorkspace = makeWorkspace('html-quality-valid');
fs.writeFileSync(path.join(validWorkspace, 'src', 'ok.html'), `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Application stock métier</title>
  <meta name="description" content="Application locale de contrôle stock avec validation humaine obligatoire.">
</head>
<body>
  <main>
    <h1>Application stock métier</h1>
    <p>Validation humaine obligatoire avant diffusion.</p>
    <img src="logo.png" alt="Logo de démonstration">
  </main>
</body>
</html>`);
const validResult = runCheck(validWorkspace);
assert(validResult.status === 0, 'un HTML complet doit passer');

const invalidWorkspace = makeWorkspace('html-quality-invalid');
fs.writeFileSync(path.join(invalidWorkspace, 'src', 'bad.html'), `<!doctype html>
<html>
<head>
  <title>Bad</title>
</head>
<body>
  <h1>Titre 1</h1>
  <h1>Titre 2</h1>
  <img src="image.png">
</body>
</html>`);
const invalidResult = runCheck(invalidWorkspace);
const invalidLogs = invalidResult.stderr + invalidResult.stdout;
assert(invalidResult.status !== 0, 'un HTML sans meta description, avec deux H1 et image sans alt doit bloquer');
assert(invalidLogs.includes('meta description'), 'le rapport doit citer la meta description');
assert(invalidLogs.includes('un seul <h1>'), 'le rapport doit citer le problème H1');
assert(invalidLogs.includes('sans attribut alt'), 'le rapport doit citer le problème alt');

const noHtmlWorkspace = makeWorkspace('html-quality-empty');
const noHtmlResult = runCheck(noHtmlWorkspace);
assert(noHtmlResult.status === 0, 'absence de HTML dans src ne doit pas bloquer');

console.log('Tests contrôle qualité HTML OK.');
