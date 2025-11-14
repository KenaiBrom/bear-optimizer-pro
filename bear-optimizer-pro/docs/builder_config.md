# 🐻 Bear Optimizer Pro - Guia de Build e Deploy

## 📦 Estrutura Final do Projeto

```
bear-optimizer-pro/
├── package.json
├── .env
├── .gitignore
├── electron/
│   ├── main.js
│   ├── preload/
│   │   └── bear_preload.js
│   └── services/
│       ├── bear_database_service.js
│       ├── bear_payment_service.js
│       ├── bear_affiliate_service.js
│       ├── bear_main_handlers.js
│       └── schema.sql
├── renderer/
│   ├── index.html
│   └── app.js
├── build/
│   ├── icon.ico
│   └── certificado.pfx (opcional)
└── data/ (auto-criado)
    └── bear.db
```

## 🚀 Instalação e Setup

### 1. Requisitos
- **Windows 10/11** (64-bit)
- **Node.js 18+**
- **PowerShell** como administrador

### 2. Instalar Dependências

```bash
cd bear-optimizer-pro
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie arquivo `.env` na raiz:

```env
NODE_ENV=production
EMAIL_PASSWORD=sua_senha_app_gmail
```

**Importante:** Use senha de aplicativo do Gmail (não a senha normal)
- Acesse: https://myaccount.google.com/apppasswords
- Gere uma senha para "Bear Optimizer"

## 🔨 Build do Instalador

### Opção 1: Build Local (Windows)

```bash
npm run build:win
```

Resultado em `dist/`:
- `BearOptimizerPro-Setup-3.0.0.exe` (NSIS)
- `BearOptimizerPro-Installer-3.0.0.msi` (MSI)

### Opção 2: Build via GitHub Actions

1. Crie repositório no GitHub
2. Configure secrets:
   - `GH_TOKEN` (Personal Access Token com permissão `repo`)
3. Crie tag de versão:

```bash
git tag v3.0.0
git push origin v3.0.0
```

4. O GitHub Actions fará build automaticamente

## 🔐 Assinatura Digital (Recomendado)

### Por que assinar?
- Evita alertas do SmartScreen
- Aumenta confiança do usuário
- Reduz falsos positivos de antivírus

### Como assinar

1. Adquira certificado code signing (.pfx)
2. Coloque em `build/certificado.pfx`
3. Configure senha no `.env`:

```env
CSC_LINK=build/certificado.pfx
CSC_KEY_PASSWORD=senha_do_certificado
```

4. Build assinado automaticamente

### Fornecedores de Certificados
- **SSL.com** (~$200/ano)
- **DigiCert** (~$500/ano)  
- **Sectigo** (~$300/ano)

## 📋 electron-builder.json

```json
{
  "appId": "com.bearoptimizer.pro",
  "productName": "Bear Optimizer Pro",
  "copyright": "© 2025 Bear Service",
  "directories": {
    "output": "dist",
    "buildResources": "build"
  },
  "files": [
    "electron/**/*",
    "renderer/**/*",
    "package.json",
    "node_modules/**/*"
  ],
  "win": {
    "target": ["nsis", "msi"],
    "icon": "build/icon.ico",
    "requestedExecutionLevel": "requireAdministrator",
    "publisherName": "Bear Service"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true,
    "shortcutName": "Bear Optimizer Pro"
  },
  "publish": {
    "provider": "github",
    "owner": "SEU_USUARIO",
    "repo": "bear-optimizer-pro"
  }
}
```

## 🔄 Auto-Update

Sistema configurado para atualização automática via GitHub Releases.

### Publicar Nova Versão

1. Atualizar `version` no `package.json`:
```json
{
  "version": "3.0.1"
}
```

2. Commit e criar tag:
```bash
git add package.json
git commit -m "v3.0.1"
git tag v3.0.1
git push origin main --tags
```

3. GitHub Actions faz build e publica release

4. Usuários receberão notificação de atualização

## 🎨 Tema Automático

Sistema detecta horário e aplica tema:
- **6h-18h:** Modo claro
- **18h-6h:** Modo escuro

Configurado em `renderer/app.js`.

## 📊 Exportar Relatórios (Admin)

Admin pode exportar:
- **CSV de afiliados:** Lista completa com vendas/comissões
- **CSV de vendas:** Todas transações do sistema
- **Perfis GPU .reg:** Arquivos prontos para aplicar

## 🐛 Troubleshooting

### Erro: "Cannot find module 'sqlite3'"

```bash
npm rebuild sqlite3 --runtime=electron --target=28.0.0 --abi=116
```

### Erro: "GH_TOKEN not found"

Configure secret no GitHub: Settings → Secrets → Actions

### SmartScreen bloqueia instalador

Opções:
1. Assinar digitalmente (recomendado)
2. Distribuir por tempo até reputação aumentar
3. Instruir usuários: "Mais informações" → "Executar mesmo assim"

### Scripts não executam

- Verificar privilégios de administrador
- Revisar antivírus (adicionar exceção)

## 📱 Contato e Suporte

- **Email:** bearservice13@gmail.com
- **Discord:** https://discord.gg/XmQMD6KG
- **PIX:** 54c2671d-d9da-422b-8ba8-cdd35a8af6e0
- **Horário:** 9h-19h (Segunda a Sábado)

## ✅ Checklist de Deploy

- [ ] `.env` configurado com EMAIL_PASSWORD
- [ ] Ícone em `build/icon.ico`
- [ ] Certificado configurado (opcional)
- [ ] `electron-builder.json` com owner/repo corretos
- [ ] Teste em VM Windows 10/11
- [ ] Assinatura digital (recomendado)
- [ ] GitHub Release configurado
- [ ] Auto-updater testado

## 🎯 Próximos Passos

1. **Marketing:** Site, landing page, vídeos
2. **Pagamento Real:** Integrar Mercado Pago/Stripe
3. **Analytics:** Rastrear uso e performance
4. **Suporte:** Sistema de tickets
5. **Comunidade:** Discord ativo

---

**Desenvolvido com 🐻 por Bear Service**
