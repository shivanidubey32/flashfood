Write-Host "Starting FlashFood Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit -Command `"cd backend; npm run dev`""

Write-Host "Starting FlashFood Frontend..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit -Command `"cd frontend; npm run dev`""

Write-Host "Both services are starting in separate windows!" -ForegroundColor Yellow
