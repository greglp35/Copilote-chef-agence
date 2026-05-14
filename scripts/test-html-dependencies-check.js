#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const scriptPath = path.join(repoRoot, 'scripts', 'check-html-dependencies.js');

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

const cleanWorkspace = makeWorkspace('html-clean');
fs.writeFileSync(path.join(cleanWorkspace, 'src', 'ok.html'), '<!doctype html><html><head><style>body{font-family:Arial}</style></head><body><h1>OK</h1><script>const local = true;</script></body></html>');
const cleanResult = runCheck(cleanWorkspace);
assert(cleanResult.status === 0, 'un HTML local sans dépendance externe doit passer');

const cdnWorkspace = makeWorkspace('html-cdn');
fs.writeFileSync(path.join(cdnWorkspace, 'src', 'bad.html'), '<!doctype html><html><head><script src="https://cdn.example.com/app.js"></script></head><body></body></html>');
const cdnResult = runCheck(cdnWorkspace);
assert(cdnResult.status !== 0, 'un script externe https doit bloquer');
assert((cdnResult.stderr + cdnResult.stdout).includes('bad.html'), 'le rapport doit citer le fichier HTML avec dépendance externe');

const fetchWorkspace = makeWorkspace('html-fetch');
fs.writeFileSync(path.join(fetchWorkspace, 'src', 'fetch.html'), '<script>fetch("https://api.example.com/data")</script>');
const fetchResult = runCheck(fetchWorkspace);
assert(fetchResult.status !== 0, 'un fetch externe doit bloquer');

console.log('Tests détecteur dépendances HTML OK.');
