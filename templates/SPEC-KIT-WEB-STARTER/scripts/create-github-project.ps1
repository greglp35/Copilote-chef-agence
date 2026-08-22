param(
  [string]$Owner = "@me",
  [string]$Title = "AJI - Portfolio Applications"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw "GitHub CLI (gh) est requis."
}

gh auth status
Write-Host "Le scope project est requis. Si besoin: gh auth refresh -s project" -ForegroundColor Yellow

$number = gh project create --owner $Owner --title $Title --format json --jq '.number'
if (-not $number) { throw "Numéro du projet introuvable." }

$fields = @(
  @{Name="Application"; Type="SINGLE_SELECT"; Options="Planning,Zonage,CRM,ERP,Hub,Reappro,Copilote,Autre"},
  @{Name="Priorité"; Type="SINGLE_SELECT"; Options="P0,P1,P2,P3"},
  @{Name="Phase"; Type="SINGLE_SELECT"; Options="Backlog,Specification,Development,Review,Test,Release,Production,Blocked"},
  @{Name="Risque"; Type="SINGLE_SELECT"; Options="Faible,Moyen,Eleve,Critique"},
  @{Name="Maturité"; Type="SINGLE_SELECT"; Options="L0,L1,L2,L3,L4,L5,L6"},
  @{Name="Environnement"; Type="SINGLE_SELECT"; Options="Local,Preview,Staging,Production"},
  @{Name="Prochaine action"; Type="TEXT"; Options=$null}
)

foreach ($f in $fields) {
  $args = @("project","field-create",$number,"--owner",$Owner,"--name",$f.Name,"--data-type",$f.Type)
  if ($f.Options) { $args += @("--single-select-options",$f.Options) }
  & gh @args
}

$items = @(
  "https://github.com/greglp35/aji-planning-pro-v4-multisite/pull/40",
  "https://github.com/greglp35/zonage-AJI/pull/15",
  "https://github.com/greglp35/zonage-AJI/issues/16",
  "https://github.com/greglp35/zonage-AJI/pull/17",
  "https://github.com/greglp35/CRM/pull/12",
  "https://github.com/greglp35/erp-artisan-btp/pull/2",
  "https://github.com/greglp35/aji-hub/issues/1",
  "https://github.com/greglp35/aji-hub/pull/2",
  "https://github.com/greglp35/Copilote-chef-agence/pull/43",
  "https://github.com/greglp35/reappro/pull/3"
)

foreach ($url in $items) {
  gh project item-add $number --owner $Owner --url $url
}

gh project edit $number --owner $Owner --description "Cockpit transverse des applications, priorités, risques, PR, incidents et releases."

Write-Host "Projet créé : #$number" -ForegroundColor Green
Write-Host "Ouvrir : gh project view $number --owner $Owner --web"
Write-Host "Créer ensuite les vues : Cockpit, Kanban, Sécurité, Releases et Roadmap." -ForegroundColor Yellow
