// =====================================================================
// Entre Nós · comunidade anônima de verdade (Pergunte sem vergonha)
// =====================================================================
(function(){
if(!window.REAL||!window.sb)return;
const sb=window.sb;
S.cq={wall:[],fu:[],mine:[],loaded:{},openQ:{},fuOpen:null,fuDraft:{},repl:null,ansDraft:'',frDraft:{}};

async function loadTab(tab){const c=S.cq;
  if(tab==='help'){const [w,f]=await Promise.all([sb.rpc('wall'),sb.rpc('my_followups')]);c.wall=w.data||[];c.fu=f.data||[]}
  else if(tab==='mine'){const {data}=await sb.rpc('my_questions');c.mine=data||[]}
  c.loaded[tab]=true;if(S.screen==='ask')render()}
const errMsg=m=>{const Q=t().q;m=m||'';if(/link|@/.test(m))return Q.errLink;if(/telefone/.test(m))return Q.errLink;if(/palavrão/.test(m))return Q.errBad;return lang==='pt'?'Algo deu errado. Tente de novo.':'Algo salió mal. Inténtalo de nuevo.'};
const ago=d=>{const h=Math.floor((Date.now()-new Date(d))/36e5);return h<1?(lang==='pt'?'agora há pouco':'hace poco'):h<24?(lang==='pt'?`há ${h}h`:`hace ${h} h`):(lang==='pt'?`há ${Math.floor(h/24)} d`:`hace ${Math.floor(h/24)} d`)};

const _ask=R.ask;
R.ask=function(){const L=t(),Q=L.q,c=S.cq;
  if(S.askTab==='ask'){let h=_ask();
    // por enquanto só texto: esconde o gravador
    return h.replace(/<div class="row"><button type="button" class="rec[\s\S]*?<\/div><p class="hint">[^<]*<\/p>(<p class="hint">[^<]*<\/p>)?/,'').replace('data-act="sendq"','data-cq="sendq"')}
  const ids=['ask','help','mine'];
  const tabs=Q.tabs.map((n,i)=>`<button type="button" class="seg-b" data-askt="${ids[i]}" aria-pressed="${S.askTab===ids[i]}">${n}</button>`).join('');
  if(!c.loaded[S.askTab]){loadTab(S.askTab);return `<section class="screen"><button type="button" class="back" data-act="back">${Q.back}</button><h2>${Q.title}</h2><div class="seg" role="group">${tabs}</div><p class="hint">${lang==='pt'?'Carregando…':'Cargando…'}</p></section>`}
  let body='';
  if(S.askTab==='help'){
    body=c.fu.map(f=>`<article class="qcard fu"><div class="sec-t" style="margin:0;color:var(--honey)">${Q.fuTitle}</div><p class="hint">${Q.fuHint}</p>
      <div class="bub"><small>${Q.fuQ}</small>${esc(f.question)}</div>${f.my_answer?`<div class="bub"><small>${Q.fuYour}</small>${esc(f.my_answer)}</div>`:''}
      <div class="bub me"><small>${Q.fuAsk}</small>${esc(f.body)}</div>
      <textarea data-cqfr="${f.id}" rows="3" placeholder="${Q.fuPh}">${esc(c.frDraft[f.id]||'')}</textarea>
      <button type="button" class="btn pri" data-cq="fureply:${f.id}">${Q.fuSend}</button></article>`).join('')+
    `<div><div class="sec-t">${S.gender==='m'?Q.muralM:Q.muralF}</div><p class="hint">${Q.muralHint} ${Q.rules}</p></div>`+
    (c.wall.length?c.wall.map(x=>`<article class="qcard"><p class="qtext">“${esc(x.body)}”</p>
      <div class="meter"><span class="pips" aria-hidden="true">${[0,1,2].map(j=>`<i class="${j<x.answers?'on':''}"></i>`).join('')}</span><small>${Q.of3(x.answers)} · ${ago(x.created_at)}</small></div>
      ${c.repl===x.id?`${rulesBox('a',false)}<textarea id="cqat" rows="3" placeholder="${Q.ansPh}">${esc(c.ansDraft)}</textarea>
        <button type="button" class="btn pri" data-cq="sendans:${x.id}">${Q.sendAns}</button>`
      :`<div class="row"><button type="button" class="btn ghost sm" data-cq="reply:${x.id}">${Q.answer}</button>
        <button type="button" class="btn link" style="width:auto" data-cq="report:${x.id}">${Q.report}</button></div>`}</article>`).join(''):`<p class="empty">${Q.muralEmpty}</p>`);
  }else{
    body=c.mine.length?c.mine.map(m=>{const n=m.answers.length,done=!m.open||n>=3||m.answers.some(a=>a.staff);
      const status=done&&n?Q.answered:`${Q.waiting} · ${Q.of3(n)}`;
      return `<article class="qcard"><button type="button" class="qhead" data-cq="toggle:${m.id}" aria-expanded="${!!c.openQ[m.id]}">
        <span class="qmeta"><span class="tag ${n?'ok':''}">${status}</span><span class="to">${m.audience==='m'?Q.toM:m.audience==='b'?Q.toB:Q.toF}</span></span>
        <p class="qtext">“${esc(m.body)}”</p></button>
        ${c.openQ[m.id]&&n?`<div class="answers">${m.answers.map(a=>{
          const main=`<div class="ans ${a.staff?'team':''}">${a.staff?`<span class="badge">✦ ${Q.team}</span>`:''}<p>${esc(a.body||'')}</p></div>`;
          if(a.staff)return main;
          const th=a.followups||[],used=th.length;
          const bubbles=th.map(x=>`<div class="bub me"><small>${Q.you}</small>${esc(x.body)}</div>${x.reply?`<div class="bub"><small>${Q.them}</small>${esc(x.reply)}</div>`:''}`).join('');
          const ctl=c.fuOpen===a.id?`<textarea data-cqfu="${a.id}" rows="2" placeholder="${Q.morePh}">${esc(c.fuDraft[a.id]||'')}</textarea><button type="button" class="btn pri sm" data-cq="fusend:${a.id}">${Q.moreSend}</button>`
            :used<2?`<button type="button" class="more" data-cq="fuopen:${a.id}">${Q.more} · ${Q.moreLeft(2-used)}</button>`:`<span class="limit">${Q.moreNone}</span>`;
          return main+`<div class="thread">${bubbles}${ctl}</div>`}).join('')}</div>`:''}
      </article>`}).join(''):`<p class="empty">${Q.mineEmpty}</p>`;
  }
  return `<section class="screen"><button type="button" class="back" data-act="back">${Q.back}</button><h2>${Q.title}</h2><div class="seg" role="group">${tabs}</div>${body}</section>`};

document.addEventListener('click',async e=>{
  const tb=e.target.closest('[data-askt]');if(tb&&S.screen==='ask'){S.cq.loaded[tb.dataset.askt]=false}
  const b=e.target.closest('[data-cq]');if(!b)return;e.stopImmediatePropagation();
  const [a,id]=b.dataset.cq.split(':'),c=S.cq,Q=t().q;
  if(a==='sendq'){const tx=(S.draft||'').trim();if(tx.length<5){toast(Q.errQ);return}if(!S.box){toast(Q.errQ);return}
    b.disabled=true;const {error}=await sb.rpc('ask_question',{p_audience:S.box,p_body:tx});b.disabled=false;
    if(error){toast(errMsg(error.message));return}S.draft='';S.box=null;toast(Q.sent);S.askTab='mine';c.loaded.mine=false;render();return}
  if(a==='reply'){c.repl=id;c.ansDraft='';render();return}
  if(a==='sendans'){const tx=(c.ansDraft||'').trim();if(tx.length<2){toast(Q.errA);return}b.disabled=true;
    const {error}=await sb.rpc('answer_question',{p_question:id,p_body:tx,p_audio_path:null,p_audio_secs:null});b.disabled=false;
    if(error){toast(errMsg(error.message));return}c.repl=null;c.ansDraft='';toast(Q.ansSent);loadTab('help');return}
  if(a==='report'){await sb.from('reports').insert({target:'question',target_id:id});toast(Q.reported);c.wall=c.wall.filter(x=>x.id!==id);render();return}
  if(a==='fureply'){const tx=(c.frDraft[id]||'').trim();if(!tx){toast(Q.errA);return}const {error}=await sb.rpc('reply_followup',{p_id:id,p_body:tx});
    if(error){toast(errMsg(error.message));return}delete c.frDraft[id];toast(Q.fuSent);loadTab('help');return}
  if(a==='toggle'){c.openQ[id]=!c.openQ[id];render();return}
  if(a==='fuopen'){c.fuOpen=id;render();return}
  if(a==='fusend'){const tx=(c.fuDraft[id]||'').trim();if(!tx){toast(Q.errA);return}const {error}=await sb.rpc('ask_followup',{p_answer:id,p_body:tx});
    if(error){toast(errMsg(error.message));return}c.fuOpen=null;delete c.fuDraft[id];toast(Q.moreSent);loadTab('mine');return}
},true);
document.addEventListener('input',e=>{const c=S.cq,t2=e.target;
  if(t2.id==='cqat')c.ansDraft=t2.value;else if(t2.dataset.cqfr)c.frDraft[t2.dataset.cqfr]=t2.value;else if(t2.dataset.cqfu)c.fuDraft[t2.dataset.cqfu]=t2.value});
})();
