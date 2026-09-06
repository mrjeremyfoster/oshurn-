/* Oshurn Workspace — client-side product foundation. */
(function(){
  const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(n)||0);
  const $=s=>document.querySelector(s);
  const setStore=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));window.dispatchEvent(new CustomEvent('oshurn:state',{detail:{key:k,value:v}}));return v}catch(e){return v}};
  const getStore=(k,d=null)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
  const targets={budget:'tools.html#budget',debt:'tools.html#debt',emergency:'tools.html#emergency',savings:'tools.html#emergency',networth:'tools.html#networth',goal:'goals.html',health:'health.html'};
  document.querySelectorAll('[data-tool]').forEach(card=>card.addEventListener('click',()=>{const tool=card.dataset.tool;if(targets[tool])window.location.href=targets[tool]}));
  const search=$('#workspace-search'),panel=$('#search-panel');
  const results=[['Budget Planner','tools.html#budget','tool'],['Debt Payoff Explorer','tools.html#debt','tool'],['Emergency Fund','tools.html#emergency','tool'],['Net Worth Snapshot','tools.html#networth','tool'],['Financial Health','health.html','dashboard'],['Goal Planner','goals.html','planning'],['Financial Learning','index.html#learn','learning'],['Oshurn Intelligence','index.html#intelligence','intelligence'],['Resources','index.html#resources','knowledge'],['Extensions','index.html#extensions','platform']];
  let activeSearchIndex=-1;
  function renderSearch(query){
    if(!panel)return;
    const q=String(query||'').trim().toLowerCase();
    const matches=q?results.filter(r=>(r[0]+' '+r[2]).toLowerCase().includes(q)):[];
    panel.hidden=!q;
    activeSearchIndex=-1;
    panel.innerHTML=q?(matches.length?'<strong>Oshurn results</strong>'+matches.map((r,i)=>`<a href="${r[1]}" data-search-index="${i}">${r[0]}<small>${r[2]}</small></a>`).join(''):'<span>No matching Oshurn resource yet.</span>'):'';
    return matches;
  }
  if(search){
    search.setAttribute('aria-controls','search-panel');search.setAttribute('aria-autocomplete','list');
    search.addEventListener('input',()=>renderSearch(search.value));
    search.addEventListener('keydown',e=>{
      const links=panel?[...panel.querySelectorAll('a[data-search-index]')]:[];
      if(e.key==='Escape'){search.value='';renderSearch('');search.blur();return}
      if(!links.length)return;
      if(e.key==='ArrowDown'){e.preventDefault();activeSearchIndex=(activeSearchIndex+1)%links.length;links[activeSearchIndex].focus()}
      if(e.key==='ArrowUp'){e.preventDefault();activeSearchIndex=(activeSearchIndex-1+links.length)%links.length;links[activeSearchIndex].focus()}
    });
    search.addEventListener('focus',()=>{if(search.value.trim())renderSearch(search.value)});
  }
  const health=$('#health-number');
  function syncHealth(){const saved=getStore('oshurnHealth');if(health&&saved!==null)health.textContent=Math.max(0,Math.min(100,Number(saved)||0));}
  syncHealth();
  const goalCount=document.querySelector('.app-metrics article:nth-child(2) strong');
  function syncGoals(){const goals=getStore('oshurnGoals',[]);if(goalCount)goalCount.textContent=Array.isArray(goals)?goals.length:0;return Array.isArray(goals)?goals:[];}
  let goals=syncGoals();
  const onboarding=getStore('oshurnOnboarding',{completed:false,step:0});
  window.Oshurn={money,save:setStore,load:getStore,
    updateHealth:function(score){const value=Math.max(0,Math.min(100,Number(score)||0));setStore('oshurnHealth',value);syncHealth();return value},
    setGoals:function(items){const value=Array.isArray(items)?items:[];setStore('oshurnGoals',value);goals=value;syncGoals();return value},
    addGoal:function(goal){const value=syncGoals();if(!goal||!String(goal.name||'').trim()||Number(goal.target)<=0)return value;value.push({...goal,name:String(goal.name).trim(),current:Math.max(0,Number(goal.current)||0),target:Number(goal.target),createdAt:goal.createdAt||new Date().toISOString()});setStore('oshurnGoals',value);goals=value;syncGoals();return value},
    getGoals:function(){return syncGoals()},
    onboarding:{state:()=>getStore('oshurnOnboarding',{completed:false,step:0}),setStep:function(step){const value={completed:false,step:Math.max(0,Number(step)||0)};setStore('oshurnOnboarding',value);return value},complete:function(){const value={completed:true,step:4};setStore('oshurnOnboarding',value);return value}},
    search:function(query){const q=String(query||'').trim().toLowerCase();return q?results.filter(r=>(r[0]+' '+r[2]).toLowerCase().includes(q)):results},
    version:'0.7.0'
  };
  window.addEventListener('storage',e=>{if(e.key==='oshurnHealth')syncHealth();if(e.key==='oshurnGoals')syncGoals()});
  window.addEventListener('oshurn:state',e=>{if(e.detail&&e.detail.key==='oshurnHealth')syncHealth();if(e.detail&&e.detail.key==='oshurnGoals')syncGoals()});
  if(onboarding.completed)document.documentElement.dataset.oshurnOnboarding='complete';
})();
