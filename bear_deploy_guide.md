# 🚀 Bear Optimizer Pro - Guia Completo de Deploy

## 📋 Índice
1. [Setup Inicial no GitHub](#1-setup-inicial-no-github)
2. [Configuração de Secrets](#2-configuração-de-secrets)
3. [GitHub Actions (CI/CD)](#3-github-actions-cicd)

---

## 1. Setup Inicial no GitHub

### Passo 1: Criar Repositório
```bash
# Acesse: https://github.com/new
# Nome: bear-optimizer-pro
# Visibilidade: Private (recomendado) ou Public
# ✓ Add README
# ✓ Add .gitignore (Node)
```

### Passo 2: Clonar e Preparar Projeto
```bash
# Clonar repositório
git clone https://github.com/SEU_USUARIO/bear-optimizer-pro.git
cd bear-optimizer-pro

# Criar estrutura de pastas
mkdir -p electron/services electron/preload renderer build data

# Copiar os 5 artifacts principais:
# - electron/services/payment.js
# - electron/main.js
# - renderer/app.js
# - package.json
# - .env (renomear de .env.example)

# Copiar arquivos adicionais dos documentos:
# - electron/services/database.js
# - electron/services/affiliate.js
# - electron/services/config.js
# - electron/preload/preload.js
# - renderer/index.html
# - renderer/styles.css (criar vazio ou usar do bear_html_final.html)
```

### Passo 3: Criar .gitignore
```bash
cat > .gitignore << 'EOF'
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

# Logs
logs/
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Certificates (IMPORTANTE: nunca commitar)
build/*.pfx
build/*.p12
*.pem
*.key

# Temporary
tmp/
temp/
EOF
```

### Passo 4: Primeiro Commit
```bash
git add .
git commit -m "🐻 Initial commit - Bear Optimizer Pro v3.0"
git push origin main
```

---

## 2. Configuração de Secrets

### GitHub Secrets (Obrigatórios)

Acesse: `Settings → Secrets and variables → Actions → New repository secret`

#### **GH_TOKEN** (Obrigatório para releases)
```
Nome: GH_TOKEN
Valor: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
**Como obter:**
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Permissões: `repo` (all), `write:packages`
5. Copiar token gerado

#### **EMAIL_PASSWORD**
```
Nome: EMAIL_PASSWORD
Valor: bear@3131
```

#### **CERT_PASSWORD** (Opcional - para assinatura de código)
```
Nome: CERT_PASSWORD
Valor: sua_senha_do_certificado
```

### Environment Variables (Opcional)

Acesse: `Settings → Environments → New environment`

Criar ambiente: **production**

Adicionar variáveis:
- `BASE_URL`: https://seudominio.com
- `PAYMENT_SERVER_URL`: https://api.seudominio.com
- `STRIPE_SECRET`: sk_live_xxx
- `STRIPE_WEBHOOK_SECRET`: whsec_xxx

---

## 3. GitHub Actions (CI/CD)

### Criar Workflow File

```bash
mkdir -p .github/workflows
```

Criar arquivo `.github/workflows/build-release.yml`:

```yaml
name: Build & Release

on:
  push:
    tags:
      - 'v*.*.*'
  workflow_dispatch:

jobs:
  release:
    runs-on: ${{ matrix.os }}
    
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build app (Windows)
        if: matrix.os == 'windows-latest'
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
          EMAIL_PASSWORD: ${{ secrets.EMAIL_PASSWORD }}
          CERT_PASSWORD: ${{ secrets.CERT_PASSWORD }}
        run: npm run build:win
      
      - name: Build app (macOS)
        if: matrix.os == 'macos-latest'
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
          EMAIL_PASSWORD: ${{ secrets.EMAIL_PASSWORD }}
        run: npm run build:mac
      
      - name: Build app (Linux)
        if: matrix.os == 'ubuntu-latest'
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
          EMAIL_PASSWORD: ${{ secrets.EMAIL_PASSWORD }}
        run: npm run build:linux
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.os }}-build
          path: dist/*
      
      - name: Release
        uses: softprops/action-gh-release@v1
        if: startsWith(github.ref, 'refs/tags/')
        with:
          files: dist/*
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
```

### Commit Workflow
```bash
git add .github/workflows/build-release.yml
git commit -m "🔧 Add GitHub Actions workflow"
git push origin main
```

---

## 🎯 Como Fazer um Release

### Método 1: Via Tag (Automático)
```bash
# Atualizar versão no package.json
npm version patch  # 3.0.0 → 3.0.1
# ou
npm version minor  # 3.0.0 → 3.1.0
# ou
npm version major  # 3.0.0 → 4.0.0

# Push com tags
git push origin main --tags

# GitHub Actions iniciará automaticamente
```

### Método 2: Manual
```bash
# Criar tag
git tag -a v3.0.1 -m "Release v3.0.1"
git push origin v3.0.1

# Ou criar via GitHub UI:
# Releases → Create a new release → Choose tag → Publish
```

### Método 3: Workflow Dispatch
```bash
# GitHub UI:
# Actions → Build & Release → Run workflow → Run
```

---

## 📦 Estrutura de Release

Após build, você terá:

```
dist/
├── Bear Optimizer Pro Setup 3.0.0.exe          # Windows NSIS
├── Bear Optimizer Pro Setup 3.0.0.exe.blockmap
├── Bear Optimizer Pro 3.0.0.dmg                # macOS
├── Bear Optimizer Pro 3.0.0.AppImage           # Linux
├── Bear Optimizer Pro 3.0.0.deb                # Debian/Ubuntu
├── Bear Optimizer Pro 3.0.0.rpm                # RedHat/Fedora
└── latest.yml                                  # Auto-updater metadata
```

---

## 🔒 Assinatura de Código (Opcional)

### Windows (Certificado .pfx)
```bash
# 1. Obter certificado de autoridade certificadora
# 2. Adicionar em build/certificado.pfx
# 3. Adicionar CERT_PASSWORD nos secrets
# 4. Atualizar package.json:

"win": {
  "certificateFile": "build/certificado.pfx",
  "certificatePassword": "${env.CERT_PASSWORD}",
  "signingHashAlgorithms": ["sha256"],
  "sign": "./sign.js"
}
```

### macOS (Apple Developer)
```bash
# Necessário conta Apple Developer ($99/ano)
# Configurar em package.json:

"mac": {
  "identity": "Developer ID Application: SEU NOME (XXXXX)",
  "hardenedRuntime": true,
  "gatekeeperAssess": false,
  "notarize": {
    "teamId": "XXXXX"
  }
}
```

---

## 🧪 Testar Localmente

```bash
# Instalar dependências
npm install

# Testar dev
npm run dev

# Build local
npm run build:win  # Windows
npm run build:mac  # macOS
npm run build:linux  # Linux

# Testar instalador
# Windows: dist/Bear Optimizer Pro Setup 3.0.0.exe
```

---

## 📊 Monitoramento de Releases

### Ver builds em tempo real
```
https://github.com/SEU_USUARIO/bear-optimizer-pro/actions
```

### Ver releases publicadas
```
https://github.com/SEU_USUARIO/bear-optimizer-pro/releases
```

### Estatísticas de download
```
https://github.com/SEU_USUARIO/bear-optimizer-pro/releases/latest
```

---

## 🐛 Troubleshooting

### Erro: "GH_TOKEN not found"
```bash
# Verificar secret no GitHub
# Settings → Secrets → Actions → GH_TOKEN
```

### Erro: "Cannot find module 'sqlite3'"
```bash
# Rebuild native modules
npm rebuild sqlite3 --runtime=electron --target=28.0.0
```

### Erro: Build falha no Windows
```bash
# Instalar Windows Build Tools
npm install --global windows-build-tools
```

### Auto-updater não funciona
```bash
# Verificar:
# 1. GH_TOKEN tem permissão de "repo"
# 2. Release foi publicado (não draft)
# 3. latest.yml existe no release
```

---

## 🎉 Checklist Final

- [ ] Repositório criado no GitHub
- [ ] GH_TOKEN configurado nos Secrets
- [ ] Workflow file criado (`.github/workflows/build-release.yml`)
- [ ] .gitignore configurado
- [ ] Primeiro commit realizado
- [ ] Tag v3.0.0 criada
- [ ] GitHub Actions executado com sucesso
- [ ] Release publicado
- [ ] Instalador testado localmente
- [ ] Auto-updater testado

---

## 📞 Suporte

- Email: bearservice13@gmail.com
- Discord: https://discord.gg/XmQMD6KG
- Issues: https://github.com/SEU_USUARIO/bear-optimizer-pro/issues