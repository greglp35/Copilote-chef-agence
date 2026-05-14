#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const dataDir = path.join(root, 'data');
const reportDir = path.join(root, 'rapports');
const reportPath = path.join(reportDir, 'controle-exemples-metier-json.md');

const errors = [];
const warnings = [];
const rows = [];

const commonDatasetFields = ['schema_version', 'dataset', 'description', 'warning'];

const rules = [
  {
    match: /stock-mini-maxi.*\.example\.json$/i,
    label: 'Stock mini/maxi',
    arrayField: 'items',
    requiredRootFields: [...commonDatasetFields, 'tfi_zone_format'],
    requiredItemFields: [
      'code_article',
      'designation',
      'famille',
      'code_zone_tfi',
      'stock_physique',
      'stock_reserve',
      'commandes_en_cours',
      'vente_30j',
      'vente_90j',
      'delai_fournisseur_jours',
      'mini',
      'maxi',
      'multiple_achat',
      'emplacement_interne',
      'classe'
    ],
    numericFields: [
      'stock_physique',
      'stock_reserve',
      'commandes_en_cours',
      'vente_30j',
      'vente_90j',
      'delai_fournisseur_jours',
      'mini',
      'maxi',
      'multiple_achat'
    ],
    validateItem(item, file, index) {
      const ref = item.code_article || `ligne_${index + 1}`;
      const mini = Number(item.mini);
      const maxi = Number(item.maxi);
      const multiple = Number(item.multiple_achat);
      const stockPhysique = Number(item.stock_physique);
      const stockReserve = Number(item.stock_reserve);

      if (Number.isFinite(mini) && Number.isFinite(maxi) && mini > maxi) {
        addError(`${file} — ${ref} — mini supérieur au maxi (${mini} > ${maxi})`);
      }
      if (Number.isFinite(multiple) && multiple < 1) {
        addError(`${file} — ${ref} — multiple_achat inférieur à 1`);
      }
      if (Number.isFinite(stockPhysique) && Number.isFinite(stockReserve) && stockReserve > stockPhysique) {
        addError(`${file} — ${ref} — stock réservé supérieur au stock physique`);
      }
      if (!/^[A-Z0-9]{6}$/.test(String(item.code_zone_tfi || ''))) {
        addError(`${file} — ${ref} — code_zone_tfi invalide`);
      }
    }
  },
  {
    match: /zonage-agence.*\.example\.json$/i,
    label: 'Zonage agence',
    arrayField: 'zones',
    requiredRootFields: [...commonDatasetFields, 'tfi_zone_format'],
    requiredItemFields: [
      'code_zone_tfi',
      'code_zone_affiche',
      'nom_zone',
      'type_zone',
      'familles_autorisees',
      'familles_interdites',
      'niveau_risque',
      'regles_securite',
      'capacite_estimee',
      'unite_capacite',
      'statut_zone',
      'sens_circulation',
      'observations'
    ],
    numericFields: ['capacite_estimee'],
    validateItem(item, file, index) {
      const ref = item.code_zone_tfi || `ligne_${index + 1}`;
      if (!/^[A-Z0-9]{6}$/.test(String(item.code_zone_tfi || ''))) {
        addError(`${file} — ${ref} — code_zone_tfi invalide`);
      }
      if (!Array.isArray(item.regles_securite)) {
        addError(`${file} — ${ref} — regles_securite doit être un tableau`);
      }
      if (!Array.isArray(item.familles_autorisees)) {
        addError(`${file} — ${ref} — familles_autorisees doit être un tableau`);
      }
      if (!Array.isArray(item.familles_interdites)) {
        addError(`${file} — ${ref} — familles_interdites doit être un tableau`);
      }
    }
  }
];

function rel(filePath) {
  return path.relative(root, filePath).replace(/\\/g, '/');
}

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.example.json')) {
      files.push(fullPath);
    }
  }
  return files.sort();
}

