/* Oshurn Workspace — client-side product foundation. */
(function(){
  const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(n)||0);
  const $=s=>document.querySelector(s);
  const setStore=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return v}catch(e){return v}};
  const getStore=(k,d=null)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
  const targets={budget:'tools.html#budget',debt:'tools.html#debt',emergency:'tools.html#emergency',savings:'tools.html#emergency',networth:'tools.html#networth',goal:'goals.html',health:'health.html'};
  document.querySelectorAll('[data-tool]').forEach(card=>card.addEventListener('click',()=>{const tool=card.dataset.tool;if(targets[tool])window.location.href=targets[tool]}));
  const search=$('#workspace-search'),panel=$('#search-panel');
  const results=[['Budget Planner','tools.html#budget','tool'],['Debt Payoff Explorer','tools.html#debt','tool'],['Emergency Fund','tools.html#emergency','tool'],['Net Worth Snapshot','tools.html#networth','tool'],['Financial Health','health.html','dashboard'],['Goal Planner','goals.html','planning'],['Financial Learning','index.html#learn','learning'],['Oshurn Intelligence','index.html#intelligence','intelligence'],['Resources','index.html#resources','knowledge'],['Extensions','index.html#extensions','platform']];
  if(search){search.setAttribute('aria-label','Search Oshurn');search.addEventListener('input',()=>{const q=search.value.trim().toLowerCase();if(!panel)return;const matches=results.filter(r=>(r[0]+' '+r[2]).toLowerCase().includes(q));panel.hidden=!q;panel.innerHTML=q?(matches.length?'<strong>Oshurn results</strong>'+matches.map(r=>`<a href="${r[1]}">${r[0]}</a>`).join(''):'<span>No matching Oshurn resource yet.</span>'):'';});}
  const health=$('#health-number');
  if(health){const saved=getStore('oshurnHealth');if(saved!==null)health.textContent=saved;}
  const goals=getStore('oshurnGoals',[]);
  const goalCount=document.querySelector('.app-metrics article:nth-child(2) strong');
  if(goalCount&&Array.isArray(goals)&&goals.length)goalCount.textContent=goals.length;
  const onboarding=getStore('oshurnOnboarding',{completed:false,step:0});
  window.Oshurn={money,save:setStore,load:getStore,
    updateHealth:function(score){const value=Math.max(0,Math.min(100,Number(score)||0));setStore('oshurnHealth',value);if(health)health.textContent=value;return value},
    setGoals:function(items){const value=Array.isArray(items)?items:[];setStore('oshurnGoals',value);if(goalCount)goalCount.textContent=value.length;return value},
    addGoal:function(goal){const value=getStore('oshurnGoals',[]);value.push(goal);setStore('oshurnGoals',value);if(goalCount)goalCount.textContent=value.length;return value},
    onboarding:{state:()=>getStore('oshurnOnboarding',{completed:false,step:0}),setStep:function(step){const value={completed:false,step:Math.max(0,Number(step)||0)};setStore('oshurnOnboarding',value);return value},complete:function(){const value={completed:true,step:4};setStore('oshurnOnboarding',value);return value}},
    search:function(query){const q=String(query||'').trim().toLowerCase();return q?results.filter(r=>(r[0]+' '+r[2]).toLowerCase().includes(q)):results}
  };
  if(onboarding.completed){document.documentElement.dataset.oshurnOnboarding='complete';}
})();
