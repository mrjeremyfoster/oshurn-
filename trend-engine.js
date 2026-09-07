/* Oshurn Financial Trend Engine — descriptive visualization only. */
(function(){
  const escapeHtml=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const metrics={netWorth:{label:'Net worth',format:n=>Oshurn.money(n)},monthlyMargin:{label:'Monthly margin',format:n=>Oshurn.money(n)},savingsRate:{label:'Savings rate',format:n=>Number(n).toFixed(1)+'%'},debtPaymentRate:{label:'Debt-payment rate',format:n=>Number(n).toFixed(1)+'%'}};
  let active='netWorth';
  function metricValue(item,key){return (Oshurn.snapshot.get===undefined?0:(Oshurn.snapshot.get().derived&&key in Oshurn.snapshot.get().derived?Oshurn.snapshot.get().derived[key]:0));}
  function derived(item,key){const income=Number(item.monthlyIncome)||0,expenses=Number(item.monthlyExpenses)||0,debt=Number(item.monthlyDebtPayments)||0,savings=Number(item.monthlySavings)||0,assets=(Number(item.cash)||0)+(Number(item.investments)||0)+(Number(item.otherAssets)||0),liabilities=Number(item.liabilities)||0;return key==='netWorth'?assets-liabilities:key==='monthlyMargin'?income-expenses:key==='savingsRate'?(income?savings/income*100:0):(income?debt/income*100:0)}
  function render(){
    const mount=document.querySelector('#snapshot-trend-chart');
    if(!mount||!window.Oshurn||!Oshurn.snapshot)return;
    const history=Oshurn.snapshot.history(),current=Oshurn.snapshot.get();
    if(!history.length||!current.updatedAt){mount.hidden=true;return}
    const points=history.slice(-12).concat([current]);
    const values=points.map(p=>derived(p,active));
    const max=Math.max(...values),min=Math.min(...values),range=Math.max(1,max-min),w=720,h=220,pad=24;
    const xy=(v,i)=>({x:pad+(i/Math.max(1,values.length-1))*(w-pad*2),y:pad+(1-(v-min)/range)*(h-pad*2)});
    const path=values.map((v,i)=>{const q=xy(v,i);return(i?'L':'M')+q.x.toFixed(1)+' '+q.y.toFixed(1)}).join(' ');
    const last=xy(values[values.length-1],values.length-1);
    mount.hidden=false;
    mount.innerHTML='<div class="trend-controls" role="tablist" aria-label="Trend metric">'+Object.entries(metrics).map(([key,m])=>'<button type="button" class="trend-tab '+(key===active?'active':'')+'" data-trend="'+key+'" role="tab" aria-selected="'+(key===active?'true':'false')+'">'+m.label+'</button>').join('')+'</div><div class="trend-chart-svg"><svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+escapeHtml(metrics[active].label)+' trend over saved financial snapshots"><line x1="'+pad+'" y1="'+(h-pad)+'" x2="'+(w-pad)+'" y2="'+(h-pad)+'" stroke="currentColor" opacity=".12"></line><path d="'+path+'" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><circle cx="'+last.x.toFixed(1)+'" cy="'+last.y.toFixed(1)+'" r="5" fill="currentColor"></circle><text x="'+pad+'" y="'+(h-5)+'">Earlier</text><text x="'+(w-70)+'" y="'+(h-5)+'">Current</text><text x="'+last.x.toFixed(1)+'" y="'+Math.max(16,last.y-12).toFixed(1)+'" text-anchor="middle">'+escapeHtml(metrics[active].format(values[values.length-1]))+'</text></svg></div><small>'+escapeHtml(metrics[active].label)+' trend from saved local snapshots. Descriptive only; not financial advice.</small>';
    mount.querySelectorAll('[data-trend]').forEach(btn=>btn.addEventListener('click',()=>{active=btn.dataset.trend;render()}));
  }
  function renderInsights(){
    const insightMount=document.querySelector('#snapshot-insights');
    if(!insightMount||!Oshurn.snapshot.insights)return;
    const result=Oshurn.snapshot.insights();
    if(!result.available){insightMount.innerHTML='<p class="app-footer-note">Add financial snapshot data to generate descriptive signals.</p>';return}
    insightMount.innerHTML=result.signals.map(signal=>'<div class="insight-item"><span class="insight-badge '+escapeHtml(signal.status)+'">'+escapeHtml(signal.status)+'</span><div><strong>'+escapeHtml(signal.id.replace(/-/g,' '))+'</strong><p>'+escapeHtml(signal.message)+'</p></div></div>').join('')+'<div class="insight-meta">Generated '+escapeHtml(new Date(result.generatedAt).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}))+' · Educational description, not financial advice.</div>';
  }
  function renderAll(){render();renderInsights()}
  renderAll();window.addEventListener('oshurn:state',renderAll);window.addEventListener('storage',renderAll);
})();
