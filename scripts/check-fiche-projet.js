#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const srcDir = path.join(root, 'src');
const projetsDir = path.join(root, 'projets');
const reportDir = path.join(root, 'rapports');
const reportPath = path.join(reportDir, 'controle-fiche-projet.md');

const requiredJsonFields = [
  'schema_version',
  'project_id',
  'project_name',
  'status',
  'created_at',
  'updated_at',
  'owner',
  'validator',
  'problem_to_solve',
  'target_users',
  'operational_goal',
  'source_files',
  'data_sources',
  'security_rules',
  'expected_features',
  'out_of_scope',
  'success_criteria',
  'risks',
  'human_validation',
  'next_actions'
];

const requiredSecurityRules = [
  'no_password_in_html',
  'no_token_in_html',
  'no_as400_credentials_in_html',
  'no_odbc_string_in_html',
  'no_sensitive_sql_in_html',
  'test_data_only',
  'human_validation_required'
];

const allowedStatus = new Set(['draft', 'in_review', 'validated', 'blocked', 'archived']);
const allowedRiskLevels = new Set(['low', 'medium', 'high', 'blocking']);
const allowedValidationDecisions = new Set(['pending', 'validated', 'needs_correction', 'blocked']);

const errors = [];
const warnings = [];
const rows = [];

