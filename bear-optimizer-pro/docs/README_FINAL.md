# 🐻 Bear Optimizer Pro v3.0

Sistema completo de otimização para Windows com pagamento via PIX, sistema de afiliados integrado e auto-updater.

## ✨ Funcionalidades

### 💳 Sistema de Pagamento
- **PIX Automático:** Geração de QR Code e código copia-e-cola
- **Parcelamento:** Até 4x no cartão
- **Comprovante:** Email automático ao admin
- **Validação:** Sistema de licenças com expiração

### 👥 Sistema de Afiliados
- **20% de comissão** em todas as vendas
- **Limite:** 50 afiliados (expansível)
- **Pagamento:** Semanal ou quinzenal (escolha do afiliado)
- **Dashboard:** Vendas por plano, comissões, histórico
- **Admin:** Visualização completa de vendas e afiliados
- **Relatórios:** Export CSV/PDF

### 📦 Planos Disponíveis

| Plano | Preço | Scripts | Recursos |
|-------|-------|---------|----------|
| **Start** | R$ 59,90/mês | 15 | Diagnóstico + Limpeza básica |
| **Gamer** | R$ 79,90/mês | 25 | Start + DPI Config + GPU Panel |
| **Pro** | R$ 99,90/mês | 35 | Tudo + Scripts PRO + Bottleneck |

### 🎮 Perfis GPU
- **NVIDIA:** Gaming e Trabalho
- **AMD:** Gaming e Trabalho
- **Export:** Arquivos .reg prontos para aplicar

### 🌗 Tema Automático
- Detecta horário do sistema
- 6h-18h: Modo claro
- 18h-6h: Modo escuro
- Alternância manual disponível

### 🔄 Auto-Update
- Atualização automática via GitHub Releases
- Notificação ao usuário
- Download e instalação com um clique

## 🚀 Instalação Rápida

### Pré-requisitos
- Windows 10/11 (64-bit)
- Node.js 18+
- Privilégios de administrador

### Passos

```bash
# 1. Clonar projeto
git clone https://github.com/SEU_USUARIO/bear-optimizer-pro.git
cd bear-optimizer-pro

# 2. Instalar dependências
npm install

# 3. Configurar .env
cp .env.example .env
# Editar .env com EMAIL_PASSWORD

# 4. Testar
npm run dev

# 5. Build
npm run build:win
```

## 📁 Estrutura do Projeto

```
bear-optimizer-pro/
├── electron/
│   ├── main.js                    # Processo principal
│   ├── preload/
│   │   └── bear_preload.js        # Bridge segura
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
├── .github/
│   └── workflows/
│       └── build-release.yml
└── data/                          # Auto-criado
    └── bear.db
```

## 🔑 Configuração

### Variáveis de Ambiente (.env)

```env
NODE_ENV=production
EMAIL_PASSWORD=sua_senha_app_gmail
```

**Obter senha Gmail:**
1. Acesse https://myaccount.google.com/apppasswords
2. Crie senha para "Bear Optimizer"
3. Cole no `.env`

### Credenciais Padrão

- **Admin Email:** bearservice13@gmail.com
- **Admin Senha:** bear@3131
- **PIX:** 54c2671d-d9da-422b-8ba8-cdd35a8af6e0
- **Discord:** https://discord.gg/XmQMD6KG

## 🔨 Build e Deploy

### Build Local

```bash
npm run build:win
```

Resultado em `dist/`:
- `BearOptimizerPro-Setup-3.0.0.exe`
- `BearOptimizerPro-Installer-3.0.0.msi`

### Build via GitHub Actions

1. Configure `GH_TOKEN` nos secrets
2. Crie tag de versão:

```bash
git tag v3.0.0
git push origin v3.0.0
```

3. GitHub Actions faz build automaticamente

### Assinatura Digital (Recomendado)

```bash
# 1. Coloque certificado em build/certificado.pfx
# 2. Configure no .env:
CSC_LINK=build/certificado.pfx
CSC_KEY_PASSWORD=senha_certificado

# 3. Build com assinatura
npm run build:win
```

## 📊 Sistema de Afiliados

### Convidar Afiliado (Admin)

```javascript
await window.bearAPI.affiliate.invite({
  adminEmail: 'bearservice13@gmail.com',
  novoEmail: 'afiliado@example.com',
  cpf: '12345678900',
  bankInfo: 'Banco: 001, Ag: 1234, Conta: 56789',
  payout_freq: 'weekly' // ou 'biweekly'
});
```

### Dashboard Afiliado

```javascript
const data = await window.bearAPI.affiliate.dashboard({
  email: 'afiliado@example.com'
});
// Retorna: vendas, comissões, planos vendidos
```

### Pagamentos Semanais

Rodado automaticamente toda segunda-feira às 10h ou manualmente:

```javascript
await window.bearAPI.affiliate.processPayments();
```

## 🎨 Perfis GPU

### Aplicar Perfil

```javascript
// No renderer
await window.bearAPI.gpu.applyProfile('nvidia', 'gaming');
```

### Exportar como .reg

```javascript
const result = await window.bearAPI.gpu.exportProfile('nvidia', 'gaming');
// result.filepath = C:\Temp\nvidia_gaming_123456789.reg
```

## 📱 Suporte e Contato

- **Email:** bearservice13@gmail.com
- **Discord:** https://discord.gg/XmQMD6KG  
- **PIX:** 54c2671d-d9da-422b-8ba8-cdd35a8af6e0
- **Horário:** 9h-19h (Segunda a Sábado)

## 🐛 Troubleshooting

### Erro sqlite3

```bash
npm rebuild sqlite3 --runtime=electron --target=28.0.0
```

### SmartScreen bloqueia

- Assinar digitalmente ou
- "Mais informações" → "Executar mesmo assim"

### Scripts não executam

- Executar como administrador
- Verificar antivírus

## 📝 Checklist de Deploy

- [ ] .env configurado
- [ ] Ícone em build/icon.ico
- [ ] Certificado (opcional)
- [ ] electron-builder.json com owner/repo corretos
- [ ] Teste em VM Windows 10/11
- [ ] GitHub Release configurado
- [ ] Auto-updater testado

## 🎯 Roadmap

- [ ] Integração Mercado Pago/Stripe real
- [ ] Sistema de tickets
- [ ] Analytics de uso
- [ ] Dashboard web
- [ ] Mobile app (companion)

## 📄 Licença

MIT License - Ver LICENSE.txt

---

**Desenvolvido com 🐻 por Bear Service**

*Bear Optimizer Pro - Máxima Performance para Windows*
