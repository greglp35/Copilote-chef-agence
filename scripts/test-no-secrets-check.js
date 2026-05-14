#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const scriptPath = path.join(repoRoot, 'scripts', 'check-no-secrets.js');

function makeWorkspace(name) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `copilote-${name}-`));
  for (const subdir of ['docs', 'src', 'templates', 'data', 'projets']) {
    fs.mkdirSync(path.join(dir, subdir), { recursive: true });
  }
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

const cleanWorkspace = makeWorkspace('secret-clean');
fs.writeFileSync(path.join(cleanWorkspace, 'data', 'ok.json'), JSON.stringify({ statut: 'OK', commentaire: 'aucun secret' }, null, 2));
const cleanResult = runCheck(cleanWorkspace);
assert(cleanResult.status === 0, 'un fichier sans secret doit passer');

const jsonSecretWorkspace = makeWorkspace('secret-json');
fs.writeFileSync(path.join(jsonSecretWorkspace, 'data', 'secret.json'), '{\n  "password": "FAUX_SECRET_DE_TEST_123456"\n}\n');
const jsonSecretResult = runCheck(jsonSecretWorkspace);
assert(jsonSecretResult.status !== 0, 'une clé JSON password doit bloquer');
assert((jsonSecretResult.stderr + jsonSecretResult.stdout).includes('secret.json'), 'le rapport doit citer le fichier secret JSON');

const jsSecretWorkspace = makeWorkspace('secret-js');
fs.writeFileSync(path.join(jsSecretWorkspace, 'src', 'secret.js'), 'const apiKey = "FAUX_SECRET_DE_TEST_123456";\n');
const jsSecretResult = runCheck(jsSecretWorkspace);
assert(jsSecretResult.status !== 0, 'une clé JS apiKey doit bloquer');
assert((jsSecretResult.stderr + jsSecretResult.stdout).includes('secret.js'), 'le rapport doit citer le fichier secret JS');

const docsWorkspace = makeWorkspace('secret-docs');
fs.writeFileSync(path.join(docsWorkspace, 'docs', 'securite.md'), 'Ne jamais mettre AS400, ODBC ou SQL sensible dans le HTML.\n');
const docsResult = runCheck(docsWorkspace);
assert(docsResult.status === 0, 'une mention documentaire AS400 / ODBC / SQL dans docs ne doit pas bloquer');

const odbcWorkspace = makeWorkspace('secret-odbc');
fs.writeFileSync(path.join(odbcWorkspace, 'src', 'bad.html'), '<script>const connection = "Driver=IBM i;DSN=PROD;Uid=admin;Pwd=test";</script>\n');
const odbcResult = runCheck(odbcWorkspace);
assert(odbcResult.status !== 0, 'une chaîne ODBC dans src doit bloquer');

console.log('Tests détecteur anti-secrets OK.');
