#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const scanDirs = ['data', 'templates', 'exports'];
const reportDir = path.join(root, 'rapports');
const reportPath = path.join(reportDir, 'controle-csv-critiques.md');

const errors = [];
const warnings = [];
const rows = [];
let checkedFiles = 0;

const criticalRules = [
  {
    match: /mapping.*tfi.*stock.*mini.*maxi.*\.csv$/i,
    label: 'Mapping TFI stock mini/maxi',
    requiredColumns: [
      'champ_application',
      'champ_tfi',
      'libelle_tfi',
      'type_donnee',
      'obligatoire',
      'format_attendu',
      'regle_transformation',
      'controle_avant_export',
      'risque_en_cas_erreur',
      'autorise_reinjection',
      'commentaire'
    ],
    requireDataRows: true
  },
  {
    match: /export.*tfi.*\.csv$/i,
    label: 'Export TFI',
    requiredColumns: [
      'statut_export',
      'reference_interne_tfi',
      'validation_humaine',
      'validateur',
      'date_validation',
      'justification_modification',
      'version_mapping_tfi'
    ],
    requireDataRows: true
  }
];

function rel(filePath) {
  return path.relative(root, filePath).replace(/\\/g, '/');
}

function walk(relativeDir) {
  const fullDir = path.join(root, relativeDir);
  if (!fs.existsSync(fullDir)) return [];

  let files = [];
  for (const entry of fs.readdirSync(fullDir, { withFileTypes: true })) {
    const fullPath = path.join(fullDir, entry.name);
    const relPath = rel(fullPath);
    if (entry.isDirectory()) {
      files = files.concat(walk(relPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.csv')) {
      files.push(fullPath);
    }
  }
  return files.sort();
}

function detectDelimiter(line) {
  const comma = (line.match(/,/g) || []).length;
  const semicolon = (line.match(/;/g) || []).length;
  return semicolon > comma ? ';' : ',';
}

function splitCsvLine(line, delimiter) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i++;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === delimiter && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values.map(value => value.replace(/^\uFEFF/, '').trim());
}

function normalizeHeader(value) {
  return String(value || '').trim().toLowerCase();
}

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function matchingRule(relativePath) {
  return criticalRules.find(rule => rule.match.test(relativePath));
}

function shouldRequireDataRows(relativePath, rule) {
  if (rule) return relativePath.startsWith('exports/');
  return relativePath.startsWith('exports/');
}

function checkCsv(filePath) {
  checkedFiles++;
  const relativePath = rel(filePath);
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/).filter(line => line.trim().length > 0);
  const row = {
    file: relativePath,
    delimiter: '-',
    columns: 0,
    dataRows: 0,
    critical: 'non',
    status: 'OK'
  };

  if (!raw.trim()) {
    row.status = 'ERREUR';
    addError(`${relativePath} — fichier CSV vide`);
    rows.push(row);
    return;
  }

  if (!lines.length) {
    row.status = 'ERREUR';
    addError(`${relativePath} — aucun contenu exploitable`);
    rows.push(row);
    return;
  }

  const delimiter = detectDelimiter(lines[0]);
  row.delimiter = delimiter === ';' ? 'point-virgule' : 'virgule';
  const headers = splitCsvLine(lines[0], delimiter).map(normalizeHeader);
  row.columns = headers.length;
  row.dataRows = Math.max(0, lines.length - 1);

  if (!headers.length || headers.some(header => !header)) {
    row.status = 'ERREUR';
    addError(`${relativePath} — en-tête CSV vide ou colonne sans nom`);
  }

  const rule = matchingRule(relativePath);
  if (rule) {
    row.critical = rule.label;
    const missing = rule.requiredColumns.filter(column => !headers.includes(column));
    if (missing.length) {
      row.status = 'ERREUR';
      addError(`${relativePath} — colonnes obligatoires manquantes pour ${rule.label} : ${missing.join(', ')}`);
    }
  }

  if (row.dataRows === 0) {
    if (shouldRequireDataRows(relativePath, rule)) {
      row.status = 'ERREUR';
      addError(`${relativePath} — aucune ligne de données après l’en-tête`);
    } else {
      if (row.status === 'OK') row.status = 'AVERTISSEMENT';
      addWarning(`${relativePath} — aucune ligne de données après l’en-tête`);
    }
  }

  const duplicates = headers.filter((header, index) => headers.indexOf(header) !== index);
  if (duplicates.length) {
    row.status = 'ERREUR';
    addError(`${relativePath} — colonnes dupliquées : ${[...new Set(duplicates)].join(', ')}`);
  }

  if (!rule && /tfi|export|mapping|stock|mini|maxi/i.test(relativePath)) {
    addWarning(`${relativePath} — CSV potentiellement critique sans règle de colonnes dédiée`);
  }

  rows.push(row);
}

function writeReport() {
  fs.mkdirSync(reportDir, { recursive: true });
  const lines = [];
  lines.push('# Rapport — CSV critiques');
  lines.push('');
  lines.push(`Date : ${new Date().toISOString()}`);
  lines.push(`Verdict : ${errors.length ? 'ECHEC' : 'OK'}`);
  lines.push('');
  lines.push('## Synthèse');
  lines.push('');
  lines.push(`- Fichiers CSV contrôlés : ${checkedFiles}`);
  lines.push(`- Erreurs bloquantes : ${errors.length}`);
  lines.push(`- Avertissements : ${warnings.length}`);
  lines.push('');
  lines.push('## Fichiers contrôlés');
  lines.push('');

  if (rows.length) {
    lines.push('| Fichier | Délimiteur | Colonnes | Lignes données | Criticité | Statut |');
    lines.push('|---|---|---:|---:|---|---|');
    for (const row of rows) {
      lines.push(`| \`${row.file}\` | ${row.delimiter} | ${row.columns} | ${row.dataRows} | ${row.critical} | ${row.status} |`);
    }
  } else {
    lines.push('Aucun fichier CSV détecté dans les dossiers contrôlés.');
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
  lines.push('Un CSV critique est bloquant s’il est vide, s’il contient des colonnes dupliquées, s’il ne respecte pas les colonnes obligatoires attendues ou, pour un export réel dans `exports/`, s’il ne contient aucune ligne de données. Les mappings et templates peuvent être validés avec une structure d’en-tête conforme, même lorsqu’ils ne représentent pas un export réel.');
  lines.push('');

  fs.writeFileSync(reportPath, lines.join('\n'), 'utf8');
}

for (const filePath of scanDirs.flatMap(walk)) {
  checkCsv(filePath);
}

writeReport();

console.log('Contrôle CSV critiques');
console.log('======================');
console.log(`Fichiers CSV contrôlés : ${checkedFiles}`);
console.log(`Rapport : ${rel(reportPath)}`);

if (warnings.length) {
  console.log('\nAvertissements :');
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error('\nErreurs bloquantes :');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('\nCSV critiques OK.');
