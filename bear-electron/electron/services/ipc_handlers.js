
const { ipcMain } = require('electron');
const planos = require('./bear_planos_service');
const pix = require('./bear_pix_service');
const affiliates = require('./bear_affiliate_service');

ipcMain.handle('planos:list', async ()=> ({ success:true, planos: await planos.listarPlanos() }));
ipcMain.handle('pix:gerar', async (_,payload)=> { return await pix.gerarQrCodePix(payload.planoId, payload.email); });
ipcMain.handle('pix:confirmar', async (_,payload)=> { return await pix.confirmarPagamento(payload.email, payload.planoId); });
ipcMain.handle('affiliate:invite', async (_,p)=> { try { const r = await affiliates.inviteAffiliate(p.adminEmail,p.email,p.cpf,p.bankInfo,p.payout_freq); return { success:true, data:r }; } catch(e){ return { success:false, error:e.message }; } });
ipcMain.handle('affiliate:login', async (_,p)=> { try { const r = await affiliates.affiliateLogin(p.email,p.password); return { success:true, data:r }; } catch(e){ return { success:false, error:e.message }; } });
ipcMain.handle('admin:overview', async (_,p)=> { try { const r = await affiliates.adminOverview(p.adminEmail); return { success:true, data:r }; } catch(e){ return { success:false, error:e.message }; } });
