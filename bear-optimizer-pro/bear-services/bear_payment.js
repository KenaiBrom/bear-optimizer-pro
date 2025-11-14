// ========================================
// BEAR OPTIMIZER PRO - PAYMENT SERVICE
// Sistema de Pagamento PIX com Email
// ========================================

const qrcode = require('qrcode');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const db = require('./bear_database_service');

const ADMIN_EMAIL = 'bearservice13@gmail.com';
const PIX_KEY = '54c2671d-d9da-422b-8ba8-cdd35a8af6e0';

// Planos oficiais
const PLANOS = {
  start: {
    id: 'start',
    nome: 'Start',
    preco: 59.90,
    duracao: 30,
    features: { scripts: 15, diagnostico: true, dpiConfig: false, gpuPanel: false }
  },
  gamer: {
    id: 'gamer',
    nome: 'Gamer',
    preco: 79.90,
    duracao: 30,
    features: { scripts: 25, diagnostico: true, dpiConfig: true, gpuPanel: true }
  },
  pro: {
    id: 'pro',
    nome: 'Pro Gamer',
    preco: 99.90,
    duracao: 30,
    features: { scripts: 35, diagnostico: true, dpiConfig: true, gpuPanel: true }
  }
};

class PaymentService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: ADMIN_EMAIL,
        pass: process.env.EMAIL_PASSWORD || 'CONFIGURE_EMAIL_PASSWORD'
      }
    });
  }

  // Gerar código PIX EMV
  gerarPixCopiaECola(valor, descricao) {
    const txid = uuidv4().slice(0, 25);
    return `00020126580014BR.GOV.BCB.PIX0136${PIX_KEY}52040000530398654${(valor.toFixed(2).length + 4)}${valor.toFixed(2)}5802BR5913Bear Optimizer6009SAO PAULO62${(txid.length + 14).toString().padStart(2, '0')}0515${txid}6304`;
  }

  // Gerar QR Code e código PIX
  async gerarPagamento(planoId, email, affiliateCode = null) {
    const plano = PLANOS[planoId];
    if (!plano) throw new Error('Plano inválido');

    const codigo = this.gerarPixCopiaECola(plano.preco, plano.nome);
    const qr = await qrcode.toDataURL(codigo);

    // Criar transação pendente
    const txResult = await db.run(
      `INSERT INTO transactions (email, plan_id, amount, affiliate_code, status, pix_code) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, planoId, plano.preco, affiliateCode, 'pending', codigo]
    );

    return {
      transactionId: txResult.lastID,
      plano: plano.nome,
      valor: plano.preco,
      codigo,
      qr,
      chavePix: PIX_KEY
    };
  }

  // Confirmar pagamento (simulado - integrar webhook real)
  async confirmarPagamento(transactionId, email) {
    const tx = await db.get('SELECT * FROM transactions WHERE id = ?', [transactionId]);
    if (!tx) throw new Error('Transação não encontrada');

    const plano = PLANOS[tx.plan_id];
    
    // Atualizar status
    await db.run(
      'UPDATE transactions SET status = ?, paid_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['paid', transactionId]
    );

    // Criar/atualizar cliente
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    let userId;

    if (!user) {
      const userResult = await db.run(
        'INSERT INTO users (email, name, type, status) VALUES (?, ?, ?, ?)',
        [email, email.split('@')[0], 'client', 'active']
      );
      userId = userResult.lastID;
    } else {
      userId = user.id;
    }

    // Criar registro de cliente
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plano.duracao);
    const licenseKey = this.generateLicenseKey();

    await db.run(
      `INSERT INTO clients (user_id, plan, plan_start_date, plan_end_date, license_key, affiliate_code)
       VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?, ?)`,
      [userId, tx.plan_id, expiresAt.toISOString(), licenseKey, tx.affiliate_code]
    );

    // Registrar venda de afiliado se houver
    if (tx.affiliate_code) {
      const AffiliateService = require('./bear_affiliate_service');
      await AffiliateService.registerSale({
        clientId: userId,
        affiliateCode: tx.affiliate_code,
        plan: tx.plan_id,
        amount: tx.amount,
        paymentMethod: 'pix'
      });
    }

    // Enviar comprovante ao admin
    await this.enviarComprovante(email, plano);

    return {
      success: true,
      licenseKey,
      expiresAt: expiresAt.toISOString()
    };
  }

  // Enviar comprovante ao admin
  async enviarComprovante(clientEmail, plano) {
    const mailOptions = {
      from: `"Bear Optimizer Pro" <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `💰 Novo Pagamento - ${plano.nome}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #6366f1;">🐻 Bear Optimizer Pro</h2>
          <h3>Pagamento Confirmado via PIX</h3>
          <hr/>
          <p><strong>Plano:</strong> ${plano.nome}</p>
          <p><strong>Valor:</strong> R$ ${plano.preco.toFixed(2)}</p>
          <p><strong>Cliente:</strong> ${clientEmail}</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          <hr/>
          <p style="color: #888; font-size: 12px;">
            Comprovante automático gerado pelo sistema Bear Optimizer Pro
          </p>
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Gerar chave de licença
  generateLicenseKey() {
    return 'BEAR-' + uuidv4().toUpperCase().slice(0, 23);
  }

  // Listar planos
  listarPlanos() {
    return Object.values(PLANOS);
  }

  // Processar pagamento com parcelamento (até 4x)
  async processPayment({ userId, planId, cardInfo, parcelas = 1 }) {
    const plano = PLANOS[planId];
    if (!plano) throw new Error('Plano inválido');

    parcelas = Math.min(4, Math.max(1, parcelas));
    const valorParcela = parseFloat((plano.preco / parcelas).toFixed(2));

    // Mock: em produção, integrar com gateway real
    const paymentRef = 'PAY-' + Date.now();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plano.duracao);

    const result = await db.run(
      `INSERT INTO purchases (user_id, plan_id, amount, installments, created_at, expires_at, payment_ref)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)`,
      [userId, planId, plano.preco, parcelas, expiresAt.toISOString(), paymentRef]
    );

    return {
      success: true,
      paymentRef,
      purchaseId: result.lastID,
      amount: plano.preco,
      parcelas,
      valorParcela
    };
  }
}

module.exports = new PaymentService();
