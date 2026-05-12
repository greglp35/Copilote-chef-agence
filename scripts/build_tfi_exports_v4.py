#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime, timezone
import csv
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
SRC_ZONES = ROOT / 'data' / 'tfi-zones-source.csv'
SRC_ARTICLES = ROOT / 'data' / 'tfi-articles-source.csv'
OUT = ROOT / 'exports' / 'tfi-v4'
ZONE_RE = re.compile(r'^[A-Z0-9]{6}$')


def norm_zone(value):
    return str(value or '').replace('-', '').replace(' ', '').upper().strip()


def read_csv(path):
    with path.open('r', encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f, delimiter=';'))


def split_list(value):
    return [x.strip() for x in str(value or '').split('|') if x.strip()]


def as_number(value, default=0):
    try:
        return float(str(value).replace(',', '.'))
    except Exception:
        return default


def write_csv(path, rows, columns):
    with path.open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=columns, delimiter=';')
        writer.writeheader()
        writer.writerows(rows)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    errors = []
    warnings = []

    if not SRC_ZONES.exists():
        errors.append(f'fichier manquant: {SRC_ZONES.relative_to(ROOT)}')
        zones_raw = []
    else:
        zones_raw = read_csv(SRC_ZONES)

    if not SRC_ARTICLES.exists():
        errors.append(f'fichier manquant: {SRC_ARTICLES.relative_to(ROOT)}')
        articles_raw = []
    else:
        articles_raw = read_csv(SRC_ARTICLES)

    zones = {}
    zones_export = []
    for index, z in enumerate(zones_raw, start=2):
        code = norm_zone(z.get('code_zone_tfi'))
        status = 'OK'
        detail = ''
        if not ZONE_RE.match(code):
            status = 'ERREUR'
            detail = 'code_zone_tfi doit faire 6 caracteres alphanumeriques sans tiret'
            errors.append(f'zones ligne {index}: {detail}')
        if code in zones:
            status = 'ERREUR'
            detail = 'code_zone_tfi duplique'
            errors.append(f'zones ligne {index}: code duplique {code}')
        zones[code] = {
            **z,
            'code_zone_tfi': code,
            'familles_autorisees_list': split_list(z.get('familles_autorisees')),
            'familles_interdites_list': split_list(z.get('familles_interdites')),
        }
        zones_export.append({
            'code_zone_tfi': code,
            'code_zone_affiche': z.get('code_zone_affiche', ''),
            'nom_zone': z.get('nom_zone', ''),
            'type_zone': z.get('type_zone', ''),
            'niveau_risque': z.get('niveau_risque', ''),
            'statut_zone': z.get('statut_zone', ''),
            'controle': status,
            'details': detail,
        })

    articles_export = []
    analysis_export = []
    for index, a in enumerate(articles_raw, start=2):
        code_article = str(a.get('code_article', '')).strip()
        famille = str(a.get('famille', '')).strip()
        zone_code = norm_zone(a.get('code_zone_tfi'))
        controle = 'OK'
        details = []

        if not code_article:
            controle = 'ERREUR'
            details.append('code_article manquant')
        if not ZONE_RE.match(zone_code):
            controle = 'ERREUR'
            details.append('code_zone_tfi invalide')
        zone = zones.get(zone_code)
        if not zone:
            controle = 'ERREUR'
            details.append('zone inconnue dans le referentiel')
        else:
            allowed = zone.get('familles_autorisees_list', [])
            forbidden = zone.get('familles_interdites_list', [])
            if 'Toutes marchandises' in forbidden or famille in forbidden:
                controle = 'ERREUR'
                details.append('famille interdite dans cette zone')
            elif allowed and 'Toutes familles' not in allowed and famille not in allowed:
                controle = 'ALERTE' if controle == 'OK' else controle
                details.append('famille non prevue dans cette zone')
            if zone.get('niveau_risque') == 'bloquant' or zone.get('type_zone') == 'securite':
                controle = 'ERREUR'
                details.append('zone non stockable')
            if zone.get('statut_zone') != 'active' and controle == 'OK':
                controle = 'ALERTE'
                details.append('zone a revoir')

        stock_physique = as_number(a.get('stock_physique'))
        stock_reserve = as_number(a.get('stock_reserve'))
        commandes = as_number(a.get('commandes_en_cours'))
        mini = as_number(a.get('mini'))
        maxi = as_number(a.get('maxi'))
        multiple = max(1, as_number(a.get('multiple_achat'), 1))
        disponible = stock_physique - stock_reserve
        projete = disponible + commandes
        reco = 0
        statut_stock = 'OK'
        if mini > maxi:
            statut_stock = 'INCOMPATIBLE'
            controle = 'ERREUR'
            details.append('mini superieur au maxi')
        elif projete < mini:
            statut_stock = 'SOUS_MINI' if disponible < mini else 'A_COMMANDER'
            reco = ((mini - projete + multiple - 1) // multiple) * multiple
        elif projete > maxi:
            statut_stock = 'SURSTOCK'

        details_text = ' | '.join(details)
        if controle == 'ERREUR':
            errors.append(f'article ligne {index} {code_article}: {details_text}')
        elif controle == 'ALERTE':
            warnings.append(f'article ligne {index} {code_article}: {details_text}')

        articles_export.append({
            'code_article': code_article,
            'code_zone_tfi': zone_code,
            'designation': a.get('designation', ''),
            'famille': famille,
            'controle': controle,
            'details': details_text,
        })
        analysis_export.append({
            **articles_export[-1],
            'stock_disponible': int(disponible),
            'stock_projete': int(projete),
            'statut_stock': statut_stock,
            'quantite_recommandee': int(reco),
        })

    write_csv(OUT / 'zones-tfi-controle.csv', zones_export, ['code_zone_tfi','code_zone_affiche','nom_zone','type_zone','niveau_risque','statut_zone','controle','details'])
    write_csv(OUT / 'articles-zones-tfi-export.csv', articles_export, ['code_article','code_zone_tfi','designation','famille','controle','details'])
    write_csv(OUT / 'stock-zonage-analyse.csv', analysis_export, ['code_article','code_zone_tfi','designation','famille','controle','details','stock_disponible','stock_projete','statut_stock','quantite_recommandee'])

    report = {
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'source_zones': str(SRC_ZONES.relative_to(ROOT)),
        'source_articles': str(SRC_ARTICLES.relative_to(ROOT)),
        'exports_dir': str(OUT.relative_to(ROOT)),
        'zones_count': len(zones_raw),
        'articles_count': len(articles_raw),
        'errors_count': len(errors),
        'warnings_count': len(warnings),
        'errors': errors,
        'warnings': warnings,
    }
    (OUT / 'rapport-controle-tfi-v4.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')

    md = [
        '# Rapport TFI V4', '',
        f"Date: {report['generated_at']}", '',
        '## Verdict', '',
        '**ROUGE - corriger avant usage TFI**' if errors else ('**ORANGE - exploitable avec alertes**' if warnings else '**VERT - exploitable**'), '',
        f"Zones: {len(zones_raw)}", f"Articles: {len(articles_raw)}", f"Erreurs: {len(errors)}", f"Alertes: {len(warnings)}", '',
        '## Exports', '',
        '- exports/tfi-v4/zones-tfi-controle.csv',
        '- exports/tfi-v4/articles-zones-tfi-export.csv',
        '- exports/tfi-v4/stock-zonage-analyse.csv',
        '- exports/tfi-v4/rapport-controle-tfi-v4.json', '',
        '## Regle TFI', '',
        '`code_zone_tfi` doit contenir exactement 6 caracteres alphanumeriques, sans tiret ni espace.', ''
    ]
    if errors:
        md += ['## Erreurs', ''] + [f'- {e}' for e in errors] + ['']
    if warnings:
        md += ['## Alertes', ''] + [f'- {w}' for w in warnings] + ['']
    md += ['Validation humaine obligatoire avant saisie ou import dans TFI.']
    (OUT / 'rapport-controle-tfi-v4.md').write_text('\n'.join(md), encoding='utf-8')
    print('\n'.join(md))
    return 1 if errors else 0

if __name__ == '__main__':
    sys.exit(main())
