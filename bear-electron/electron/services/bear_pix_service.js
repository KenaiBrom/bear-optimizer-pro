
const qrcode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const CHAVE = process.env.PIX_KEY || '54c2671d-d9da-422b-8ba8-cdd35a8af6e0';
const PLANOS = { start:{id:'start',nome:'Start',preco:59.90}, gamer:{id:'gamer',nome:'Gamer',preco:79.90}, progamer:{id:'progamer',nome:'Pro Gamer',preco:149.90} };
function gerarPixCopiaECola(valor){ return '000201' + uuidv4().slice(0,12); }
async function gerarQrCodePix(planoId,email){
  const plano = PLANOS[planoId] || PLANOS.start;
  const codigo = gerarPixCopiaECola(plano.preco);
  const qr = await qrcode.toDataURL(codigo);
  return { codigo, qr, preco: plano.preco, plano: plano.nome };
}
async function confirmarPagamento(email,planoId){
  // simulated confirmation - in production use payment webhook
  await new Promise(r=>setTimeout(r,1200));
  return { success:true, plano:planoId, purchaser: email, date: new Date().toISOString() };
}
module.exports = { gerarQrCodePix, confirmarPagamento, PLANOS };
