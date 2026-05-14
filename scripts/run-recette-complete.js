#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = process.cwd();
const reportDir = path.join(root, 'rapports', 'recette');
const reportPath = path.join(reportDir, 'rapport-recette.md');

const checks = [
  {
    name: 'Tester le détecteur JSON',
    command: 'node scripts/test-json-check.js',
    type: 'test'
  },
  {
    name: 'Tester le détecteur anti-secrets',
    command: 'node scripts/test-no-secrets-check.js',
    type: 'test'
  },
  {
    name: 'Tester le détecteur de dépendances HTML',
    command: 'node scripts/test-html-dependencies-check.js',
    type: 'test'
  },
  {
    name: 'Tester le contrôle métier stock / TFI',
    command: 'node scripts/test-stock-tfi-rules-check.js',
    type: 'test'
  },
  {
    name: 'Contrôler la structure projet',
    command: 'node scripts/check-structure.js',
    type: 'controle'
  },
  {
    name: 'Contrôler les fichiers JSON',
    command: 'node scripts/check-json.js',
    type: 'controle'
  },
  {
    name: 'Contrôler l’absence de secrets évidents',
    command: 'node scripts/check-no-secrets.js',
    type: 'controle'
  },
  {
    name: 'Contrôler les dépendances externes HTML',
    command: 'node scripts/check-html-dependencies.js',
    type: 'controle'
  },
  {
    name: 'Contrôler les règles métier stock / TFI',
    command: 'node scripts/check-stock-tfi-rules.js',
    type: 'controle'
  }
];

function run(command) {
  const result = spawnSync(command, {
    cwd: root,
    shell: true,
    encoding: 'utf8'
  });

  return {
    status: result.status === 0 ? 'OK' : 'ECHEC',
    exitCode: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || ''
  };
}

function safe(value, fallback = 'non disponible') {
  return value && String(value).trim() ? String(value).trim() : fallback;
}

function shortLog(text) {
  const clean = String(text || '').trim();
  if (!clean) return 'Aucun log.';
  const lines = clean.split(/\r?\n/).slice(-25);
  return lines.join('\n');
}

const startedAt = new Date().toISOString();
const results = [];

console.log('Recette complète Copilote Chef d’Agence');
console.log('========================================');

for (const check of checks) {
  console.log(`\n▶ ${check.name}`);
  const result = run(check.command);
  results.push({ ...check, ...result });
  console.log(result.status === 'OK' ? 'OK' : 'ECHEC');
}

const hasFailure = results.some(result => result.status !== 'OK');
const verdict = hasFailure ? 'ECHEC' : 'OK';

fs.mkdirSync(reportDir, { recursive: true });

const report = [];
report.push('# Rapport de recette — Copilote Chef d’Agence');
report.push('');
report.push(`Date UTC : ${startedAt}`);
report.push(`Verdict : ${verdict}`);
report.push(`Branche : ${safe(process.env.GITHUB_REF_NAME || process.env.GITHUB_REF)}`);
report.push(`Commit : ${safe(process.env.GITHUB_SHA)}`);
report.push(`Workflow : ${safe(process.env.GITHUB_WORKFLOW)}`);
report.push(`Run ID : ${safe(process.env.GITHUB_RUN_ID)}`);
report.push('');
report.push('---');
report.push('');
report.push('## Synthèse');
report.push('');
report.push('| Type | Contrôle | Résultat |');
report.push('|---|---|---|');
for (const result of results) {
  report.push(`| ${result.type} | ${result.name} | ${result.status} |`);
}
report.push('');
report.push('---');
report.push('');
report.push('## Détail des contrôles');
report.push('');
for (const result of results) {
  report.push(`### ${result.name}`);
  report.push('');
  report.push(`Résultat : ${result.status}`);
  report.push(`Code sortie : ${result.exitCode}`);
  report.push('');
  report.push('```text');
  report.push(shortLog(`${result.stdout}\n${result.stderr}`));
  report.push('```');
  report.push('');
}
report.push('---');
report.push('');
report.push('## Lecture du verdict');
report.push('');
if (hasFailure) {
  report.push('La recette a détecté au moins une erreur bloquante.');
  report.push('Action recommandée : lire le premier contrôle en échec, corriger la cause, puis relancer la recette.');
} else {
  report.push('La recette minimale est passée.');
  report.push('Attention : un test vert ne remplace pas une validation humaine terrain avant diffusion.');
}
report.push('');

fs.writeFileSync(reportPath, report.join('\n'), 'utf8');
console.log(`\nRapport généré : ${path.relative(root, reportPath)}`);
console.log(`Verdict final : ${verdict}`);

process.exit(hasFailure ? 1 : 0);
