# RemitFlow Vercel deploy — run once: npx vercel login
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

if (-not (Test-Path ".env.local")) {
  Write-Error ".env.local missing. Copy from .env.example and fill values."
}

Write-Host "1. Run: npx vercel login (if not logged in)"
Write-Host "2. Import https://github.com/ankushn22/remitflow in Vercel dashboard"
Write-Host "   OR run: npx vercel link --yes && npx vercel deploy --prod --yes"
Write-Host "3. Add env vars in Vercel > Settings > Environment Variables:"
Get-Content .env.local | Where-Object { $_ -notmatch '^\s*#' -and $_ -match '=' }