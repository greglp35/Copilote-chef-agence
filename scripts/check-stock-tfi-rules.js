#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const scanDirs = ['data', 'exports', 'projets'];
const ignoredDirs = new Set(['node_modules', '.git']);
const zoneTfiRegex = /^[A-Z0-9]{6}$/;
const allowedExportStatuses = new Set([
  'PRET_TFI',
  'A_VALIDER',
  'BLOQUE_DONNEES_MANQUANTES',
  'BLOQUE_INCOHERENCE',
  'BLOQUE_SECURITE',
  'IGNORE'
]);

let errors = [];
let warnings = [];
let checkedFiles = 0;
let checkedItems = 0;
let checkedExports = 0;

function walk(relativeDir) {
  const fullDir = path.join(root, relativeDir);
  if (!fs.existsSync(fullDir)) return [];

  let files = [];
  for (const entry of fs.readdirSync(fullDir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const fullPath = path.join(fullDir, entry.name);
    const relPath = path.relative(root, fullPath);

    if (entry.isDirectory()) {
      files = files.concat(walk(relPath));
    } else if (entry.isFile() && entry.name.endsWith('.json') && !entry.name.endsWith('.schema.json')) {
      files.push(relPath);
    }
  }
  return files;
}

function isPresent(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function toNumber(value) {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function refOf(item, index) {
  return item.code_article || item.reference_interne_tfi || item.reference_interne || item.designation || `ligne_${index + 1}`;
}

function addError(file, ref, message) {
  errors.push(`${file} — ${ref} — ${message}`);
}

function addWarning(file, ref, message) {
  warnings.push(`${file} — ${ref} — ${message}`);
}

function checkStockItem(file, item, index) {
  checkedItems++;
  const ref = refOf(item, index);

  const mini = toNumber(item.mini ?? item.stock_minimum ?? item.nouvelle_valeur_stock_minimum);
  const maxi = toNumber(item.maxi ?? item.stock_maximum ?? item.nouvelle_valeur_stock_maximum);
  const multiple = toNumber(item.multiple_achat);
  const vente30 = toNumber(item.vente_30j ?? item.consommation_30j);
  const vente90 = toNumber(item.vente_90j ?? item.consommation_90j);
  const delai = toNumber(item.delai_fournisseur_jours ?? item.delai_fournisseur_prudent_jours);
  const stockPhysique = toNumber(item.stock_physique);
  const stockReserve = toNumber(item.stock_reserve ?? item.stock_reserve_client);
  const quantiteReappro = toNumber(item.quantite_reapprovisionnement ?? item.quantite_reappro);

  if (mini !== null && maxi !== null && mini > maxi) {
    addError(file, ref, `mini supérieur au maxi (${mini} > ${maxi})`);
  }

  if ((mini !== null || maxi !== null) && (multiple === null || multiple < 1)) {
    addError(file, ref, 'multiple_achat manquant ou inférieur à 1');
  }

  if ((mini !== null || maxi !== null) && (vente30 === null || vente30 <= 0) && (vente90 === null || vente90 <= 0)) {
    addWarning(file, ref, 'mini/maxi renseigné sans consommation 30j ou 90j exploitable');
  }

  if ((mini !== null || maxi !== null) && (delai === null || delai <= 0)) {
    addWarning(file, ref, 'mini/maxi renseigné sans délai fournisseur exploitable');
  }

  if (stockPhysique !== null && stockReserve !== null && stockReserve > stockPhysique) {
    addError(file, ref, `stock réservé supérieur au stock physique (${stockReserve} > ${stockPhysique})`);
  }

  if (quantiteReappro !== null && multiple !== null && multiple > 0 && quantiteReappro % multiple !== 0) {
    addError(file, ref, `quantité de réapprovisionnement non multiple du multiple_achat (${quantiteReappro} / ${multiple})`);
  }

  if (isPresent(item.code_zone_tfi)) {
    const zone = String(item.code_zone_tfi).trim().toUpperCase();
    if (!zoneTfiRegex.test(zone)) {
      addError(file, ref, `code_zone_tfi invalide : ${item.code_zone_tfi}. Format attendu : 6 caractères alphanumériques sans tiret`);
    }
  }
}

function checkExportLine(file, item, index) {
  if (!isPresent(item.statut_export)) return;
  checkedExports++;
  const ref = refOf(item, index);
  const statut = String(item.statut_export).trim().toUpperCase();

  if (!allowedExportStatuses.has(statut)) {
    addError(file, ref, `statut_export inconnu : ${item.statut_export}`);
  }

  if (statut === 'PRET_TFI') {
    const validation = item.validation_humaine;
    const validationOk = validation === true || String(validation).trim().toUpperCase() === 'OUI';

    if (!validationOk) addError(file, ref, 'export PRET_TFI sans validation_humaine = OUI');
    if (!isPresent(item.validateur)) addError(file, ref, 'export PRET_TFI sans validateur');
    if (!isPresent(item.date_validation)) addError(file, ref, 'export PRET_TFI sans date_validation');
    if (!isPresent(item.justification_modification)) addError(file, ref, 'export PRET_TFI sans justification_modification');
    if (!isPresent(item.version_mapping_tfi)) addError(file, ref, 'export PRET_TFI sans version_mapping_tfi');
  }
}

function collectCandidateArrays(data) {
  const arrays = [];
  if (Array.isArray(data)) arrays.push(data);
  if (data && typeof data === 'object') {
    for (const key of ['items', 'articles', 'lignes', 'exports', 'export_tfi', 'parametres_stock']) {
      if (Array.isArray(data[key])) arrays.push(data[key]);
    }
  }
  return arrays;
}

for (const file of scanDirs.flatMap(walk)) {
  checkedFiles++;
  let data;
  try {
    data = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  } catch (error) {
    continue;
  }

  const arrays = collectCandidateArrays(data);
  for (const array of arrays) {
    array.forEach((item, index) => {
      if (!item || typeof item !== 'object') return;
      const hasStockSignals = ['mini', 'maxi', 'stock_minimum', 'stock_maximum', 'multiple_achat', 'stock_physique', 'stock_reserve', 'code_zone_tfi'].some(key => key in item);
      if (hasStockSignals) checkStockItem(file, item, index);
      checkExportLine(file, item, index);
    });
  }
}

console.log('Contrôle métier stock / TFI');
console.log('============================');
console.log(`Fichiers JSON contrôlés : ${checkedFiles}`);
console.log(`Lignes stock contrôlées : ${checkedItems}`);
console.log(`Lignes export TFI contrôlées : ${checkedExports}`);

if (warnings.length) {
  console.log('\nAvertissements métier :');
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error('\nErreurs métier bloquantes :');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('\nContrôle métier stock / TFI OK.');
