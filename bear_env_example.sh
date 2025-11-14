# ==========================================
# Bear Optimizer Pro v3.0 - Configurações
# ==========================================

# ============================================
# EMAIL (Obrigatório para envio de licenças)
# ============================================
# Senha de aplicativo do Gmail
# Tutorial: https://support.google.com/accounts/answer/185833
EMAIL_PASSWORD=sua_senha_app_gmail_aqui

# ============================================
# SERVIDOR DE PAGAMENTOS (Opcional)
# ============================================
# URL do servidor de pagamentos (se estiver usando servidor externo)
# Deixe em branco para usar localhost
PAYMENT_SERVER_URL=http://localhost:4000

# ============================================
# STRIPE (Opcional - para pagamentos internacionais)
# ============================================
# Chave secreta do Stripe
# Obtenha em: https://dashboard.stripe.com/apikeys
STRIPE_SECRET=sk_test_seu_stripe_secret_key_aqui

# Webhook secret do Stripe
# Obtenha ao criar webhook em: https://dashboard.stripe.com/webhooks
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret_aqui

# ============================================
# HOTMART (Opcional - se usar Hotmart)
# ============================================
# Token de API do Hotmart
HOTMART_TOKEN=seu_hotmart_token_aqui

# Webhook secret do Hotmart
HOTMART_WEBHOOK_SECRET=seu_hotmart_webhook_secret_aqui

# ============================================
# CERTIFICADO DE ASSINATURA (Opcional)
# ============================================
# Senha do certificado .pfx para assinatura de código
# Necessário apenas para builds em produção
CERT_PASSWORD=senha_do_certificado_pfx

# Caminho do certificado (Windows)
# CERT_PATH=build/certificado.pfx

# ============================================
# AUTO-UPDATER (Opcional)
# ============================================
# Token do GitHub para releases privadas
# GH_TOKEN=seu_github_token_aqui

# ============================================
# AMBIENTE
# ============================================
# Ambiente de execução (development ou production)
NODE_ENV=development

# URL base da aplicação
BASE_URL=https://seudominio.com

# ============================================
# PIX (Configuração padrão)
# ============================================
# Chave PIX para recebimento
PIX_KEY=54c2671d-d9da-422b-8ba8-cdd35a8af6e0

# Nome do recebedor PIX
PIX_NAME=Bear Optimizer

# Cidade do recebedor PIX
PIX_CITY=Brasilia

# ============================================
# DATABASE (SQLite - auto-configurado)
# ============================================
# Caminho do banco de dados (auto-criado)
# DB_PATH=data/bear.db

# ============================================
# LOGS
# ============================================
# Nível de log (silly, debug, verbose, info, warn, error)
LOG_LEVEL=info

# Diretório de logs
# LOG_DIR=logs

# ============================================
# SEGURANÇA
# ============================================
# Chave secreta para JWT (se implementar)
# JWT_SECRET=sua_chave_secreta_jwt_aqui

# Salt rounds para bcrypt
# BCRYPT_ROUNDS=10

# ============================================
# AFILIADOS
# ============================================
# Limite de afiliados permitidos
AFFILIATE_LIMIT=50

# Taxa de comissão (%)
AFFILIATE_COMMISSION_RATE=20

# Frequência de pagamento (weekly, biweekly, monthly)
AFFILIATE_PAYOUT_FREQUENCY=weekly

# ============================================
# DISCORD
# ============================================
# Link do servidor Discord
DISCORD_URL=https://discord.gg/XmQMD6KG

# Webhook do Discord para notificações (opcional)
# DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# ============================================
# RECURSOS PREMIUM
# ============================================
# Ativar recursos experimentais
ENABLE_EXPERIMENTAL_FEATURES=false

# Ativar telemetria anônima
ENABLE_TELEMETRY=false

# ============================================
# NOTAS DE CONFIGURAÇÃO
# ============================================
# 
# 1. Copie este arquivo para .env e preencha os valores
# 2. EMAIL_PASSWORD é obrigatório para envio de licenças
# 3. Variáveis opcionais podem ser deixadas em branco
# 4. Nunca commite o arquivo .env no Git
# 5. Use .env.example como template
# 
# Para obter senha de app do Gmail:
# 1. Acesse https://myaccount.google.com/security
# 2. Ative verificação em 2 etapas
# 3. Vá em "Senhas de app"
# 4. Gere uma senha para "Email"
# 5. Cole a senha em EMAIL_PASSWORD
# 
# ============================================
