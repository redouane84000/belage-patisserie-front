# Télécharge les photos de profil Instagram pour les fiches sans logo local.
# Usage: powershell -File scripts/fetch-annuaire-logos.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

$targets = @(
  @{ username = 'leyla_aygar'; out = 'public/patissieres/leyla-patiss.jpg' },
  @{ username = 'maisonmrp'; out = 'public/patissieres/maison-mrp.jpg' },
  @{ username = 'patisserie_delice_'; out = 'public/patissieres/patisserie-delice.jpg' },
  @{ username = 'creatrice.by.iness'; out = 'public/photographes/creatrice-by-iness.jpg' },
  @{ username = 'belage_patisserie'; out = 'public/entreprise.belage.jpg' }
)

function Get-InstagramProfileImageUrl($username) {
  $page = Invoke-WebRequest -Uri "https://www.instagram.com/$username/" -UserAgent $ua -UseBasicParsing -TimeoutSec 30
  if ($page.Content -match 'property="og:image" content="([^"]+)"') {
    return ($matches[1] -replace '&amp;', '&' -replace 's100x100', 's640x640')
  }
  throw "og:image introuvable pour @$username"
}

foreach ($t in $targets) {
  $outPath = Join-Path $root $t.out
  $dir = Split-Path -Parent $outPath
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  Write-Host "@$($t.username) -> $($t.out) ..."
  $imageUrl = Get-InstagramProfileImageUrl $t.username
  Invoke-WebRequest -Uri $imageUrl -OutFile $outPath -UserAgent $ua -UseBasicParsing
  Write-Host "  OK"
}
