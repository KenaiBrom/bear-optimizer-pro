
(async function(){
  const res = await window.bearAPI.pixListPlanos();
  const c = document.getElementById('plans');
  if(!res.success) { c.innerText = 'Erro'; return; }
  res.planos.forEach(p => {
    const d = document.createElement('div');
    d.innerHTML = `<h3>${p.nome} - R$ ${p.preco}</h3><button data-id="${p.id}">Comprar</button>`;
    c.appendChild(d);
  });
  c.querySelectorAll('button').forEach(btn=> btn.onclick = async (e)=> {
    const id = e.target.dataset.id;
    const email = prompt('Email:'); if(!email) return;
    const g = await window.bearAPI.pixGerar({planoId:id, email});
    alert('PIX gerado (simulado). Codigo: ' + g.codigo);
    const conf = confirm('Simular confirmação?');
    if(conf){ const r = await window.bearAPI.pixConfirmar({planoId:id, email}); alert('Pagamento confirmado: ' + JSON.stringify(r)); }
  });
})();
