(()=>{
"use strict";
const D=window.WORLD_DATA;
const $=s=>document.querySelector(s);
const screens=["home","quiz","result","known","atlas","skills","sources"];
const N=["riku","sora","kai","saku","tsuki","nami"];
const NAVIS={
  correct:N.map(x=>`https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/${x}/fullbody/correct.png`),
  retry:N.map(x=>`https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/${x}/fullbody/retry.png`),
  complete:N.map(x=>`https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/characters/${x}/fullbody/complete.png`)
};
const safeJSON=(key)=>{try{return JSON.parse(localStorage.getItem(key)||"[]")}catch{return[]}};
const S={questions:[],i:0,score:0,answered:false,mode:"random",known:new Set(safeJSON("wq-known")),skills:new Set(safeJSON("wq-skills")),sessionKnown:new Set()};

function show(id){
  screens.forEach(x=>{const el=document.getElementById(x);if(el)el.classList.toggle("active",x===id)});
  window.scrollTo(0,0);
  if(id==="atlas")atlas();
  if(id==="skills")skills();
  if(id==="known")known();
  if(id==="sources")sources();
}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function save(){
  localStorage.setItem("wq-known",JSON.stringify([...S.known]));
  localStorage.setItem("wq-skills",JSON.stringify([...S.skills]));
  const n=$("#knownCount");if(n)n.textContent=S.known.size;
}
function make(mode="random"){
  const a=[];
  if(!D||!Array.isArray(D.countries))return a;
  D.countries.forEach(c=>{
    if(mode==="random"||mode==="flag")a.push({type:"flag",c,answer:c.name,q:"この国旗は、どこの国？",v:{k:"flag",src:c.flag}});
    if(mode==="random"||mode==="capital")a.push({type:"capital",c,answer:c.name,q:"この首都をもつ国はどこ？",v:{k:"text",caption:c.capital,kind:"首都"}});
    if(mode==="random"||mode==="continent")a.push({type:"continent",c,answer:c.continent,q:"この国がある大陸はどこ？",v:{k:"country",caption:c.name,flag:c.flag,kind:"大陸"}});
    ["place","heritage","culture","food","facility","nature","symbol"].forEach(k=>{
      if(mode!=="random"&&mode!==k)return;
      (c.items?.[k]||[]).forEach(it=>{
        const q=k==="food"?"この食べ物で知られている国はどこ？":
          k==="culture"?"この文化と関わりが深い国はどこ？":
          k==="heritage"?"この世界遺産がある国はどこ？":
          k==="nature"?"この自然の景観で知られる国はどこ？":
          k==="facility"?"この建物・施設がある国はどこ？":
          k==="symbol"?"このシンボル・特色と関わりが深い国はどこ？":"この場所がある国はどこ？";
        a.push({type:k,c,it,answer:c.name,q,v:it.image?{k:"image",src:it.image,alt:it.name,caption:it.name}:{k:"text",caption:it.name,kind:it.kind||""}});
      });
    });
  });
  return shuffle(a);
}
function opts(q){
  if(q.type==="continent"){
    const all=[...new Set(D.countries.map(c=>c.continent).filter(Boolean))];
    return shuffle([q.answer,...shuffle(all.filter(x=>x!==q.answer)).slice(0,3)]);
  }
  return shuffle([q.answer,...shuffle(D.countries.filter(c=>c.name!==q.answer).map(c=>c.name)).slice(0,3)]);
}
function render(){
  const q=S.questions[S.i];
  if(!q){finish();return}
  S.answered=false;
  $("#questionNumber").textContent=S.i+1;
  $("#questionTotal").textContent=S.questions.length;
  $("#categoryLabel").textContent=(D.categories.find(c=>c.id===q.type)||{}).label||"クイズ";
  $("#questionText").textContent=q.q;
  const v=$("#visual");
  if(q.v.k==="flag"){
    v.className="visual flag";
    v.innerHTML=`<img src="${q.v.src}" alt="国旗">`;
  }else if(q.v.k==="image"){
    v.className="visual image";
    v.innerHTML=`<img src="${q.v.src}" alt="${q.v.alt}" loading="lazy" decoding="async"><div class="visual-title">${q.v.caption}</div>`;
  }else if(q.v.k==="country"){
    v.className="visual text-first country-visual";
    v.innerHTML=`<img src="${q.v.flag}" alt="" aria-hidden="true"><div class="visual-title">${q.v.caption}</div><small class="visual-kind">${q.v.kind}</small>`;
  }else{
    v.className="visual text-first";
    v.innerHTML=`<div class="visual-title">${q.v.caption}</div><small class="visual-kind">${q.v.kind||""}</small>`;
  }
  $("#feedback").className="feedback";
  $("#feedback").innerHTML="";
  $("#nextBtn").classList.add("hidden");
  $("#options").innerHTML=opts(q).map((o,i)=>`<button type="button" class="option" data-v="${o}"><span class="letter">${String.fromCharCode(65+i)}</span><span>${o}</span></button>`).join("");
  document.querySelectorAll(".option").forEach(b=>b.addEventListener("click",()=>answer(b,q),{once:true}));
}
function answer(b,q){
  if(S.answered)return;
  S.answered=true;
  const ok=b.dataset.v===q.answer;
  if(ok){S.score++;S.skills.add(q.type)}
  S.known.add(q.c.id);S.sessionKnown.add(q.c.id);save();
  document.querySelectorAll(".option").forEach(x=>{
    x.disabled=true;
    if(x.dataset.v===q.answer)x.classList.add("correct");
  });
  if(!ok)b.classList.add("wrong","effect-wrong-shake");
  document.dispatchEvent(new CustomEvent(ok?"edu:correct":"edu:wrong",{detail:{type:q.type,country:q.c.id}}));\n  const f=$("#feedback"),pool=ok?NAVIS.correct:NAVIS.retry,n=pool[Math.floor(Math.random()*pool.length)];
  f.className="feedback show edu-answer-pop";
  f.innerHTML=`<div class="feedback-navi"><img src="${n}" alt=""></div><div class="feedback-copy">${ok?"<strong>正解！</strong> "+q.c.name+"です。":"<strong>正解は「"+q.answer+"」</strong>。答えを知ることも学びです。"}${q.it?.kind?"<br>"+q.it.kind+"。":""}</div>`;
  $("#nextBtn").classList.remove("hidden");
}
function start(mode="random"){
  const pool=make(mode);
  if(!pool.length)return;
  S.mode=mode;S.questions=pool.slice(0,10);S.i=0;S.score=0;S.sessionKnown=new Set();
  show("quiz");render();
}
function finish(){
  show("result");
  $("#resultNavi").src=NAVIS.complete[Math.floor(Math.random()*NAVIS.complete.length)];
  $("#score").textContent=S.score;$("#resultTotal").textContent=S.questions.length;
  $("#resultMessage").textContent=S.score===S.questions.length?"すべて正解！世界の見え方がひとつ広がりました。":"知らない問題があっても大丈夫。答えを知ることもWORLD QUESTの学びです。";
  $("#resultCountries").innerHTML=[...S.sessionKnown].map(id=>{const c=D.countries.find(x=>x.id===id);return c?`<span class="chip">${c.shortName||c.name}</span>`:""}).join("");
}
function atlas(){
  const cats=D.categories.filter(c=>!["flag","capital","continent"].includes(c.id));
  let html="";
  D.countries.forEach((c,i)=>{
    html+=`<article class="atlas-card"><button type="button" class="atlas-country" aria-expanded="false" aria-controls="atlas-country-${i}"><span class="atlas-country-name"><img src="${c.flag}" alt="" aria-hidden="true"><strong>${c.name}</strong></span><span class="atlas-chevron" aria-hidden="true">＋</span></button><div id="atlas-country-${i}" class="atlas-country-detail" hidden><div class="atlas-meta"><span>${c.region}</span><span>${c.continent}</span><span>首都 ${c.capital}</span></div><div class="atlas-grid">`;
    cats.forEach(cat=>(c.items?.[cat.id]||[]).forEach(it=>{html+=`<div class="atlas-item">${it.image?`<img src="${it.image}" alt="" loading="lazy">`:""}<div><b>${cat.label}</b><strong>${it.name}</strong><small>${it.kind||""}</small></div></div>`}));
    html+=`</div><a class="atlas-search" href="https://www.google.com/search?q=${encodeURIComponent(c.name+" について")}" target="_blank" rel="noopener">詳しく調べる 🔍</a></div></article>`;
  });
  $("#atlasList").innerHTML=html;
  document.querySelectorAll(".atlas-country").forEach(b=>b.addEventListener("click",()=>{
    const p=document.getElementById(b.getAttribute("aria-controls")),open=b.getAttribute("aria-expanded")==="true";
    b.setAttribute("aria-expanded",String(!open));b.querySelector(".atlas-chevron").textContent=open?"＋":"−";p.hidden=open;
  }));
}
function skills(){
  const all=[["flag","国旗を見て、国を答えられる"],["capital","首都から国を答えられる"],["continent","国がどの大陸にあるか答えられる"],["place","世界の有名な場所を知っている"],["heritage","世界遺産と国を結びつけられる"],["culture","国と文化を結びつけられる"],["food","国と食文化を結びつけられる"],["facility","国と建物・施設を結びつけられる"],["nature","国と自然を結びつけられる"],["symbol","国のシンボルや特色を知っている"]];
  $("#skillsList").innerHTML=all.map(([id,text])=>`<div class="skill-row ${S.skills.has(id)?"earned":"locked"}"><span class="skill-mark">${S.skills.has(id)?"✓":"—"}</span><div><strong>${text}</strong><small>${S.skills.has(id)?"クイズで正解しました":"クイズで正解すると追加されます"}</small></div></div>`).join("");
}
function sources(){
  let html='<div class="source-card"><strong>国旗</strong>リポジトリ内のassets/flagsに保存した国旗SVGを使用しています。元データ：hampusborgos/country-flags。</div>';
  D.countries.forEach(c=>Object.keys(c.items||{}).forEach(cat=>(c.items[cat]||[]).forEach(it=>{if(it.image)html+=`<div class="source-card"><strong>${c.name}：${it.name}</strong>${it.credit?"作者："+it.credit+" / ":""}${it.license?"ライセンス："+it.license+" / ":""}出典：${it.source||"Wikimedia Commons"}<br><a href="${it.sourceImage||it.image}" target="_blank" rel="noopener">画像・ライセンス確認</a></div>`})));
  html+='<div class="source-card"><strong>ナビキャラ</strong>TT-sensei / NAVI CHARACTERのWeb教材用素材を参照しています。<br><a href="https://github.com/TT-sensei/navi-character-/" target="_blank" rel="noopener">NAVI CHARACTER</a></div><div class="source-card"><strong>世界遺産</strong>登録情報の確認先：UNESCO World Heritage Centre<br><a href="https://whc.unesco.org/" target="_blank" rel="noopener">UNESCO World Heritage Centre</a></div>';
  $("#sourceList").innerHTML=html;
}
function known(){
  $("#knownList").innerHTML=D.countries.filter(c=>S.known.has(c.id)).map(c=>`<div class="known-card"><img src="${c.flag}" alt=""><strong>${c.shortName||c.name}</strong><small>${c.region} / ${c.capital}</small></div>`).join("")||'<div class="known-card"><strong>まだありません</strong><small>クイズに挑戦して、世界を知ろう。</small></div>';
}
function init(){
  if(!D||!Array.isArray(D.countries)||!Array.isArray(D.categories)){console.error("WORLD QUEST: data not ready");return}
  $("#startBtn").addEventListener("click",()=>start("random"));
  document.querySelectorAll(".quiz-menu-btn").forEach(b=>b.addEventListener("click",()=>start(b.dataset.quizType)));
  $("#atlasBtn").addEventListener("click",()=>show("atlas"));
  $("#sourceBack").addEventListener("click",()=>show("home"));
  $("#atlasBack").addEventListener("click",()=>show("home"));
  $("#skillsBack").addEventListener("click",()=>show("home"));
  $("#againBtn").addEventListener("click",()=>start(S.mode));
  $("#homeBtn").addEventListener("click",()=>show("home"));
  $("#quitBtn").addEventListener("click",()=>show("home"));
  $("#progressBtn").addEventListener("click",()=>show("known"));
  $("#knownBack").addEventListener("click",()=>show("home"));
  $("#nextBtn").addEventListener("click",()=>{S.i++;S.i>=S.questions.length?finish():render()});
  save();
}
init();
})();