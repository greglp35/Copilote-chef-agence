#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const scriptPath = path.join(repoRoot, 'scripts', 'check-json.js');

function makeWorkspace(name) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `copilote-${name}-`));
  fs.mkdirSync(path.join(dir, 'data'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'projets'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'templates'), { recursive: true });
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

const cleanWorkspace = makeWorkspace('json-clean');
fs.writeFileSync(path.join(cleanWorkspace, 'data', 'ok.json'), JSON.stringify({ statut: 'OK' }, null, 2));
const cleanResult = runCheck(cleanWorkspace);
assert(cleanResult.status === 0, 'un JSON valide doit passer');

const badWorkspace = makeWorkspace('json-invalid');
fs.writeFileSync(path.join(badWorkspace, 'data', 'bad.json'), '{ "statut": "KO", }\n');
const badResult = runCheck(badWorkspace);
assert(badResult.status !== 0, 'un JSON invalide doit bloquer');
assert((badResult.stderr + badResult.stdout).includes('bad.json'), 'le rapport doit citer le fichier JSON invalide');

console.log('Tests détecteur JSON OK.');
