/* Consulta de provas oficiais STJ 2018 — Analista Judiciário, área Judiciária (cargo 7).
   Não gera questões nem gabaritos; documentos completos são exibidos em PDF. */
(function(){
 "use strict";
 const $=id=>document.getElementById(id);
 const docs=Object.freeze({
  "basicos":{label:"STJ 2018 — Conhecimentos básicos, cargos 7 e 8 (itens 1–40)",url:"https://cdn.cebraspe.org.br/concursos/STJ_18/arquivos/MATRIZ_385_STJCB1__PAG_3.PDF"},
  "especificos":{label:"STJ 2018 — Conhecimentos específicos, cargo 7 — Direito (itens 41–120)",url:"https://cdn.cebraspe.org.br/concursos/STJ_18/arquivos/MATRIZ_385_STJ007__PAG_4.PDF"},
  "gabarito-basicos":{label:"STJ 2018 — Gabarito definitivo, conhecimentos básicos",url:"https://cdn.cebraspe.org.br/concursos/STJ_18/arquivos/GAB_DEFINITIVO_385_STJCB1.PDF"},
  "gabarito-especificos":{label:"STJ 2018 — Gabarito definitivo, conhecimentos específicos cargo 7",url:"https://cdn.cebraspe.org.br/concursos/STJ_18/arquivos/GAB_DEFINITIVO_385_STJ007.PDF"}
 });
 function fechar(){
  const frame=$("stjPdfFrame"),panel=$("stjVisualizador");
  window.RatioMobilePdf?.close(frame);
  if(frame)frame.removeAttribute("src");
  if(panel)panel.classList.add("hidden");
 }
 function abrir(tipo){
  const info=docs[tipo],frame=$("stjPdfFrame"),panel=$("stjVisualizador");
  if(!info||!frame||!panel)return false;
  fechar();
  panel.classList.remove("hidden");
  $("stjPdfStatus").textContent=info.label;
  $("stjPdfFonte").href=info.url;
  frame.title=info.label;
  const proxy="/api/stj-provas?documento="+encodeURIComponent(tipo);
  if(window.RatioMobilePdf?.isMobile()){
   window.RatioMobilePdf.mount(frame,proxy,info.url,1).then(ok=>{
    if(!ok&&panel&&!panel.classList.contains("hidden"))
     $("stjPdfStatus").textContent="Não foi possível abrir o leitor interno. Utilize o link direto à prova oficial.";
   }).catch(()=>{});
  }else frame.src=proxy+"#toolbar=1&navpanes=0";
  panel.scrollIntoView({behavior:"auto",block:"nearest"});
  return true;
 }
 window.RatioSTJ={abrir,fechar};
})();