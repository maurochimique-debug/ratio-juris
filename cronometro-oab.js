/* RATIO JURIS — Cronômetro opcional de treino. Não altera gabaritos nem respostas. */
(function(){
 "use strict";
 const $=id=>document.getElementById(id);
 const KEY="ratio_tempo_treino_v1";
 let active=false, last=0, timer=null, stateKey="", question=1;
 let record={total:0,perQuestion:{},answered:{}};
 const now=()=>Date.now();
 const key=()=>String($("oabExamSelect")?.value||"")+"-"+String($("oabTipoSelect")?.value||"");
 const questionNumber=()=>Number($("questaoOficialNumeroSelect")?.value||1);
 const fmt=ms=>{
  const seconds=Math.floor(Math.max(0,ms)/1000);
  return String(Math.floor(seconds/3600)).padStart(2,"0")+":"+
   String(Math.floor(seconds%3600/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0");
 };
 function savedKey(){return KEY+"_"+stateKey;}
 function persist(){
  if(!stateKey)return;
  try{localStorage.setItem(savedKey(),JSON.stringify(record));}catch(_){}
 }
 function read(){
  try{
   const saved=JSON.parse(localStorage.getItem(savedKey())||"null");
   if(saved&&Number.isFinite(saved.total)&&saved.total>=0&&
      saved.perQuestion&&typeof saved.perQuestion==="object"&&
      saved.answered&&typeof saved.answered==="object")return saved;
  }catch(_){}
  return {total:0,perQuestion:{},answered:{}};
 }
 function accumulate(){
  if(!active)return;
  const t=now(),dt=Math.max(0,Math.min(t-last,60000));
  last=t;
  record.total+=dt;
  record.perQuestion[question]=(Number(record.perQuestion[question])||0)+dt;
 }
 function render(){
  if(!$("rjTempoTotal"))return;
  $("rjTempoTotal").textContent=fmt(record.total);
  $("rjTempoQuestao").textContent=fmt(record.perQuestion[question]||0);
  const times=Object.values(record.answered).map(Number).filter(v=>Number.isFinite(v)&&v>=0);
  $("rjTempoMedio").textContent=times.length?fmt(times.reduce((sum,v)=>sum+v,0)/times.length):"—";
  $("rjTempoRespondidas").textContent=String(times.length);
  $("rjTempoEstado").textContent=active?"Contando tempo da questão "+question+".":"Cronômetro pausado.";
  $("rjTempoIniciar").disabled=active;
  $("rjTempoPausar").disabled=!active;
 }
 function switchContext(){
  const k=key(),q=questionNumber();
  if(k!==stateKey){
   accumulate();persist();active=false;
   stateKey=k;record=read();question=q;last=now();render();return;
  }
  if(Number.isInteger(q)&&q>=1&&q<=80&&q!==question){
   accumulate();question=q;last=now();persist();render();
  }
 }
 function begin(){switchContext();if(active)return;last=now();active=true;render();}
 function pause(){accumulate();active=false;persist();render();}
 function reset(){
  pause();record={total:0,perQuestion:{},answered:{}};persist();render();
 }
 function answered(){
  switchContext();
  if(!active||record.answered[question]!=null)return;
  accumulate();
  record.answered[question]=record.perQuestion[question]||0;
  persist();render();
 }
 function init(){
  stateKey=key();question=questionNumber();record=read();last=now();
  $("rjTempoIniciar")?.addEventListener("click",begin);
  $("rjTempoPausar")?.addEventListener("click",pause);
  $("rjTempoZerar")?.addEventListener("click",reset);
  document.addEventListener("visibilitychange",()=>{if(document.hidden)pause();});
  window.addEventListener("pagehide",pause);
  timer=setInterval(()=>{if(active){accumulate();render();persist();}},1000);
  render();
 }
 window.RatioCronometro={questaoAlterada:switchContext,respostaRegistrada:answered,iniciar:begin,pausar:pause,zerar:reset};
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
 else init();
})();
