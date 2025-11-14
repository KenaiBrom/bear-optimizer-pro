// ========================================
// BEAR OPTIMIZER PRO - MAIN HANDLERS
// Handlers IPC Completos
// ========================================

const { ipcMain } = require('electron');
const PlanosService = require('./bear_payment_service');
const AffiliateService = require('./bear_affiliate_service');
const db = require('./bear_database_service');
const os = require('os');
const fs = require('fs');
const path = require('path');

// ========================================
// PLANOS E PAGAMENTOS
// ========================================

ipcMain.handle('planos:list', async () => {
  try {
    const planos = PlanosService.listarPlanos();
    return { success: true, planos };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('planos:buy', async (_, { userId, planId, cardInfo, parcelas }) => {
  try {
    const pay = await PlanosService.processPayment({ userId, planId, cardInfo, parcelas });
    return { success: true, payment: pay };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('pix:generate', async (_, { planId, email, affiliateCode }) => {
  try {
    const result = await PlanosService.gerarPagamento(planId, email, affiliateCode);
    return { success: true, ...result };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('pix:confirm', async (_, { transactionId, email }) => {
  try {
    const result = await PlanosService.confirmarPagamento(transactionId, email);
    return { success: true, ...result };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// ========================================
// AFILIADOS
// ========================================

ipcMain.handle('affiliate:invite', async (_, { adminEmail, novoEmail, cpf, bankInfo, payout_freq }) => {
  try {
    const res = await AffiliateService.convidarAfiliado(adminEmail, novoEmail, cpf, bankInfo, payout_freq);
    return { success: true, data: res };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('affiliate:login', async (_, { email, password }) => {
  try {
    const res = await AffiliateService.affiliateLogin(email, password);
    return { success: true, data: res };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('affiliate:dashboard', async (_, { email }) => {
  try {
    const res = await AffiliateService.getAffiliateDashboard(email);
    return { success: true, data: res };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('affiliate:register-sale', async (_, saleData) => {
  try {
    const res = await AffiliateService.registerSale(saleData);
    return { success: true, ...res };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Admin overview
ipcMain.handle('admin:affiliates-sales', async (_, { adminEmail }) => {
  try {
    const res = await AffiliateService.adminGetAffiliatesAndSales(adminEmail);
    return { success: true, data: res };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('admin:export-report', async (_, { adminEmail, type }) => {
  try {
    if (adminEmail !== 'bearservice13@gmail.com') {
      throw new Error('Acesso negado');
    }

    let data, filename;
    
    if (type === 'affiliates') {
      const affiliates = await db.all('SELECT * FROM affiliates');
      data = affiliates;
      filename = `affiliates_${Date.now()}.csv`;
    } else if (type === 'sales') {
      const sales = await db.all(`
        SELECT s.*, a.email as affiliate_email, c.email as client_email, p.name as plan_name
        FROM sales s
        LEFT JOIN affiliates a ON s.affiliate_id = a.id
        LEFT JOIN clients cl ON s.client_id = cl.id
        LEFT JOIN users c ON cl.user_id = c.id
        LEFT JOIN plans p ON s.plan = p.id
      `);
      data = sales;
      filename = `sales_${Date.now()}.csv`;
    }

    // Gerar CSV
    const csv = generateCSV(data);
    const filepath = path.join(os.tmpdir(), filename);
    fs.writeFileSync(filepath, csv);

    return { success: true, filepath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// ========================================
// PERFIS GPU
// ========================================

ipcMain.handle('gpu:export-profile', async (_, { type, profile }) => {
  try {
    const regContent = generateGPURegFile(type, profile);
    const filename = `${type}_${profile}_${Date.now()}.reg`;
    const filepath = path.join(os.tmpdir(), filename);
    
    fs.writeFileSync(filepath, regContent, 'utf16le');
    
    return { success: true, filepath, filename };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// ========================================
// SISTEMA
// ========================================

ipcMain.handle('system:info', async () => {
  try {
    return {
      success: true,
      platform: os.platform(),
      cpus: os.cpus()[0].model,
      totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      freeMemory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      uptime: `${(os.uptime() / 3600).toFixed(2)} horas`
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('system:backup', async () => {
  try {
    const backupPath = await db.backup();
    return { success: true, backupPath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('system:discord', async () => ({
  success: true,
  link: 'https://discord.gg/XmQMD6KG'
}));

ipcMain.handle('system:support', async () => ({
  success: true,
  email: 'bearservice13@gmail.com',
  discord: 'https://discord.gg/XmQMD6KG',
  hours: '9h-19h (Segunda a Sábado)'
}));

// ========================================
// UTILS
// ========================================

function generateCSV(data) {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const rows = data.map(row => 
    headers.map(h => {
      const val = row[h];
      return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
    }).join(',')
  );
  
  return [headers.join(','), ...rows].join('\n');
}

function generateGPURegFile(type, profile) {
  const configs = {
    nvidia: {
      gaming: `Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\\Software\\NVIDIA Corporation\\Global\\NVTweak]
"Lodlevel"=dword:00000000
"PerfLevelSrc"=dword:00003322
"PowerMizerEnable"=dword:00000001
"PowerMizerLevel"=dword:00000001

[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers]
"HwSchMode"=dword:00000002
"TdrDelay"=dword:0000003c`,
      
      work: `Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\\Software\\NVIDIA Corporation\\Global\\NVTweak]
"PowerMizerEnable"=dword:00000001
"PowerMizerLevel"=dword:00000002`
    },
    amd: {
      gaming: `Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\0000]
"KMD_EnableComputePreemption"=dword:00000000
"PP_ThermalAutoThrottlingEnable"=dword:00000000`,
      
      work: `Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\0000]
"PP_ThermalAutoThrottlingEnable"=dword:00000001`
    }
  };

  return configs[type]?.[profile] || '';
}

module.exports = {
  // Export para uso em outros módulos se necessário
};
