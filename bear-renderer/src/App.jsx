
import React, {useEffect, useState} from 'react';
export default function App(){
  const [plans,setPlans] = useState([]);
  useEffect(()=>{ 
    (async ()=>{
      const res = window.bearAPI ? await window.bearAPI.planosList() : { success:true, planos:[{id:'start',nome:'Start',preco:59.9},{id:'gamer',nome:'Gamer',preco:79.9},{id:'progamer',nome:'Pro Gamer',preco:149.9}] };
      setPlans(res.planos || []);
    })();
  },[]);
  return (<div style={{padding:20,fontFamily:'Arial,Helvetica,sans-serif'}}>
    <h1>Bear Optimizer Pro</h1>
    <p>Escolha um plano:</p>
    <div>{plans.map(p=> <div key={p.id} style={{marginBottom:8,padding:8,border:'1px solid #eee'}}><strong>{p.nome}</strong> — R$ {p.preco} <button onClick={()=>alert('Fluxo de compra demo')}>Comprar</button></div>)}</div>
  </div>);
}
