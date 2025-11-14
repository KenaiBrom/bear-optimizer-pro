
const express = require('express');
const router = express.Router();
const licenses = {}; // simple in-memory demo

router.post('/generate', (req,res)=>{
  const {email, plan} = req.body;
  const key = 'LIC-' + Date.now().toString(36) + Math.random().toString(36).slice(2,8).toUpperCase();
  licenses[key] = { email, plan, hwid:null, active:true, created: Date.now() };
  res.json({ ok:true, key });
});

router.post('/validate', (req,res)=>{
  const { key, hwid } = req.body;
  const L = licenses[key];
  if(!L) return res.json({ ok:false, error:'Invalid license' });
  if(!L.active) return res.json({ ok:false, error:'Inactive' });
  if(L.hwid && L.hwid !== hwid) return res.json({ ok:false, error:'HWID mismatch' });
  L.hwid = hwid;
  res.json({ ok:true, email:L.email, plan:L.plan });
});

module.exports = router;
