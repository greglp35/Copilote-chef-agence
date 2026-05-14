#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const scriptPath = path.join(repoRoot, 'scripts', 'check-example-json-business-fields.js');

function makeWorkspace(name) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `copilote-example-json-${name}-`));
  fs.mkdirSync(path.join(dir, 'data'), { recursive: true });
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
  const reportPath = path.join(cwd, 'rapports', 'controle-exemples-metier-json.md');
  assert(fs.existsSync(reportPath), 'le rapport exemples JSON doit être généré');
  return fs.readFileSync(reportPath, 'utf8');
}

const validStock = {
  schema_version: '2.0',
  dataset: 'stock-mini-maxi-tfi-example',
  description: 'Jeu de données fictif de test.',
  warning: 'Données de démonstration uniquement.',
  tfi_zone_format: '6 caractères alphanumériques sans tiret.',
  items: [
    {
      code_article: 'ISO-001',
      designation: 'Laine de verre',
      famille: 'Isolation',
      code_zone_tfi: 'DP0101',
      stock_physique: 24,
      stock_reserve: 4,
      commandes_en_cours: 0,
      vente_30j: 28,
      vente_90j: 75,
      delai_fournisseur_jours: 7,
      mini: 25,
      maxi: 60,
      multiple_achat: 6,
      emplacement_interne: 'A1',
      classe: 'A'
    }
  ]
};

const okWorkspace = makeWorkspace('ok');
fs.writeFileSync(path.join(okWorkspace, 'data', 'stock-mini-maxi.example.json'), JSON.stringify(validStock, null, 2));
const okResult = runCheck(okWorkspace);
assert(okResult.status === 0, 'un exemple stock valide doit passer');
assert(readReport(okWorkspace).includes('Verdict : OK'), 'le rapport valide doit afficher OK');

const missingWorkspace = makeWorkspace('missing');
const invalidStock = JSON.parse(JSON.stringify(validStock));
delete invalidStock.items[0].code_article;
fs.writeFileSync(path.join(missingWorkspace, 'data', 'stock-mini-maxi.example.json'), JSON.stringify(invalidStock, null, 2));
const missingResult = runCheck(missingWorkspace);
const missingLogs = missingResult.stderr + missingResult.stdout;
assert(missingResult.status !== 0, 'un exemple stock avec champ obligatoire manquant doit bloquer');
assert(missingLogs.includes('code_article'), 'le log doit citer le champ manquant');

const zoneWorkspace = makeWorkspace('zone-invalid');
fs.writeFileSync(path.join(zoneWorkspace, 'data', 'zonage-agence.example.json'), JSON.stringify({
  schema_version: '2.0',
  dataset: 'zonage-agence-tfi-example',
  description: 'Jeu de zones fictif.',
  warning: 'Données de démonstration uniquement.',
  tfi_zone_format: '6 caractères sans tiret.',
  zones: [
    {
      code_zone_tfi: 'DP-01-01',
      code_zone_affiche: 'DP-01-01',
      nom_zone: 'Dépôt',
      type_zone: 'depot',
      familles_autorisees: ['Isolation'],
      familles_interdites: [],
      niveau_risque: 'faible',
      regles_securite: ['Accès dégagé'],
      capacite_estimee: 10,
      unite_capacite: 'palettes',
      statut_zone: 'active',
      sens_circulation: 'double sens',
      observations: 'Test'
    }
  ]
}, null, 2));
const zoneResult = runCheck(zoneWorkspace);
const zoneLogs = zoneResult.stderr + zoneResult.stdout;
assert(zoneResult.status !== 0, 'un code zone TFI invalide doit bloquer');
assert(zoneLogs.includes('code_zone_tfi invalide'), 'le log doit citer le code zone invalide');

const unknownWorkspace = makeWorkspace('unknown');
fs.writeFileSync(path.join(unknownWorkspace, 'data', 'autre.example.json'), JSON.stringify({ hello: 'world' }, null, 2));
const unknownResult = runCheck(unknownWorkspace);
const unknownLogs = unknownResult.stderr + unknownResult.stdout;
assert(unknownResult.status === 0, 'un exemple non reconnu doit avertir mais ne pas bloquer');
assert(unknownLogs.includes('sans règle métier dédiée'), 'le log doit citer l’avertissement de règle absente');

console.log('Tests contrôle exemples métier JSON OK.');
