param(
  [Parameter(Mandatory=$true)][string]$Source,
  [Parameter(Mandatory=$true)][string]$Destination,
  [switch]$Expand
)
$ErrorActionPreference = 'Stop'
if (Test-Path -LiteralPath $Destination) { throw 'Archive destination already exists.' }
if ($Expand) {
  Expand-Archive -LiteralPath $Source -DestinationPath $Destination
} else {
  $items = @(Get-ChildItem -LiteralPath $Source)
  if ($items.Count -eq 0) { throw 'Archive source is empty.' }
  Compress-Archive -LiteralPath $items.FullName -DestinationPath $Destination -CompressionLevel Optimal
}
if (-not (Test-Path -LiteralPath $Destination)) { throw 'Archive operation fails.' }
