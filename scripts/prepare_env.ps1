
Write-Host "Checking environment..."
node -v
npm -v
where makensis || echo "NSIS not found in PATH"
where git || echo "Git not found in PATH"
where gh || echo "GitHub CLI not found in PATH"
