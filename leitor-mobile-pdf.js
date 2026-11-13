/* RatioJuris: leitor de PDF por páginas para navegadores móveis.
 * Mantém os iframes originais no desktop e usa PDF.js no celular.
 * Apenas solicita documentos oficiais previamente cadastrados pelo app.
 */
(function(){
 "use strict";
 const instances=new WeakMap();
 const LIB="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";
 const WORKER="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";
 const mobile=()=>window.matchMedia?.("(max-width: 800px)")?.matches===true;
 let serial=0;
 function close(frame){
  if(!frame)return;
  const old=instances.get(frame);
  if(old){
   old.alive=false;
   try{old.task?.destroy?.()}catch(_){}
   try{old.document?.destroy?.()}catch(_){}
   old.host?.remove();
   instances.delete(frame);
  }
  frame.hidden=false;frame.classList.remove("hidden");
 }
 async function mount(frame,url,originalUrl,startPage=1){
  if(!frame||!mobile())return false;
  close(frame);
  if(!/^\/api\/(?:oab-pdf|oab-gabarito|magistratura-pdf)\?/.test(url))return false;
  const state={alive:true,id:++serial,page:1,total:0,task:null,document:null};
  instances.set(frame,state);
  frame.hidden=true;frame.classList.add("hidden");
  const host=document.createElement("div");
  host.className="mt-3 rounded-lg border border-purple-500 p-3 bg-white text-slate-900";
  host.setAttribute("role","region");host.setAttribute("aria-label","Leitor móvel de páginas do PDF oficial");
  state.host=host;
  const info=document.createElement("p");info.className="mb-2 text-sm font-semibold";info.setAttribute("role","status");info.textContent="Preparando páginas do documento oficial...";
  const controls=document.createElement("div");controls.className="flex flex-wrap gap-2 items-center mb-3";
  const prev=document.createElement("button"),next=document.createElement("button"),label=document.createElement("span");
  for(const button of [prev,next]){
   button.type="button";button.className="min-h-[44px] px-4 py-2 border border-purple-600 rounded-lg font-bold text-purple-800";
   button.disabled=true;
  }
  prev.textContent="Página anterior";next.textContent="Próxima página";label.className="font-bold text-sm";label.setAttribute("aria-live","polite");
  controls.append(prev,label,next);
  const canvas=document.createElement("canvas");canvas.className="block w-full h-auto";canvas.setAttribute("role","img");canvas.setAttribute("aria-label","Página do caderno oficial");
  const fallback=document.createElement("a");fallback.href=originalUrl||url;fallback.target="_blank";fallback.rel="noopener noreferrer";fallback.textContent="Abrir documento completo na fonte oficial";fallback.className="mt-3 inline-block underline font-bold text-sm text-purple-800";
  host.append(info,controls,canvas,fallback);frame.insertAdjacentElement("afterend",host);
  let rendering=false;
  async function show(n){
   if(!state.alive||!state.document||rendering||n<1||n>state.total)return;
   rendering=true;prev.disabled=next.disabled=true;
   try{
    const page=await state.document.getPage(n);
    if(!state.alive)return;
    const width=Math.max(250,host.clientWidth-24);
    const natural=page.getViewport({scale:1});
    const zoom=Math.min(2.1,Math.max(.5,width/natural.width));
    const density=Math.min(1.5,window.devicePixelRatio||1);
    const viewport=page.getViewport({scale:zoom*density});
    canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
    const context=canvas.getContext("2d",{alpha:false});
    await page.render({canvasContext:context,viewport}).promise;
    if(!state.alive)return;
    state.page=n;label.textContent="Página "+n+" de "+state.total;
    info.textContent="Prova oficial — navegue entre todas as páginas pelos botões.";
   }catch(_){info.textContent="Não foi possível renderizar esta página. Abra o PDF na fonte oficial.";}
   finally{
    rendering=false;
    if(state.alive){prev.disabled=state.page<=1;next.disabled=state.page>=state.total;}
   }
  }
  prev.addEventListener("click",()=>show(state.page-1));next.addEventListener("click",()=>show(state.page+1));
  try{
   const mod=await import(LIB);
   if(!state.alive)return false;
   mod.GlobalWorkerOptions.workerSrc=WORKER;
   state.task=mod.getDocument({url:url.split("#")[0],disableRange:true,disableStream:true,useSystemFonts:true,disableFontFace:true});
   state.document=await state.task.promise;
   if(!state.alive)return false;
   state.total=state.document.numPages;
   await show(Math.min(Math.max(1,Number(startPage)||1),state.total));
   return true;
  }catch(_){
   if(state.alive){
    info.textContent="O navegador não conseguiu carregar o leitor paginado. Abra o PDF completo na fonte oficial.";
    prev.disabled=next.disabled=true;
   }
   return false;
  }
 }
 window.RatioMobilePdf={mount,close,isMobile:mobile};
})();