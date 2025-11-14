
const db = require('./bear_database_service');
async function listarPlanos(){
  try { return await db.all('SELECT id, name as nome, price as preco FROM plans'); }
  catch(e){ return [{id:'start',nome:'Start',preco:59.9},{id:'gamer',nome:'Gamer',preco:79.9},{id:'progamer',nome:'Pro Gamer',preco:99.9}]; }
}
module.exports = { listarPlanos };
