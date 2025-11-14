# Dependencies
node_modules/
package-lock.json

# Environment
.env
.env.local
.env.*.local

# Build outputs
dist/
release/
out/

# Database
data/*.db
data/*.db-journal
data/*.db-wal

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
desktop.ini

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.project
.classpath
.settings/

# Certificates (NUNCA COMMITAR)
build/*.pfx
build/*.p12
*.pem
*.key
*.crt
*.cer

# Temporary
tmp/
temp/
*.tmp

# Test coverage
coverage/
.nyc_output/

# Electron
.webpack/
.electron/

# macOS
.AppleDouble
.LSOverride
Icon

# Windows
*.lnk
$RECYCLE.BIN/

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Misc
.cache
*.bak
*.backup