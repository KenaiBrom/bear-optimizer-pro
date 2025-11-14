
$ErrorActionPreference = "Stop"
Write-Host "Run publish_to_github.bat after setting $env:GITHUB_TOKEN"
Start-Process -FilePath ".\publish_to_github.bat" -Wait -NoNewWindow
Write-Host "Publish script completed."
