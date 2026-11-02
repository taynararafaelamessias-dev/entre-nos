// =====================================================================
// Entre Nós · compartilhar com o par de verdade (preliminares, brinquedos, desejos, diário) + comentários
// =====================================================================
(function(){
if(!window.REAL||!window.sb)return;
const sb=window.sb;
const kindOf=k=>k.startsWith('pre:')?'pre':k.startsWith('toy:')?'toy':k.startsWith('bdsm:')?'bdsm':'wish';
let synced={cm:new Set(),dcm:new Set()},busy=false,loaded=false;

async function loadShares(){if(!S.uid||S.isFree)return;
  const [{data:sh},{data:cm}]=await Promise.all([sb.from('shares').select('id,from_user,kind,keys,mode,message,created_at').order('created_at'),sb.from('share_comments').select('share_id,user_id,body')]);
  const cms={};(cm||[]).forEach(c=>{(cms[c.share_id]=cms[c.share_id]||{})[c.user_id===S.uid?'me':'them']=c.body});
  const opened=new Set((S.sh||[]).filter(e=>e.open&&e.id).map(e=>e.id));
  S.sh=[];S.shc={};S.pdiary=[];S.dpc={};S.dmc={};S.myDiaryShare={};S.theirDiaryShare={};synced={cm:new Set(),dcm:new Set()};
  Object.keys(S.diary||{}).forEach(id=>{S.diary[id].shared=false});
  (sh||[]).forEach(r=>{const mine=r.from_user===S.uid,c=cms[r.id]||{};
    if(r.kind==='diary'){const pid=r.keys[0].replace('pos:',''),rt=+((r.keys.find(k=>k.startsWith('r:'))||'r:0').slice(2));
      if(mine){if(S.diary[pid])S.diary[pid].shared=true;S.myDiaryShare[pid]=r.id;if(c.them)S.dpc[pid]=c.them}
      else{S.pdiary.push({id:pid,rating:rt,note:r.message||'',me:false});S.theirDiaryShare[pid]=r.id;if(c.me){S.dmc[pid]=c.me;synced.dcm.add(pid)}}
      return}
    const i=S.sh.length;S.sh.push(Object.assign({id:r.id,from:mine?'me':'them',mode:r.mode,msg:r.message||'',open:opened.has(r.id)},r.keys.length>1?{keys:r.keys}:{key:r.keys[0]}));
    if(c.me||c.them){S.shc[i]={me:c.me,them:c.them};if(c.me)synced.cm.add(r.id)}});
  loaded=true;window.__shSnap=snapDiary();if(['pre','toys','diary','wish','talk'].includes(S.screen))_render()}
const snapDiary=()=>JSON.stringify(Object.fromEntries(Object.entries(S.diary||{}).map(([k,v])=>[k,!!v.shared])));

async function syncShares(){if(!loaded||busy||!S.uid)return;busy=true;
  try{
    for(let i=0;i<S.sh.length;i++){const e=S.sh[i];
      if(e.from==='me'&&!e.id){const keys=e.keys||[e.key];const {data,error}=await sb.from('shares').insert({kind:kindOf(keys[0]),keys,mode:e.mode||'share',message:e.msg||null}).select('id').single();if(!error)e.id=data.id}
      const c=S.shc[i];if(e.id&&c&&c.me&&!synced.cm.has(e.id)){synced.cm.add(e.id);await sb.from('share_comments').insert({share_id:e.id,body:c.me})}}
    for(const [id,d] of Object.entries(S.diary||{})){
      if(d.shared&&!S.myDiaryShare[id]){const {data}=await sb.from('shares').insert({kind:'diary',keys:['pos:'+id,'r:'+(d.rating||0)],mode:'share',message:d.note||null}).select('id').single();if(data)S.myDiaryShare[id]=data.id}
      else if(!d.shared&&S.myDiaryShare[id]){await sb.from('shares').delete().eq('id',S.myDiaryShare[id]);delete S.myDiaryShare[id];delete S.dpc[id]}}
    for(const [id,tx] of Object.entries(S.dmc||{})){if(tx&&!synced.dcm.has(id)&&S.theirDiaryShare[id]){synced.dcm.add(id);await sb.from('share_comments').insert({share_id:S.theirDiaryShare[id],body:tx})}}
  }catch(_){}finally{busy=false}}

const _render=window.render;
window.render=function(){_render();setTimeout(syncShares,300)};
const _go=window.go;
window.go=function(s,o){const r=_go(s,o);if(['pre','toys','diary','wish','talk'].includes(s))loadShares();return r};
// quando a conta carrega
const iv=setInterval(()=>{if(S.uid&&S.diary&&!loaded&&S.isFree===false){clearInterval(iv);loadShares()}},800);
setTimeout(()=>clearInterval(iv),20000);
})();
