# RemitFlow Supabase setup (run after: npx supabase login)
param(
  [string]$ProjectName = "remitflow",
  [string]$DbPassword = "RemitFlow2026!Secure"
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "Creating Supabase project: $ProjectName"
npx supabase@latest projects create $ProjectName --db-password $DbPassword --region ap-south-1

Write-Host "Linking project..."
npx supabase@latest link --project-ref (npx supabase@latest projects list -o json | ConvertFrom-Json | Where-Object { $_.name -eq $ProjectName } | Select-Object -ExpandProperty id)

Write-Host "Pushing database migrations..."
npx supabase@latest db push

$ref = (Get-Content supabase\.temp\project-ref -ErrorAction SilentlyContinue)
if (-not $ref) {
  Write-Host "Get project ref from: https://supabase.com/dashboard"
  exit 1
}

Write-Host ""
Write-Host "Add these to .env.local and Vercel:"
Write-Host "NEXT_PUBLIC_SUPABASE_URL=https://$ref.supabase.co"
Write-Host "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon key from Settings > API>"
Write-Host "SUPABASE_SERVICE_ROLE_KEY=<service_role key from Settings > API>"