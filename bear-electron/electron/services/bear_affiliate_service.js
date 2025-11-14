
const db = require('./bear_database_service');
const ADMIN = 'bearservice13@gmail.com';
const AFF_LIMIT = 50;
function genCode(){ return 'AFF' + Date.now().toString().slice(-6); }
module.exports = {
  inviteAffiliate: async (adminEmail,newEmail,cpf,bank,payout='weekly')=>{
    if(adminEmail !== ADMIN) throw new Error('Somente admin pode convidar');
    const row = await db.get('SELECT COUNT(*) as c FROM affiliates').catch(()=> ({c:0}));
    const count = row?row.c:0;
    if(count >= AFF_LIMIT) throw new Error('Limite de afiliados atingido');
    const code = genCode();
    await db.run('INSERT INTO affiliates (email,codigo,payout_freq,bank_info,cpf,invited_by) VALUES (?,?,?,?,?,?)', [newEmail,code,payout,bank||'',cpf||'',adminEmail]);
    return { email:newEmail, codigo:code };
  },
  affiliateLogin: async (email,password)=> { return { ok:true, email }; },
  adminOverview: async (adminEmail)=> {
    if(adminEmail !== ADMIN) throw new Error('Acesso negado');
    const affiliates = await db.all('SELECT * FROM affiliates');
    const sales = await db.all('SELECT * FROM sales');
    return { affiliates, sales };
  }
};
