#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const scriptPath = path.join(repoRoot, 'scripts', 'check-stock-tfi-rules.js');

function makeWorkspace(name) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `copilote-${name}-`));
  for (const subdir of ['data', 'exports', 'projets']) {
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

const cleanWorkspace = makeWorkspace('stock-clean');
fs.writeFileSync(path.join(cleanWorkspace, 'data', 'stock-ok.json'), JSON.stringify({
  items: [
    {
      code_article: 'OK-001',
      designation: 'Article correct',
      code_zone_tfi: 'DP0101',
      stock_physique: 20,
      stock_reserve: 2,
      vente_30j: 10,
      vente_90j: 30,
      delai_fournisseur_jours: 5,
      mini: 5,
      maxi: 20,
      multiple_achat: 5,
      quantite_reapprovisionnement: 10
    }
  ]
}, null, 2));
const cleanResult = runCheck(cleanWorkspace);
assert(cleanResult.status === 0, 'un stock cohérent doit passer');

const badStockWorkspace = makeWorkspace('stock-bad');
fs.writeFileSync(path.join(badStockWorkspace, 'data', 'stock-bad.json'), JSON.stringify({
  items: [
    { code_article: 'BAD-MINI', mini: 30, maxi: 10, multiple_achat: 5, vente_90j: 20, delai_fournisseur_jours: 5 },
    { code_article: 'BAD-MULTIPLE', mini: 5, maxi: 20, multiple_achat: 0, vente_90j: 20, delai_fournisseur_jours: 5 },
    { code_article: 'BAD-ZONE', mini: 5, maxi: 20, multiple_achat: 5, vente_90j: 20, delai_fournisseur_jours: 5, code_zone_tfi: 'DP-01-01' },
    { code_article: 'BAD-RESERVE', stock_physique: 5, stock_reserve: 8, mini: 1, maxi: 10, multiple_achat: 1, vente_90j: 20, delai_fournisseur_jours: 5 }
  ]
}, null, 2));
const badStockResult = runCheck(badStockWorkspace);
assert(badStockResult.status !== 0, 'les incohérences stock doivent bloquer');
assert((badStockResult.stderr + badStockResult.stdout).includes('BAD-MINI'), 'le rapport doit citer BAD-MINI');
assert((badStockResult.stderr + badStockResult.stdout).includes('BAD-ZONE'), 'le rapport doit citer BAD-ZONE');

const badExportWorkspace = makeWorkspace('export-bad');
fs.writeFileSync(path.join(badExportWorkspace, 'exports', 'tfi-bad.json'), JSON.stringify({
  exports: [
    {
      reference_interne_tfi: 'EXP-001',
      statut_export: 'PRET_TFI',
      validation_humaine: 'NON',
      nouvelle_valeur_stock_minimum: 5,
      nouvelle_valeur_stock_maximum: 20,
      multiple_achat: 5,
      vente_90j: 20,
      delai_fournisseur_jours: 5
    }
  ]
}, null, 2));
const badExportResult = runCheck(badExportWorkspace);
assert(badExportResult.status !== 0, 'un export PRET_TFI sans validation doit bloquer');
assert((badExportResult.stderr + badExportResult.stdout).includes('validation_humaine'), 'le rapport doit citer validation_humaine');

console.log('Tests contrôle métier stock / TFI OK.');
