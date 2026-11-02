// Brinquedos em 3D: silicone preto fosco + detalhes dourados, sem marca
function buildToy(kind){
  const T=THREE,V=(x,y,z)=>new T.Vector3(x,y,z||0);
  const black=new T.MeshStandardMaterial({color:0x17121a,roughness:.42,metalness:.12});
  const gold=new T.MeshStandardMaterial({color:0xC8A15A,roughness:.28,metalness:.9});
  const g=new T.Group();
  const add=(m,x,y,z)=>{m.position.set(x||0,y||0,z||0);g.add(m);return m};
  const lathe=(pts,mat)=>new T.Mesh(new T.LatheGeometry(pts.map(([r,y])=>new T.Vector2(r,y)),48),mat||black);
  const sph=(r,mat)=>new T.Mesh(new T.SphereGeometry(r,32,20),mat||black);
  const tor=(r,t,mat)=>new T.Mesh(new T.TorusGeometry(r,t,16,48),mat||gold);
  const cyl=(r1,r2,h,mat)=>new T.Mesh(new T.CylinderGeometry(r1,r2,h,32),mat||black);
  const tube=(pts,r,mat)=>{const c=new T.CatmullRomCurve3(pts.map(p=>V(...p)));const m=new T.Mesh(new T.TubeGeometry(c,64,r,20,false),mat||black);g.add(m);
    const a=sph(r,mat);a.position.copy(c.getPoint(0));g.add(a);const b=sph(r,mat);b.position.copy(c.getPoint(1));g.add(b);return c};
  const flat=x=>{x.rotation.x=Math.PI/2;return x};
  const plugShape=()=>{add(lathe([[0,.55],[.06,.5],[.16,.28],[.2,.12],[.15,-.04],[.065,-.18],[.06,-.3],[0,-.3]]));const b=add(cyl(.24,.24,.05,gold),0,-.33);return b};
  switch(kind){
    case 'bullet':{const m=lathe([[0,-.45],[.12,-.43],[.16,-.32],[.16,.3],[.13,.4],[0,.45]]);g.add(m);const r=tor(.162,.014);flat(r);r.position.y=-.3;g.add(r);g.rotation.z=Math.PI/2.4;break}
    case 'wand':{add(lathe([[0,-.7],[.075,-.69],[.085,-.3],[.065,.15],[.055,.3],[0,.32]]));add(sph(.21),0,.48);const r=add(flat(tor(.06,.014)),0,.24);add(sph(.022,gold),0,-.1,.08);add(sph(.022,gold),0,-.2,.08);g.rotation.z=-.45;break}
    case 'suction':{add(lathe([[0,-.42],[.15,-.38],[.22,-.12],[.21,.12],[.14,.3],[.07,.37],[0,.38]]));add(flat(tor(.065,.016)),0,.37);const d=add(cyl(.05,.05,.02,new T.MeshStandardMaterial({color:0x050405,roughness:.9})),0,.375);add(sph(.024,gold),0,0,.215);g.rotation.z=-.5;break}
    case 'remote':{const p=add(sph(.2),-.24,0);p.scale.set(1.25,.55,1);add(flat(tor(.14,.01)),-.24,.06);const r=add(new T.Mesh(new T.BoxGeometry(.2,.46,.06),black),.26,0);add(sph(.04,gold),.26,.1,.035);add(sph(.025,gold),.26,-.04,.035);add(sph(.025,gold),.26,-.13,.035);break}
    case 'classic':{add(lathe([[0,-.62],[.11,-.6],[.12,-.4],[.115,.28],[.095,.46],[.05,.57],[0,.59]]));add(flat(tor(.12,.016)),0,-.5);g.rotation.z=-.35;break}
    case 'rabbit':{tube([[0,-.6],[0,-.1],[.03,.25],[.12,.5]],.1);add(flat(tor(.105,.014)),0,-.42);tube([[0,-.28],[.14,-.22],[.26,-.06]],.045);
      [-.25,.25].forEach(a=>{const e=lathe([[0,0],[.035,.02],[.035,.14],[0,.17]]);e.position.set(.27,-.04,0);e.rotation.z=-.4+a;g.add(e)});g.rotation.z=-.3;break}
    case 'gspot':{tube([[0,-.6],[0,-.05],[.04,.3],[.2,.48]],.09);add(sph(.14),.22,.5);add(flat(tor(.095,.015)),0,-.45);g.rotation.z=-.2;break}
    case 'kegel':{add(sph(.17),0,.22);add(sph(.17),0,-.16);add(cyl(.05,.05,.12),0,.03);const c=new T.CatmullRomCurve3([V(0,-.33),V(0,-.45),V(.02,-.55)]);g.add(new T.Mesh(new T.TubeGeometry(c,20,.012,8,false),gold));add(tor(.06,.012),0,-.6);add(flat(tor(.172,.01)),0,.22);break}
    case 'plug':{plugShape();g.rotation.z=.25;break}
    case 'vplug':{plugShape();add(flat(tor(.205,.012)),0,.12);add(flat(tor(.17,.012)),0,.25);g.rotation.z=.25;break}
    case 'beads':{const rs=[.07,.09,.11,.13];let y=.55;rs.forEach(r=>{y-=r;add(sph(r),0,y);y-=r+.04});add(cyl(.02,.02,y<0?.6-y:.6),0,.05);add(tor(.12,.025),0,y-.08);break}
    case 'nipsuc':{[-.22,.22].forEach(x=>{add(lathe([[0,-.12],[.05,-.11],[.13,.1],[.13,.14],[0,.14]]),x);add(flat(tor(.13,.014)),x,.13);add(sph(.04,gold),x,-.14)});g.rotation.x=.4;break}
    case 'clamps':{[-.28,.28].forEach(x=>{const a=add(new T.Mesh(new T.BoxGeometry(.05,.2,.06),black),x-.03,.15);a.rotation.z=.25;const b=add(new T.Mesh(new T.BoxGeometry(.05,.2,.06),black),x+.03,.15);b.rotation.z=-.25;add(sph(.03,gold),x,.05)});
      for(let i=0;i<=12;i++){const t=i/12,x=-.28+.56*t,y=.03-.28*Math.sin(Math.PI*t);const l=tor(.025,.007);l.position.set(x,y,0);l.rotation.y=i%2?Math.PI/2:0;g.add(l)}break}
    case 'feather':{const c=tube([[0,-.6],[.02,-.1],[.08,.3],[.18,.55]],.012,gold);for(let i=0;i<9;i++){const t=.25+i*.085,p=c.getPoint(t);[1,-1].forEach(s=>{const v=sph(.11);v.scale.set(1.1,.25,.05);v.position.set(p.x+s*.09,p.y,0);v.rotation.z=s*.6;g.add(v)})}break}
    case 'ring':{add(tor(.24,.075,black));add(tor(.24,.012),0,0,.072);g.rotation.x=.6;break}
    case 'vring':{add(tor(.22,.07,black),0,-.08);const b=add(lathe([[0,-.14],[.07,-.12],[.08,.1],[0,.14]]),0,.24);b.rotation.z=Math.PI/2;add(flat(tor(.081,.01)),.08,.24).rotation.y=Math.PI/2;add(tor(.22,.01),0,-.08,.068);g.rotation.x=.5;break}
    case 'sleeve':case 'autos':{add(lathe([[0,-.5],[.16,-.48],[.2,-.3],[.2,.34],[.17,.45],[.1,.5],[0,.5]]));add(flat(tor(.075,.02)),0,.495);add(cyl(.06,.06,.01,new T.MeshStandardMaterial({color:0x050405,roughness:.9})),0,.5);
      if(kind==='autos'){add(flat(tor(.202,.014)),0,-.1);add(sph(.03,gold),0,.1,.2);add(sph(.03,gold),0,0,.2)}g.rotation.z=-.3;break}
    case 'prost':{tube([[0,-.5],[0,0],[.1,.3],[.26,.36]],.075);add(sph(.11),.28,.36);tube([[0,-.42],[-.12,-.38],[-.22,-.25]],.04);add(tor(.1,.02),0,-.62);g.rotation.z=-.15;break}
    case 'couple':{tube([[-.18,.42],[-.22,0],[-.12,-.3],[.08,-.32],[.2,-.08],[.16,.3]],.07);add(sph(.11),-.18,.44);add(sph(.09),.16,.32);add(sph(.03,gold),.02,-.38,.06);break}
    case 'oil':{add(lathe([[0,-.45],[.18,-.45],[.2,-.4],[.2,.12],[.12,.27],[.06,.31],[.06,.36],[0,.36]],new T.MeshStandardMaterial({color:0x1a1416,roughness:.15,metalness:.3})));add(cyl(.075,.075,.14,gold),0,.43);add(flat(tor(.201,.01)),0,-.1);break}
    case 'blind':{const b=new T.Mesh(new T.CylinderGeometry(.42,.42,.18,48,1,true,-1.2,2.4),new T.MeshStandardMaterial({color:0x17121a,roughness:.35,metalness:.2,side:T.DoubleSide}));g.add(b);
      const c=new T.CatmullRomCurve3([V(.39,0,-.16),V(.2,0,-.5),V(-.2,0,-.5),V(-.39,0,-.16)]);g.add(new T.Mesh(new T.TubeGeometry(c,40,.015,8,false),gold));g.rotation.x=.25;break}
    case 'pelvic':{tube([[0,-.15],[0,.15],[.06,.38]],.12);add(sph(.17),.08,.42);const t=tube([[0,-.15],[0,-.35],[.12,-.5],[.3,-.5]],.04);add(sph(.09),.32,-.5);add(flat(tor(.122,.014)),0,-.05);g.rotation.z=-.15;break}
    case 'pearls':{const pm=new T.MeshStandardMaterial({color:0xEDE3D6,roughness:.18,metalness:.25});for(let i=0;i<26;i++){const a=i/26*Math.PI*2,p=add(sph(.06,pm),Math.cos(a)*.42,Math.sin(a)*.3+(Math.sin(a*2)*.04));}add(tor(.07,.015),.42,-.08).rotation.y=Math.PI/2;g.rotation.x=.9;break}
    case 'cuffs':{[-.27,.27].forEach(x=>{add(tor(.17,.03,gold),x,0);const f=add(tor(.17,.055,black),x,0);f.scale.set(1,1,.6);add(new T.Mesh(new T.BoxGeometry(.08,.06,.05),gold),x+(x<0?.17:-.17),0)});
      for(let i=0;i<3;i++){const l=tor(.035,.01);l.position.set(-.06+i*.06,0,0);l.rotation.y=i%2?Math.PI/2:0;g.add(l)}g.rotation.x=.55;break}
    case 'tiekit':{[[-.32,.25],[.32,.25],[-.32,-.25],[.32,-.25]].forEach(([x,y])=>{const c=new T.Mesh(new T.CylinderGeometry(.13,.13,.1,32,1,true),new T.MeshStandardMaterial({color:0x17121a,roughness:.4,side:T.DoubleSide}));c.position.set(x,y,0);g.add(c);add(tor(.04,.012),x,y,-.14).rotation.x=0;add(new T.Mesh(new T.BoxGeometry(.06,.05,.04),gold),x,y,.14)});
      tube([[-.32,.25,-.18],[0,.32,-.3],[.32,.25,-.18]],.015);tube([[-.32,-.25,-.18],[0,-.32,-.3],[.32,-.25,-.18]],.015);g.rotation.x=.9;break}
    case 'spreader':{const b=add(cyl(.035,.035,1.2,gold));b.rotation.z=Math.PI/2;[-.62,.62].forEach(x=>{add(sph(.05,gold),x,0);const c=add(tor(.12,.05,black),x,-.18);c.rotation.y=Math.PI/2;add(tor(.03,.01),x,-.05).rotation.y=Math.PI/2});g.rotation.x=.4;g.rotation.y=.3;break}
    case 'flogger':{add(cyl(.04,.045,.4),0,.45);add(sph(.06,gold),0,.67);add(cyl(.055,.055,.05,gold),0,.24);for(let i=0;i<14;i++){const a=i/14*Math.PI*2,r=.03;const ex=Math.cos(a)*(.12+.06*((i*7)%5)/5),ez=Math.sin(a)*(.12+.06*((i*7)%5)/5);
      const c=new T.CatmullRomCurve3([V(Math.cos(a)*r,.22,Math.sin(a)*r),V(ex*.6,-.1,ez*.6),V(ex,-.6-((i*3)%4)*.02,ez)]);const m=new T.Mesh(new T.TubeGeometry(c,24,.012,6,false),black);m.scale.set(1,1,.5);g.add(m)}g.rotation.z=-.5;break}
    case 'crop':{add(cyl(.04,.04,.28),0,-.62);add(sph(.05,gold),0,-.77);add(cyl(.045,.045,.03,gold),0,-.47);add(cyl(.012,.018,1.0),0,.0);const tip=add(new T.Mesh(new T.BoxGeometry(.14,.1,.012),black),0,.55);add(new T.Mesh(new T.BoxGeometry(.03,.07,.016),gold),0,.5);g.rotation.z=-.7;break}
    case 'miniwhip':{add(cyl(.035,.04,.3),0,.25);add(sph(.05,gold),0,.41);add(cyl(.045,.045,.04,gold),0,.1);for(let i=0;i<10;i++){const a=i/10*Math.PI*2;const c=new T.CatmullRomCurve3([V(0,.08,0),V(Math.cos(a)*.06,-.1,Math.sin(a)*.06),V(Math.cos(a)*.12,-.3,Math.sin(a)*.12)]);g.add(new T.Mesh(new T.TubeGeometry(c,16,.022,8,false),black))}g.rotation.z=-.5;break}
    case 'paddle':{const s=new T.Shape();s.absarc(0,0,.22,0,Math.PI*2);const pg=new T.ExtrudeGeometry(s,{depth:.04,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:3,curveSegments:40});const p=new T.Mesh(pg,black);p.scale.set(.85,1.3,1);p.position.set(0,.2,-.02);g.add(p);
      [[-.08,.3],[.08,.3],[0,.15],[-.08,0],[.08,0]].forEach(([x,y])=>add(sph(.022,gold),x,y,.04));add(cyl(.035,.04,.4),0,-.32);add(cyl(.045,.045,.03,gold),0,-.1);add(sph(.05,gold),0,-.53);g.rotation.z=-.4;break}
    case 'collar':case 'leash':{const c=add(new T.Mesh(new T.CylinderGeometry(.3,.3,.09,48,1,true),new T.MeshStandardMaterial({color:0x17121a,roughness:.4,side:T.DoubleSide})));add(tor(.302,.008),0,.04);add(tor(.302,.008),0,-.04);
      const r=add(tor(.06,.013),0,-.03,.32);add(new T.Mesh(new T.BoxGeometry(.08,.06,.02),gold),0,0,-.305);
      if(kind==='leash'){const ch=new T.CatmullRomCurve3([V(0,-.08,.36),V(.05,-.35,.5),V(.25,-.55,.45),V(.45,-.6,.3)]);for(let i=0;i<=14;i++){const l=tor(.025,.007);l.position.copy(ch.getPoint(i/14));l.rotation.y=i%2?Math.PI/2:0;g.add(l)}add(tor(.09,.022,black),.5,-.62,.28)}
      g.rotation.x=.45;break}
    case 'gag':{const st=add(new T.Mesh(new T.TorusGeometry(.32,.025,8,64),black));st.scale.set(1,.85,1);st.rotation.x=Math.PI/2;add(sph(.13),0,0,.3);[-.04,.04].forEach(y=>add(sph(.015,new T.MeshStandardMaterial({color:0x050405})),0,y,.43));add(new T.Mesh(new T.BoxGeometry(.07,.05,.03),gold),0,0,-.28);g.rotation.x=.4;g.rotation.y=.5;break}
    case 'clover':{[-.25,.25].forEach(x=>{const a=add(new T.Mesh(new T.BoxGeometry(.04,.22,.03),gold),x-.04,.12);a.rotation.z=.35;const b=add(new T.Mesh(new T.BoxGeometry(.04,.22,.03),gold),x+.04,.12);b.rotation.z=-.35;add(sph(.035,black),x-.02,.02);add(sph(.035,black),x+.02,.02);add(tor(.03,.008),x,.25)});
      for(let i=0;i<=14;i++){const t=i/14,x=-.25+.5*t,y=.27+.22*Math.sin(Math.PI*t);const l=tor(.022,.006);l.position.set(x,y,0);l.rotation.y=i%2?Math.PI/2:0;g.add(l)}g.position.y=-.1;break}
    default:add(sph(.3));
  }
  return g;
}
function makeToyViewer(el,w,h){
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setSize(w,h);el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(32,w/h,.05,20);
  scene.add(new THREE.HemisphereLight(0xffffff,0x2a1c1d,.7));
  const k=new THREE.DirectionalLight(0xfff0e0,1.2);k.position.set(2,3,3);scene.add(k);
  const r1=new THREE.DirectionalLight(0xC8A15A,.9);r1.position.set(-3,1,-2);scene.add(r1);
  const r2=new THREE.DirectionalLight(0xA01E2B,.6);r2.position.set(3,-1,-3);scene.add(r2);
  let obj=null,yaw=.4,pitch=.12,auto=true,raf=0,drag=null;const holder=new THREE.Group();scene.add(holder);
  function render(){cam.position.set(Math.sin(yaw)*Math.cos(pitch)*2.6,Math.sin(pitch)*2.6,Math.cos(yaw)*Math.cos(pitch)*2.6);cam.lookAt(0,0,0);renderer.render(scene,cam)}
  function loop(){if(auto)yaw+=.006;render();raf=requestAnimationFrame(loop)}
  const c=renderer.domElement;c.style.touchAction='none';c.style.cursor='grab';
  c.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};auto=false;c.setPointerCapture(e.pointerId)});
  c.addEventListener('pointermove',e=>{if(!drag)return;yaw-=(e.clientX-drag.x)*.012;pitch=Math.max(-1.2,Math.min(1.2,pitch+(e.clientY-drag.y)*.008));drag={x:e.clientX,y:e.clientY}});
  c.addEventListener('pointerup',()=>drag=null);
  return {setToy(kind,y){if(obj)holder.remove(obj);obj=buildToy(kind);holder.add(obj);if(y!=null)yaw=y},
    snapshot(){render();return renderer.domElement.toDataURL('image/jpeg',.85)},
    start(){auto=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;cancelAnimationFrame(raf);loop()},
    dispose(){cancelAnimationFrame(raf);renderer.dispose();c.remove()}};
}
