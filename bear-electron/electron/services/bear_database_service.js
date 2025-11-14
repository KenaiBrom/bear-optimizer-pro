
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const DB_PATH = path.join(__dirname,'..','..','bear-db','bear.db');
const SCHEMA = path.join(__dirname,'..','..','bear-db','schema.sql');
function ensure(){ const d = path.dirname(DB_PATH); if(!fs.existsSync(d)) fs.mkdirSync(d,{recursive:true}); }
class DB {
  constructor(){ ensure(); this.db = new sqlite3.Database(DB_PATH); try{ const s = fs.readFileSync(SCHEMA,'utf8'); this.db.exec(s); }catch(e){} }
  run(sql, params=[]){ return new Promise((res,rej)=> this.db.run(sql, params, function(err){ if(err) rej(err); else res({lastID:this.lastID}); })); }
  get(sql, params=[]){ return new Promise((res,rej)=> this.db.get(sql, params, (e,r)=> e?rej(e):res(r))); }
  all(sql, params=[]){ return new Promise((res,rej)=> this.db.all(sql, params, (e,r)=> e?rej(e):res(r))); }
}
module.exports = new DB();
