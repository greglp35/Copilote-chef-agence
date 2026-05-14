#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const scriptPath = path.join(repoRoot, 'scripts', 'check-fiche-projet.js');

function makeWorkspace(name) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `copilote-fiche-${name}-`));
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'projets'), { recursive: true });
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

function validProject(projectId) {
  return {
    schema_version: '1.0',
    project_id: projectId,
    project_name: 'Projet de test',
    status: 'validated',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
    owner: 'Test',
    validator: 'Test',
    problem_to_solve: 'Problème métier suffisamment détaillé pour être exploitable par le contrôle.',
    target_users: ['chef_agence'],
    operational_goal: 'Objectif opérationnel suffisamment détaillé pour permettre une validation terrain.',
    source_files: {
      main_html: `src/${projectId}.html`,
      project_markdown: `projets/${projectId}.md`,
      project_json: `projets/${projectId}.json`
    },
    data_sources: [{ name: 'test', source_type: 'fictif', sensitive: false }],
    security_rules: {
      no_password_in_html: true,
      no_token_in_html: true,
      no_as400_credentials_in_html: true,
      no_odbc_string_in_html: true,
      no_sensitive_sql_in_html: true,
      test_data_only: true,
      human_validation_required: true
    },
    expected_features: [{ priority: 'high', name: 'Test', description: 'Fonction test', status: 'done' }],
    out_of_scope: ['Pas de données réelles'],
    success_criteria: { usable: true },
    risks: [{ risk: 'Risque test', level: 'low', mitigation: 'Contrôle' }],
    human_validation: { decision: 'validated', validated_by: 'Test', validated_at: '2026-01-01' },
    next_actions: ['Continuer les tests']
  };
}

const okWorkspace = makeWorkspace('ok');
fs.writeFileSync(path.join(okWorkspace, 'src', 'app-test.html'), '<!doctype html><html><head><title>Test</title></head><body><h1>Test</h1></body></html>');
fs.writeFileSync(path.join(okWorkspace, 'projets', 'app-test.md'), '# Projet test\n');
fs.writeFileSync(path.join(okWorkspace, 'projets', 'app-test.json'), JSON.stringify(validProject('app-test'), null, 2));
const okResult = runCheck(okWorkspace);
assert(okResult.status === 0, 'une fiche projet complète doit passer');

const missingWorkspace = makeWorkspace('missing');
fs.writeFileSync(path.join(missingWorkspace, 'src', 'sans-fiche.html'), '<!doctype html><html><head><title>Test</title></head><body><h1>Test</h1></body></html>');
const missingResult = runCheck(missingWorkspace);
const missingLogs = missingResult.stderr + missingResult.stdout;
assert(missingResult.status !== 0, 'une application sans fiche projet doit bloquer');
assert(missingLogs.includes('Fiche Markdown manquante'), 'le rapport doit citer la fiche Markdown manquante');
assert(missingLogs.includes('Fiche JSON manquante'), 'le rapport doit citer la fiche JSON manquante');

const securityWorkspace = makeWorkspace('security');
fs.writeFileSync(path.join(securityWorkspace, 'src', 'app-securite.html'), '<!doctype html><html><head><title>Test</title></head><body><h1>Test</h1></body></html>');
fs.writeFileSync(path.join(securityWorkspace, 'projets', 'app-securite.md'), '# Projet sécurité\n');
const badSecurity = validProject('app-securite');
badSecurity.security_rules.no_token_in_html = false;
fs.writeFileSync(path.join(securityWorkspace, 'projets', 'app-securite.json'), JSON.stringify(badSecurity, null, 2));
const securityResult = runCheck(securityWorkspace);
const securityLogs = securityResult.stderr + securityResult.stdout;
assert(securityResult.status !== 0, 'une règle sécurité non validée doit bloquer');
assert(securityLogs.includes('no_token_in_html'), 'le rapport doit citer la règle sécurité non validée');

const blockingWorkspace = makeWorkspace('blocking');
fs.writeFileSync(path.join(blockingWorkspace, 'src', 'app-blocking.html'), '<!doctype html><html><head><title>Test</title></head><body><h1>Test</h1></body></html>');
fs.writeFileSync(path.join(blockingWorkspace, 'projets', 'app-blocking.md'), '# Projet bloquant\n');
const blockingProject = validProject('app-blocking');
blockingProject.risks = [{ risk: 'Risque bloquant volontaire', level: 'blocking', mitigation: 'Test' }];
fs.writeFileSync(path.join(blockingWorkspace, 'projets', 'app-blocking.json'), JSON.stringify(blockingProject, null, 2));
const blockingResult = runCheck(blockingWorkspace);
const blockingLogs = blockingResult.stderr + blockingResult.stdout;
assert(blockingResult.status !== 0, 'un risque blocking doit bloquer');
assert(blockingLogs.includes('Risque bloquant'), 'le rapport doit citer le risque bloquant');

console.log('Tests contrôle fiche projet OK.');
