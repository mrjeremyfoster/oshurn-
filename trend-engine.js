/* Oshurn Financial Trend Engine — descriptive visualization only. */
(function(){
  function render(){
    const mount=document.querySelector('#snapshot-trend-chart');
    if(!mount||!window.Oshurn||!Oshurn.snapshot)return;
    const history=Oshurn.snapshot.history();
    const current=Oshurn.snapshot.get();
    if(!history.length||!current.updatedAt){mount.hidden=true;return;}
    const points=history.slice(-12).concat([current]);
    const values=points.map(p=>(Number(p.assets)||0)-(Number(p.liabilities)||0));
    const max=Math.max(...values),min=Math.min(...values),range=Math.max(1,max-min);
    const w=640,h=190,pad=18;
    const xy=(v,i)=>({x:pad+(i/(Math.max(1,values.length-1)))*(w-pad*2),y:pad+(1-(v-min)/range)*(h-pad*2)});
    const path=values.map((v,i)=>{const q=xy(v,i);return (i?'L':'M')+q.x.toFixed(1)+' '+q.y.toFixed(1)}).join(' ');
    mount.hidden=false;
    mount.innerHTML='<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="Net worth trend over saved financial snapshots"><path d="'+path+'" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><text x="18" y="184">Earlier</text><text x="578" y="184">Current</text></svg><small>Net worth trend from saved local snapshots. Descriptive only; not financial advice.</small>';
  }
  render();
  window.addEventListener('oshurn:state',render);
  window.addEventListener('storage',render);
})();