function relative(filePath) {
  return path.relative(root, filePath).replace(/\\/g, '/');
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function listHtmlFiles() {
  if (!exists(srcDir)) return [];
  return fs.readdirSync(srcDir)
    .filter(name => name.endsWith('.html'))
    .map(name => path.join(srcDir, name))
    .sort();
}

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function checkProjectJson(htmlFile) {
  const projectId = path.basename(htmlFile, '.html');
  const mdFile = path.join(projetsDir, `${projectId}.md`);
  const jsonFile = path.join(projetsDir, `${projectId}.json`);

  const row = {
    html: relative(htmlFile),
    projectId,
    md: relative(mdFile),
    json: relative(jsonFile),
    mdOk: exists(mdFile),
    jsonOk: exists(jsonFile),
    projectStatus: '-',
    validation: '-',
    blockingRisk: false
  };

  if (!row.mdOk) addError(`Fiche Markdown manquante pour ${row.html} : ${row.md}`);
  if (!row.jsonOk) {
    addError(`Fiche JSON manquante pour ${row.html} : ${row.json}`);
    rows.push(row);
    return;
  }

  let data;
  try {
    data = readJson(jsonFile);
  } catch (error) {
    addError(`JSON invalide dans ${row.json} : ${error.message}`);
    rows.push(row);
    return;
  }

  for (const field of requiredJsonFields) {
    if (!(field in data)) addError(`Champ obligatoire manquant dans ${row.json} : ${field}`);
  }

  if (data.project_id !== projectId) {
    addError(`Incohérence project_id dans ${row.json} : attendu ${projectId}, obtenu ${data.project_id}`);
  }

  const sourceFiles = data.source_files && typeof data.source_files === 'object' ? data.source_files : {};
  if (sourceFiles.main_html !== row.html) {
    addError(`Incohérence main_html dans ${row.json} : attendu ${row.html}, obtenu ${sourceFiles.main_html}`);
  }
  if (sourceFiles.project_markdown !== row.md) {
    addError(`Incohérence project_markdown dans ${row.json} : attendu ${row.md}, obtenu ${sourceFiles.project_markdown}`);
  }
  if (sourceFiles.project_json !== row.json) {
    addError(`Incohérence project_json dans ${row.json} : attendu ${row.json}, obtenu ${sourceFiles.project_json}`);
  }

  row.projectStatus = String(data.status);
  if (!allowedStatus.has(data.status)) {
    addError(`Statut projet non autorisé dans ${row.json} : ${data.status}`);
  }

  const securityRules = data.security_rules && typeof data.security_rules === 'object' ? data.security_rules : {};
  for (const rule of requiredSecurityRules) {
    if (securityRules[rule] !== true) {
      addError(`Règle sécurité non validée dans ${row.json} : ${rule}`);
    }
  }

  const validation = data.human_validation && typeof data.human_validation === 'object' ? data.human_validation : {};
  row.validation = String(validation.decision);
  if (!allowedValidationDecisions.has(validation.decision)) {
    addError(`Décision de validation non autorisée dans ${row.json} : ${validation.decision}`);
  }

  const risks = Array.isArray(data.risks) ? data.risks : [];
  for (const risk of risks) {
    if (!risk || typeof risk !== 'object') {
      addError(`Format de risque invalide dans ${row.json}.`);
      continue;
    }
    if (!allowedRiskLevels.has(risk.level)) {
      addError(`Niveau de risque non autorisé dans ${row.json} : ${risk.level}`);
    }
    if (risk.level === 'blocking') {
      row.blockingRisk = true;
      addError(`Risque bloquant détecté dans ${row.json} : ${risk.risk || 'risque non nommé'}`);
    }
  }

  const features = Array.isArray(data.expected_features) ? data.expected_features : [];
  if (!features.length) addWarning(`Aucune fonctionnalité attendue documentée dans ${row.json}.`);
  if (String(data.problem_to_solve || '').trim().length < 30) addWarning(`Problème terrain trop peu détaillé dans ${row.json}.`);
  if (String(data.operational_goal || '').trim().length < 30) addWarning(`Objectif opérationnel trop peu détaillé dans ${row.json}.`);

  rows.push(row);
}

function detectOrphans() {
  if (!exists(projetsDir)) return;
  const htmlStems = new Set(listHtmlFiles().map(file => path.basename(file, '.html')));
  for (const name of fs.readdirSync(projetsDir).sort()) {
    if (!name.endsWith('.json') && !name.endsWith('.md')) continue;
    const stem = name.replace(/\.(json|md)$/i, '');
    if (!htmlStems.has(stem)) {
      addWarning(`Fiche projet orpheline sans HTML correspondant : projets/${name}`);
    }
  }
}

function writeReport() {
  fs.mkdirSync(reportDir, { recursive: true });
  const lines = [];
  lines.push('# Rapport Contrôle Fiche Projet');
  lines.push('');
  lines.push(`Date : ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## 1. Verdict');
  lines.push('');
  if (errors.length) lines.push('**ROUGE - contrôle fiche projet échoué.**');
  else if (warnings.length) lines.push('**ORANGE - contrôle fiche projet valide avec alertes.**');
  else lines.push('**VERT - toutes les applications HTML ont une fiche projet conforme.**');
  lines.push('');
  lines.push('## 2. Fichiers contrôlés');
  lines.push('');
  if (rows.length) {
    lines.push('| HTML | Markdown | JSON | Statut projet | Validation | Risque bloquant |');
    lines.push('|---|---|---|---|---|---|');
    for (const row of rows) {
      lines.push(`| \`${row.html}\` | ${row.mdOk ? 'OK' : 'MANQUANT'} | ${row.jsonOk ? 'OK' : 'MANQUANT'} | ${row.projectStatus} | ${row.validation} | ${row.blockingRisk ? 'OUI' : 'NON'} |`);
    }
  } else {
    lines.push('Aucun fichier HTML détecté dans /src.');
  }
  lines.push('');
  lines.push('## 3. Erreurs bloquantes');
  lines.push('');
  if (errors.length) errors.forEach(error => lines.push(`- ${error}`));
  else lines.push('Aucune erreur bloquante détectée.');
  lines.push('');
  lines.push('## 4. Alertes');
  lines.push('');
  if (warnings.length) warnings.forEach(warning => lines.push(`- ${warning}`));
  else lines.push('Aucune alerte détectée.');
  lines.push('');
  lines.push('## 5. Règle de décision');
  lines.push('');
  lines.push('Un fichier HTML métier dans /src doit obligatoirement avoir une fiche Markdown, une fiche JSON, des règles de sécurité confirmées, un lien cohérent vers le HTML source et une validation humaine explicite.');
  lines.push('');
  fs.writeFileSync(reportPath, lines.join('\n'), 'utf8');
}

if (!exists(projetsDir)) addError('Le dossier /projets est manquant.');
for (const htmlFile of listHtmlFiles()) checkProjectJson(htmlFile);
detectOrphans();
writeReport();

console.log('Contrôle fiche projet');
console.log('======================');
console.log(`Applications HTML contrôlées : ${rows.length}`);
console.log(`Erreurs : ${errors.length}`);
console.log(`Alertes : ${warnings.length}`);
console.log(`Rapport : ${relative(reportPath)}`);

if (warnings.length) {
  console.log('\nAlertes :');
  warnings.slice(0, 30).forEach(warning => console.log(`- ${warning}`));
  if (warnings.length > 30) console.log(`- ... ${warnings.length - 30} autres alertes`);
}

if (errors.length) {
  console.error('\nErreurs bloquantes :');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\nContrôle fiche projet OK.');
