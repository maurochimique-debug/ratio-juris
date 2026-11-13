/* RatioJuris: consulta documental de magistratura — fontes fixas e verificadas. */
(function(){
 "use strict";
 const $=id=>document.getElementById(id);
 const documentos=Object.freeze({
  prova:{url:"/api/magistratura-pdf?documento=tjsp189-prova1",original:"https://documento.vunesp.com.br/documento/stream/MjQwOTM0MQ%3D%3D",titulo:"189º TJSP — prova objetiva completa (100 questões)",start:2},
  gabarito:{url:"/api/magistratura-pdf?documento=tjsp189-gabarito",original:"https://documento.vunesp.com.br/documento/stream/MjY1Mjc0Nw%3D%3D",titulo:"189º TJSP — gabarito definitivo por versão",start:1}
 });
 function fechar(){
   const frame=$("magistraturaPdfFrame");
   window.RatioMobilePdf?.close(frame);
   frame?.removeAttribute("src");
   $("magistraturaVisualizador")?.classList.add("hidden");
 }
 function abrir(tipo){
   const doc=documentos[tipo],panel=$("magistraturaVisualizador"),frame=$("magistraturaPdfFrame");
   if(!doc||!panel||!frame)return false;
   fechar();
   panel.classList.remove("hidden");
   $("magistraturaPdfFonte").href=doc.original;
   $("magistraturaPdfStatus").textContent=doc.titulo+".";
   frame.title=doc.titulo;
   if(window.RatioMobilePdf?.isMobile())window.RatioMobilePdf.mount(frame,doc.url,doc.original,doc.start).catch(()=>{
     $("magistraturaPdfStatus").textContent="Leitor interno indisponível. Utilize o documento da VUNESP.";
   });
   else frame.src=doc.url+"#page="+doc.start+"&toolbar=1&navpanes=0";
   panel.scrollIntoView({behavior:"auto",block:"nearest"});
   return true;
 }
 window.RatioMagistratura={abrir,fechar};
})();