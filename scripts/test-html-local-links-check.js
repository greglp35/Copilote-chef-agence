#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const scriptPath = path.join(repoRoot, 'scripts', 'check-html-local-links.js');

function makeWorkspace(name) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `copilote-links-${name}-`));
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
  return dir;
}

function runCheck(cwd) {
  return spawnSync(process.execPath, [scriptPath], { cwd, encoding: 'utf8' });
}

function readReport(cwd) {
  const reportPath = path.join(cwd, 'rapports', 'liens-html-locaux.md');
  assert(fs.existsSync(reportPath), 'le rapport liens HTML doit être généré');
  return fs.readFileSync(reportPath, 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    console.error(`ECHEC TEST : ${message}`);
    process.exit(1);
  }
}

const okWorkspace = makeWorkspace('ok');
fs.writeFileSync(path.join(okWorkspace, 'src', 'index.html'), `<!doctype html>
<html><body>
  <a href="module.html">Module</a>
  <a href="#top">Ancre</a>
  <a href="mailto:test@example.com">Mail</a>
  <a href="https://example.com">Externe</a>
</body></html>`);
fs.writeFileSync(path.join(okWorkspace, 'src', 'module.html'), '<!doctype html><html><body>OK</body></html>');
const okResult = runCheck(okWorkspace);
assert(okResult.status === 0, 'les liens locaux existants doivent passer');
const okReport = readReport(okWorkspace);
assert(okReport.includes('module.html'), 'le rapport doit citer le lien local OK');
assert(okReport.includes('Verdict : OK'), 'le rapport OK doit afficher Verdict : OK');

const badWorkspace = makeWorkspace('bad');
fs.writeFileSync(path.join(badWorkspace, 'src', 'index.html'), `<!doctype html>
<html><body>
  <a href="missing.html">Lien cassé</a>
</body></html>`);
const badResult = runCheck(badWorkspace);
const badLogs = badResult.stderr + badResult.stdout;
assert(badResult.status !== 0, 'un lien local cassé doit bloquer');
assert(badLogs.includes('missing.html'), 'le log doit citer le lien cassé');
const badReport = readReport(badWorkspace);
assert(badReport.includes('missing.html'), 'le rapport doit citer le lien cassé');
assert(badReport.includes('Verdict : ECHEC'), 'le rapport erreur doit afficher Verdict : ECHEC');

const nestedWorkspace = makeWorkspace('nested');
fs.mkdirSync(path.join(nestedWorkspace, 'src', 'modules'), { recursive: true });
fs.writeFileSync(path.join(nestedWorkspace, 'src', 'index.html'), '<a href="modules/detail.html">Détail</a>');
fs.writeFileSync(path.join(nestedWorkspace, 'src', 'modules', 'detail.html'), '<a href="../index.html">Accueil</a>');
const nestedResult = runCheck(nestedWorkspace);
assert(nestedResult.status === 0, 'les liens relatifs imbriqués doivent passer');
const nestedReport = readReport(nestedWorkspace);
assert(nestedReport.includes('modules/detail.html'), 'le rapport doit citer le lien imbriqué');
assert(nestedReport.includes('../index.html'), 'le rapport doit citer le lien relatif retour');

console.log('Tests contrôle liens locaux HTML OK.');
