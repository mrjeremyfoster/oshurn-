/* Oshurn Workspace — client-side prototype interactions. */
(function(){
  const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(n)||0);
  const $ = s => document.querySelector(s);
  document.querySelectorAll('[data-tool]').forEach(card=>card.addEventListener('click',()=>{
    const tool=card.dataset.tool;
    if(tool==='budget') window.location.href='tools.html#budget';
    if(tool==='debt') window.location.href='tools.html#debt';
    if(tool==='emergency') window.location.href='tools.html#emergency';
  }));
  const search=$('#workspace-search');
  const searchPanel=$('#search-panel');
  if(search){search.addEventListener('input',()=>{const q=search.value.trim().toLowerCase(); if(searchPanel) searchPanel.hidden=!q; if(q){searchPanel.innerHTML='<strong>Search results</strong><a href="tools.html#budget">Budget Planner</a><a href="tools.html#debt">Debt Payoff</a><a href="tools.html#emergency">Emergency Fund</a><a href="index.html#learn">Financial Learning</a>';} });}
  const health=$('#health-number');
  if(health){ const saved=Number(localStorage.getItem('oshurnHealth')); if(saved) health.textContent=saved; }
  window.Oshurn={money,updateHealth:function(score){localStorage.setItem('oshurnHealth',score);if(health)health.textContent=score;}};
})();