function isPresent(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function findRule(relativePath) {
  return rules.find(rule => rule.match.test(relativePath));
}

function checkRequiredFields(object, fields, file, scope) {
  for (const field of fields) {
    if (!(field in object) || !isPresent(object[field])) {
      addError(`${file} — ${scope} — champ obligatoire manquant ou vide : ${field}`);
    }
  }
}

function checkNumericFields(object, fields, file, scope) {
  for (const field of fields) {
    if (field in object && !Number.isFinite(Number(object[field]))) {
      addError(`${file} — ${scope} — champ numérique invalide : ${field}`);
    }
  }
}

function checkFile(filePath) {
  const relativePath = rel(filePath);
  const row = {
    file: relativePath,
    type: 'non reconnu',
    items: 0,
    status: 'OK'
  };

  const rule = findRule(relativePath);
  if (!rule) {
    row.status = 'AVERTISSEMENT';
    addWarning(`${relativePath} — fichier .example.json sans règle métier dédiée`);
    rows.push(row);
    return;
  }

  row.type = rule.label;

  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    row.status = 'ERREUR';
    addError(`${relativePath} — JSON invalide : ${error.message}`);
    rows.push(row);
    return;
  }

  checkRequiredFields(data, rule.requiredRootFields, relativePath, 'racine');

  const list = data[rule.arrayField];
  if (!Array.isArray(list)) {
    row.status = 'ERREUR';
    addError(`${relativePath} — ${rule.arrayField} doit être un tableau`);
    rows.push(row);
    return;
  }

  row.items = list.length;
  if (list.length === 0) {
    row.status = 'ERREUR';
    addError(`${relativePath} — ${rule.arrayField} est vide`);
  }

  list.forEach((item, index) => {
    const scope = `${rule.arrayField}[${index}]`;
    checkRequiredFields(item, rule.requiredItemFields, relativePath, scope);
    checkNumericFields(item, rule.numericFields || [], relativePath, scope);
    if (typeof rule.validateItem === 'function') {
      rule.validateItem(item, relativePath, index);
    }
  });

  rows.push(row);
}

function writeReport() {
  fs.mkdirSync(reportDir, { recursive: true });
  const lines = [];
  lines.push('# Rapport — Exemples métier JSON');
  lines.push('');
  lines.push(`Date : ${new Date().toISOString()}`);
  lines.push(`Verdict : ${errors.length ? 'ECHEC' : 'OK'}`);
  lines.push('');
  lines.push('## Synthèse');
  lines.push('');
  lines.push(`- Fichiers contrôlés : ${rows.length}`);
  lines.push(`- Erreurs bloquantes : ${errors.length}`);
  lines.push(`- Avertissements : ${warnings.length}`);
  lines.push('');
  lines.push('## Fichiers contrôlés');
  lines.push('');
  if (rows.length) {
    lines.push('| Fichier | Type | Lignes métier | Statut |');
    lines.push('|---|---|---:|---|');
    rows.forEach(row => lines.push(`| \`${row.file}\` | ${row.type} | ${row.items} | ${row.status} |`));
  } else {
    lines.push('Aucun fichier `.example.json` détecté dans /data.');
  }
  lines.push('');
  lines.push('## Erreurs bloquantes');
  lines.push('');
  if (errors.length) errors.forEach(error => lines.push(`- ${error}`));
  else lines.push('Aucune erreur bloquante détectée.');
  lines.push('');
  lines.push('## Avertissements');
  lines.push('');
  if (warnings.length) warnings.forEach(warning => lines.push(`- ${warning}`));
  else lines.push('Aucun avertissement détecté.');
  lines.push('');
  lines.push('## Règle de décision');
  lines.push('');
  lines.push('Un exemple métier JSON est bloquant si sa structure reconnue est incomplète, vide ou incohérente. Les fichiers `.example.json` non reconnus restent en avertissement tant qu’aucune règle dédiée n’existe.');
  lines.push('');
  fs.writeFileSync(reportPath, lines.join('\n'), 'utf8');
}

walk(dataDir).forEach(checkFile);
writeReport();

console.log('Contrôle exemples métier JSON');
console.log('==============================');
console.log(`Fichiers contrôlés : ${rows.length}`);
console.log(`Rapport : ${rel(reportPath)}`);

if (warnings.length) {
  console.log('\nAvertissements :');
  warnings.forEach(warning => console.log(`- ${warning}`));
}

if (errors.length) {
  console.error('\nErreurs bloquantes :');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\nExemples métier JSON OK.');
