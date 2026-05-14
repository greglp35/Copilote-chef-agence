#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const scriptPath = path.join(repoRoot, 'scripts', 'check-critical-csv.js');

function makeWorkspace(name) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `copilote-csv-${name}-`));
  for (const subdir of ['data', 'templates/tfi', 'exports']) {
    fs.mkdirSync(path.join(dir, subdir), { recursive: true });
  }
  return dir;
}

function runCheck(cwd) {
  return spawnSync(process.execPath, [scriptPath], { cwd, encoding: 'utf8' });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`ECHEC TEST : ${message}`);
    process.exit(1);
  }
}

function readReport(cwd) {
  const reportPath = path.join(cwd, 'rapports', 'controle-csv-critiques.md');
  assert(fs.existsSync(reportPath), 'le rapport CSV doit être généré');
  return fs.readFileSync(reportPath, 'utf8');
}

const validWorkspace = makeWorkspace('valid');
fs.writeFileSync(path.join(validWorkspace, 'templates', 'tfi', 'mapping_tfi_stock_mini_maxi.csv'), [
  'champ_application,champ_tfi,libelle_tfi,type_donnee,obligatoire,format_attendu,regle_transformation,controle_avant_export,risque_en_cas_erreur,autorise_reinjection,commentaire',
  'statut_export,,Statut export,string,oui,PRET_TFI,Aucune,Bloquer,Erreur,non,Test'
].join('\n'));
const validResult = runCheck(validWorkspace);
assert(validResult.status === 0, 'un CSV critique valide doit passer');
const validReport = readReport(validWorkspace);
assert(validReport.includes('Verdict : OK'), 'le rapport valide doit afficher Verdict : OK');

const emptyWorkspace = makeWorkspace('empty');
fs.writeFileSync(path.join(emptyWorkspace, 'data', 'vide.csv'), '');
const emptyResult = runCheck(emptyWorkspace);
const emptyLogs = emptyResult.stderr + emptyResult.stdout;
assert(emptyResult.status !== 0, 'un CSV vide doit bloquer');
assert(emptyLogs.includes('fichier CSV vide'), 'le log doit citer le CSV vide');
const emptyReport = readReport(emptyWorkspace);
assert(emptyReport.includes('Verdict : ECHEC'), 'le rapport vide doit afficher Verdict : ECHEC');

const headerOnlyWorkspace = makeWorkspace('header-only');
fs.writeFileSync(path.join(headerOnlyWorkspace, 'templates', 'tfi', 'template_articles.csv'), 'code_article,designation,famille\n');
const headerOnlyResult = runCheck(headerOnlyWorkspace);
const headerOnlyLogs = headerOnlyResult.stderr + headerOnlyResult.stdout;
assert(headerOnlyResult.status === 0, 'un template avec en-tête seul doit avertir mais ne pas bloquer');
assert(headerOnlyLogs.includes('aucune ligne de données'), 'le log doit citer l’avertissement sur l’absence de lignes');

const exportHeaderOnlyWorkspace = makeWorkspace('export-header-only');
fs.writeFileSync(path.join(exportHeaderOnlyWorkspace, 'exports', 'export_tfi_test.csv'), 'statut_export,reference_interne_tfi,validation_humaine,validateur,date_validation,justification_modification,version_mapping_tfi\n');
const exportHeaderOnlyResult = runCheck(exportHeaderOnlyWorkspace);
assert(exportHeaderOnlyResult.status !== 0, 'un export réel sans ligne de données doit bloquer');

const missingWorkspace = makeWorkspace('missing-column');
fs.writeFileSync(path.join(missingWorkspace, 'templates', 'tfi', 'mapping_tfi_stock_mini_maxi.csv'), [
  'champ_application,champ_tfi,libelle_tfi,type_donnee,obligatoire,format_attendu',
  'statut_export,,Statut export,string,oui,PRET_TFI'
].join('\n'));
const missingResult = runCheck(missingWorkspace);
const missingLogs = missingResult.stderr + missingResult.stdout;
assert(missingResult.status !== 0, 'un CSV TFI sans colonnes obligatoires doit bloquer');
assert(missingLogs.includes('colonnes obligatoires manquantes'), 'le log doit citer les colonnes manquantes');

const duplicateWorkspace = makeWorkspace('duplicate');
fs.writeFileSync(path.join(duplicateWorkspace, 'data', 'duplicate.csv'), 'code,code,designation\nA,A,Article\n');
const duplicateResult = runCheck(duplicateWorkspace);
assert(duplicateResult.status !== 0, 'un CSV avec colonnes dupliquées doit bloquer');

console.log('Tests contrôle CSV critiques OK.');
