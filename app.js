/* Oshurn Workspace — client-side product foundation. */
(function(){
  const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(n)||0);
  const $=s=>document.querySelector(s);
  const setStore=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
  const getStore=(k,d=null)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
  document.querySelectorAll('[data-tool]').forEach(card=>card.addEventListener('click',()=>{
    const tool=card.dataset.tool;
    const targets={budget:'tools.html#budget',debt:'tools.html#debt',emergency:'tools.html#emergency',savings:'tools.html#emergency',networth:'tools.html#networth'};
    if(targets[tool]) window.location.href=targets[tool];
  }));
  const search=$('#workspace-search'),panel=$('#search-panel');
  const results=[['Budget Planner','tools.html#budget'],['Debt Payoff Explorer','tools.html#debt'],['Emergency Fund','tools.html#emergency'],['Net Worth Snapshot','tools.html#networth'],['Financial Learning','index.html#learn'],['Resources','index.html#resources']];
  if(search){search.addEventListener('input',()=>{const q=search.value.trim().toLowerCase();if(!panel)return;const matches=results.filter(r=>r[0].toLowerCase().includes(q));panel.hidden=!q;panel.innerHTML=q?(matches.length?'<strong>Oshurn results</strong>'+matches.map(r=>`<a href="${r[1]}">${r[0]}</a>`).join(''):'<span>No matching Oshurn resource yet.</span>'):'';});}
  const health=$('#health-number');
  if(health){const saved=getStore('oshurnHealth');if(saved!==null)health.textContent=saved;}
  window.Oshurn={money,save:setStore,load:getStore,updateHealth:function(score){setStore('oshurnHealth',Number(score)||0);if(health)health.textContent=Number(score)||0;}};
})();
