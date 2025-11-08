# Canto Images Organizer Script
# This script helps you organize your downloaded Pinterest images

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Canto Images Organizer" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Define paths
$sourceFolder = Read-Host "Enter the folder path where you downloaded the images (e.g., C:\Users\141dh\Downloads)"
$destinationFolder = "c:\Users\141dh\Downloads\code\public\images\cantos"

# Check if source folder exists
if (-not (Test-Path $sourceFolder)) {
    Write-Host "Error: Source folder not found!" -ForegroundColor Red
    exit
}

# Create destination folder if it doesn't exist
if (-not (Test-Path $destinationFolder)) {
    New-Item -ItemType Directory -Path $destinationFolder -Force | Out-Null
    Write-Host "Created destination folder: $destinationFolder" -ForegroundColor Green
}

Write-Host ""
Write-Host "Looking for images in: $sourceFolder" -ForegroundColor Yellow
Write-Host ""

# Get all image files from source folder
$images = Get-ChildItem -Path $sourceFolder -Include *.jpg,*.jpeg,*.png,*.webp -File | Sort-Object LastWriteTime -Descending

if ($images.Count -eq 0) {
    Write-Host "No images found in the source folder!" -ForegroundColor Red
    exit
}

Write-Host "Found $($images.Count) images" -ForegroundColor Green
Write-Host ""
Write-Host "Please identify which image corresponds to which canto:" -ForegroundColor Yellow
Write-Host ""

# Canto information
$cantos = @(
    @{Number=1; Title="Creation and Cosmology"},
    @{Number=2; Title="The Cosmic Manifestation"},
    @{Number=3; Title="The Status Quo"},
    @{Number=4; Title="The Creation of the Fourth Order"},
    @{Number=5; Title="The Predominator of the Fruitive Results"},
    @{Number=6; Title="Prescribed Duties for Mankind"},
    @{Number=7; Title="The Science of God Realization"},
    @{Number=8; Title="Withdrawal of the Cosmic Creations"},
    @{Number=9; Title="Liberation"},
    @{Number=10; Title="The Pastimes of Lord Krishna"},
    @{Number=11; Title="The General History"},
    @{Number=12; Title="The Age of Deterioration"}
)

# Show available images
Write-Host "Available images:" -ForegroundColor Cyan
for ($i = 0; $i -lt [Math]::Min($images.Count, 20); $i++) {
    Write-Host "  [$($i+1)] $($images[$i].Name)" -ForegroundColor White
}
Write-Host ""

# Manual mapping mode
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Manual Mapping Mode" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$mappings = @{}

foreach ($canto in $cantos) {
    Write-Host "Canto $($canto.Number): $($canto.Title)" -ForegroundColor Yellow
    $imageNumber = Read-Host "Enter image number (1-$($images.Count)) or press Enter to skip"
    
    if ($imageNumber -and $imageNumber -match '^\d+$' -and [int]$imageNumber -le $images.Count) {
        $mappings[$canto.Number] = $images[[int]$imageNumber - 1]
        Write-Host "  -> Mapped to: $($images[[int]$imageNumber - 1].Name)" -ForegroundColor Green
    } else {
        Write-Host "  -> Skipped" -ForegroundColor Gray
    }
    Write-Host ""
}

# Confirm and copy
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

if ($mappings.Count -eq 0) {
    Write-Host "No mappings created. Exiting." -ForegroundColor Red
    exit
}

foreach ($cantoNum in $mappings.Keys | Sort-Object) {
    $sourceFile = $mappings[$cantoNum]
    Write-Host "Canto $cantoNum -> $($sourceFile.Name)" -ForegroundColor White
}

Write-Host ""
$confirm = Read-Host "Copy these files? (Y/N)"

if ($confirm -eq 'Y' -or $confirm -eq 'y') {
    foreach ($cantoNum in $mappings.Keys) {
        $sourceFile = $mappings[$cantoNum]
        $destFile = Join-Path $destinationFolder "canto-$cantoNum.jpg"
        
        Copy-Item -Path $sourceFile.FullName -Destination $destFile -Force
        Write-Host "Copied: canto-$cantoNum.jpg" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "Done! All images copied successfully!" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Images saved to: $destinationFolder" -ForegroundColor Yellow
    Write-Host "Refresh your browser to see the images!" -ForegroundColor Yellow
} else {
    Write-Host "Operation cancelled." -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to exit"
