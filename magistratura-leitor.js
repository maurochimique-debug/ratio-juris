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
 let atual="prova";
 function alternativo(){
   const doc=documentos[atual],frame=$("magistraturaPdfFrame");
   if(!doc||!frame)return false;
   window.RatioMobilePdf?.close(frame);
   // Visualização alternativa de documento público; requer conexão com Google.
   const url="https://docs.google.com/gview?embedded=1&url="+encodeURIComponent(doc.original);
   frame.hidden=false;frame.classList.remove("hidden");frame.src=url;
   $("magistraturaPdfStatus").textContent=doc.titulo+
     " — visualizador alternativo. Deslize para consultar todas as páginas. Se não funcionar, abra o PDF original.";
   return true;
 }
 function abrir(tipo){
   const doc=documentos[tipo],panel=$("magistraturaVisualizador"),frame=$("magistraturaPdfFrame");
   if(!doc||!panel||!frame)return false;
   fechar();atual=tipo;
   panel.classList.remove("hidden");
   $("magistraturaPdfFonte").href=doc.original;
   $("magistraturaPdfStatus").textContent=doc.titulo+".";
   frame.title=doc.titulo;
   if(window.RatioMobilePdf?.isMobile()){
     // O host da VUNESP bloqueia algumas requisições de servidores na nuvem;
     // nesse caso usar visualizador independente, sem alterar as respostas.
     alternativo();
   }else{
     frame.src=doc.original+"#page="+doc.start+"&toolbar=1&navpanes=0";
   }
   panel.scrollIntoView({behavior:"auto",block:"nearest"});
   return true;
 }
 window.RatioMagistratura={abrir,fechar,alternativo};
})();