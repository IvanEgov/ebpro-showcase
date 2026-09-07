#Requires -Version 5.1
param([switch]$WhatIf)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot

function Log([string]$m, [string]$c='Cyan') { Write-Host "  $m" -ForegroundColor $c }
function Do-Remove([string]$p) {
    $full = Join-Path $Root $p
    if (Test-Path $full) {
        if ($WhatIf) { Log "[DRY] Remove: $p" 'Yellow' }
        else { Remove-Item $full -Recurse -Force; Log "Removed: $p" 'Red' }
    }
}
function Do-Create([string]$p) {
    $full = Join-Path $Root $p
    if (-not (Test-Path $full)) {
        if ($WhatIf) { Log "[DRY] Create: $p" 'Yellow' }
        else { New-Item $full -ItemType Directory -Force | Out-Null; Log "Created: $p" 'Green' }
    }
}
function Do-Copy([string]$src, [string]$dst, [string]$filter='*.*') {
    $s = Join-Path $Root $src
    $d = Join-Path $Root $dst
    if (Test-Path $s) {
        $files = Get-ChildItem $s -Filter $filter -File -ErrorAction SilentlyContinue
        foreach ($f in $files) {
            $target = Join-Path $d $f.Name
            if (-not (Test-Path $target)) {
                if ($WhatIf) { Log "[DRY] Copy: $($f.Name) -> $dst" 'Yellow' }
                else { Copy-Item $f.FullName $target -Force; Log "Copied: $($f.Name) -> $dst" 'Green' }
            }
        }
    }
}
function Do-WriteFile([string]$path, [string]$content) {
    $full = Join-Path $Root $path
    if (-not (Test-Path $full)) {
        if ($WhatIf) { Log "[DRY] Write: $path" 'Yellow' }
        else {
            $utf8 = New-Object System.Text.UTF8Encoding $true
            [System.IO.File]::WriteAllText($full, $content, $utf8)
            Log "Written: $path" 'Green'
        }
    }
}

# ============================================================
Write-Host ""
Write-Host "====================================" -ForegroundColor White
Write-Host "  EBPRO Showcase - Clean Setup" -ForegroundColor White
Write-Host "====================================" -ForegroundColor White
Write-Host "  Root: $Root"
Write-Host "  Mode: $(if($WhatIf){'DRY RUN'}else{'EXECUTE'})"
Write-Host ""

# --- STEP 1: CLEANUP ---
Write-Host "[1/5] Cleanup" -ForegroundColor Magenta

$trash = @(
    '.next'
    'node_modules'
    'public/public'
    'src/src'
    'web/public/public'
    'web/.next'
    'web/node_modules'
    'content'
    '01-smart-warehouse-AleksandroskoeBOK'
    'web/public/projects'
    '_backup_*'
)
foreach ($t in $trash) { Do-Remove $t }

Get-ChildItem $Root -Filter 'organize-*.log' -File | ForEach-Object {
    Do-Remove $_.Name
}

# --- STEP 2: CREATE STRUCTURE ---
Write-Host "[2/5] Create structure" -ForegroundColor Magenta

$case = '01-smart-warehouse-AleksandroskoeBOK'
$dirs = @(
    "public/projects/$case/assets/optimized"
    "public/projects/$case/assets/screenshots"
    "public/projects/$case/source"
    'web/src/components'
    'web/src/data'
    'web/app'
    'web/public'
    'scripts'
)
foreach ($d in $dirs) { Do-Create $d }

# --- STEP 3: MOVE SCREENSHOTS ---
Write-Host "[3/5] Move screenshots" -ForegroundColor Magenta

$optDst = "public/projects/$case/assets/optimized"
$scrDst = "public/projects/$case/assets/screenshots"
$srcDst = "public/projects/$case/source"

# from root/optimized/ (user saved here)
Do-Copy 'optimized' $optDst '*.webp'
Do-Copy 'optimized' $scrDst '*.png'

# from old case folder (if still exists)
Do-Copy "01-smart-warehouse-AleksandroskoeBOK/assets/optimized" $optDst '*.webp'
Do-Copy "01-smart-warehouse-AleksandroskoeBOK/assets/screenshots" $scrDst '*.png'
Do-Copy "01-smart-warehouse-AleksandroskoeBOK/source" $srcDst '*.*'

# from old public copy
Do-Copy "public/projects/$case/assets/optimized" $optDst '*.webp'
Do-Copy "public/projects/$case/assets/screenshots" $scrDst '*.png'
Do-Copy "public/projects/$case/source" $srcDst '*.*'

# --- STEP 4: CREATE CONFIG FILES ---
Write-Host "[4/5] Create config files" -ForegroundColor Magenta

$meta = @"
{
  "id": "01-smart-warehouse-AleksandroskoeBOK",
  "title": "Smart Warehouse - Aleksandroskoe BOK",
  "description": "Automated warehouse management system",
  "tags": ["EMTP", "warehouse", "automation"],
  "screenshots": [
    "screen-01-main-menu.webp",
    "screen-02-mode.webp",
    "screen-03-settings.webp",
    "screen-04-archive.webp"
  ],
  "sourceFiles": [
    "main_project.emtp",
    "main_project.exob",
    "simulation_tags_AleksBOK.CSV"
  ]
}
"@
Do-WriteFile "public/projects/$case/metadata.json" $meta

$gitignore = @"
# Next.js
.next/
out/
dist/

# Dependencies
node_modules/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Build
*.tsbuildinfo
next-env.d.ts

# Backups
_backup_*/
"@
Do-WriteFile '.gitignore' $gitignore

# --- STEP 5: REMOVE EMPTY OLD FOLDERS ---
Write-Host "[5/5] Remove empty folders" -ForegroundColor Magenta

$emptyCheck = @('optimized', 'public/public', 'src/src', 'content', 'src')
foreach ($e in $emptyCheck) {
    $full = Join-Path $Root $e
    if ((Test-Path $full) -and ((Get-ChildItem $full -Recurse -File | Measure-Object).Count -eq 0)) {
        Do-Remove $e
    }
}

# --- DONE ---
Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "  DONE" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

if (-not $WhatIf) {
    Write-Host "  Final structure:" -ForegroundColor Cyan
    tree (Join-Path $Root 'public') /F
    Write-Host ""
    tree (Join-Path $Root 'web\src') /F
}

Write-Host ""
if ($WhatIf) {
    Write-Host "  Run without -WhatIf to apply changes." -ForegroundColor Yellow
}