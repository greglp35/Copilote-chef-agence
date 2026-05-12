#!/usr/bin/env python3
from pathlib import Path
import csv, json, re
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
STOCK = ROOT / 'data' / 'stock-mini-maxi.example.json'
ZONES = ROOT / 'data' / 'zonage-agence.example.json'
OUT = ROOT / 'exports'
OUT_CSV = OUT / 'tfi-zones-articles.csv'
OUT_JSON = OUT / 'tfi-zones-articles.controle.json'
OUT_MD = OUT / 'tfi-zones-articles.rapport.md'
ZONE_RE = re.compile(r'^[A-Z0-9]{6}$')


def norm(v):
    return str(v or '').replace('-', '').replace(' ', '').upper().strip()


def disp(v):
    v = norm(v)
    return f'{v[:2]}-{v[2:4]}-{v[4:6]}' if len(v) == 6 else v


def load(p):
    return json.loads(p.read_text(encoding='utf-8'))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    stock = load(STOCK)
    zonage = load(ZONES)
    zones = {}
    for z in zonage.get('zones', []):
        code = norm(z.get('code_zone_tfi') or z.get('code_zone_erp') or z.get('code_zone_normalise'))
        if code:
            zones[code] = z

    rows = []
    alerts = []
    for item in stock.get('items', []):
        code_article = str(item.get('code_article', '')).strip()
        famille = str(item.get('famille', '')).strip()
        zone = norm(item.get('code_zone_tfi') or item.get('code_zone_erp'))
        status = 'OK'
        detail = []

        if not code_article:
            status = 'ERREUR'
            detail.append('code article manquant')
        if not ZONE_RE.fullmatch(zone):
            status = 'ERREUR'
            detail.append('zone TFI invalide')
        ref_zone = zones.get(zone)
        if not ref_zone:
            status = 'ERREUR'
            detail.append('zone absente du referentiel')
        else:
            allowed = ref_zone.get('familles_autorisees') or []
            forbidden = ref_zone.get('familles_interdites') or []
            if 'Toutes marchandises' in forbidden or famille in forbidden:
                status = 'ERREUR'
                detail.append('famille interdite dans cette zone')
            elif allowed and 'Toutes familles' not in allowed and famille not in allowed:
                status = 'ERREUR'
                detail.append('famille non prevue dans cette zone')
            if ref_zone.get('statut_zone') in {'a_revoir', 'saturee', 'bloquee'} and status == 'OK':
                status = 'ALERTE'
                detail.append('zone a revoir')

        if status != 'OK':
            alerts.append(f"{code_article or '?'} : {' | '.join(detail)}")

        rows.append({
            'code_article': code_article,
            'code_zone_tfi': zone,
            'designation': str(item.get('designation', '')).strip(),
            'famille': famille,
            'controle': status,
            'details': ' | '.join(detail),
        })

    with OUT_CSV.open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['code_article','code_zone_tfi','designation','famille','controle','details'], delimiter=';')
        writer.writeheader()
        writer.writerows(rows)

    report = {
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'csv': str(OUT_CSV.relative_to(ROOT)),
        'items_count': len(rows),
        'alerts_count': len(alerts),
        'alerts': alerts,
        'rows': rows,
    }
    OUT_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')

    lines = [
        '# Rapport export zones TFI', '',
        f"Date UTC : {report['generated_at']}",
        f"CSV : `{OUT_CSV.relative_to(ROOT)}`", '',
        'Regle : la colonne code_zone_tfi contient toujours 6 caracteres, sans tiret.', '',
        f"Articles : {len(rows)}", f"Alertes : {len(alerts)}", ''
    ]
    if alerts:
        lines += ['## Alertes', ''] + [f'- {a}' for a in alerts] + ['']
    lines += ['Colonnes CSV : `code_article;code_zone_tfi;designation;famille;controle;details`', '', 'Validation humaine obligatoire avant saisie dans TFI.']
    OUT_MD.write_text('\n'.join(lines), encoding='utf-8')
    print('\n'.join(lines))
    return 1 if any(r['controle'] == 'ERREUR' for r in rows) else 0

if __name__ == '__main__':
    raise SystemExit(main())
