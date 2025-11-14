
const express = require('express');
const bodyParser = require('body-parser');
const license = require('./license');
const app = express();
app.use(bodyParser.json());

app.get('/health', (req,res)=> res.json({ok:true}));
app.use('/license', license);

// simple admin overview (demo)
app.get('/admin/overview', (req,res)=> res.json({ok:true, admin: 'bearservice13@gmail.com'}));

app.listen(3001, ()=> console.log('Backend listening on 3001'));
