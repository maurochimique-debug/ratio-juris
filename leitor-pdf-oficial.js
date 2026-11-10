/* Leitura local de PDFs escolhidos pelo usuário. Sem upload ao servidor, sem corpus inventado.
   PDF.js © Mozilla contributors, Apache-2.0. CDN versão fixa, carregada somente quando solicitada.
   Os textos são extraídos na sessão do navegador e nunca são gravados em localStorage. */
(function(){
 "use strict";
 const $=id=>document.getElementById(id);
 const PDF_LIB="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.4.299/pdf.min.mjs";
 const PDF_WORKER="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.4.299/pdf.worker.min.mjs";
 let documento=null;
 let cache=new Map();
 let trechoAtual="";
 let carregando=false;
 let buscaAtual=0;
 let identidadeDocumento="";
 function avisar(msg){const el=$("pdfLeitorStatus");if(el)el.textContent=String(msg||"");}
 function limpar(){
   buscaAtual++;
   identidadeDocumento="";
   documento=null;
   cache.clear();
   trechoAtual="";
   const input=$("pdfOficialLocal");if(input)input.value="";
   const tela=$("pdfTextoExtraido");if(tela)tela.textContent="";
   const pagina=$("pdfPaginaSelect");if(pagina)pagina.replaceChildren();
   const controles=$("pdfLeitorControles");if(controles)controles.classList.add("hidden");
   avisar("Selecione o PDF oficial correspondente ao exame e ao tipo de caderno atuais.");
 }
 async function carregar(){
   if(carregando){avisar("Uma prova já está sendo preparada. Aguarde o resultado.");return false;}
   const file=$("pdfOficialLocal")?.files?.[0];
   if(!file){avisar("Escolha primeiro o arquivo PDF oficial do caderno em seu dispositivo.");return false;}
   if(!/\.pdf$/i.test(file.name)&&file.type!=="application/pdf"){
     avisar("Arquivo inválido: selecione um PDF.");return false;
   }
   if(file.size>35*1024*1024){avisar("O PDF selecionado excede o limite local de 35 MB.");return false;}
   carregando=true;
   const button=$("btnCarregarPdfAcessivel");
   if(button)button.disabled=true;
   const examAtStart=$("oabExamSelect")?.value;
   const typeAtStart=$("oabTipoSelect")?.value;
   try {
     avisar("Preparando o PDF no navegador. Nenhum arquivo será enviado ao servidor.");
     const pdfjs=await import(PDF_LIB);
     pdfjs.GlobalWorkerOptions.workerSrc=PDF_WORKER;
     const bytes=new Uint8Array(await file.arrayBuffer());
     const loadingTask=pdfjs.getDocument({data:bytes});
     const parsed=await loadingTask.promise;
     if(examAtStart!==$("oabExamSelect")?.value||typeAtStart!==$("oabTipoSelect")?.value){
       avisar("O exame ou o caderno mudou durante a leitura. Selecione novamente o PDF correspondente.");
       return false;
     }
     documento=parsed;
     identidadeDocumento="arquivo-local";
     cache.clear();
     trechoAtual="";
     const selector=$("pdfPaginaSelect");
     selector.replaceChildren();
     for(let i=1;i<=documento.numPages;i++){
       const option=document.createElement("option");
       option.value=String(i);
       option.textContent="Página "+i;
       selector.appendChild(option);
     }
     selector.value="1";
     $("pdfLeitorControles").classList.remove("hidden");
     await mostrarPagina(1);
     avisar("PDF carregado localmente: "+documento.numPages+
       " páginas. O conteúdo textual não foi verificado automaticamente contra a fonte da banca; confira se é o caderno certo.");
     return true;
   }catch(err){
     documento=null;
     cache.clear();
     trechoAtual="";
     if($("pdfLeitorControles"))$("pdfLeitorControles").classList.add("hidden");
     avisar("Não foi possível extrair o texto do PDF neste navegador. "+
       "Você pode usar o link do PDF oficial e o leitor de documentos do sistema. "+
       "A extração depende do PDF.js, da conexão com a biblioteca e de texto selecionável.");
     return false;
   }finally {
     carregando=false;
     if(button)button.disabled=false;
   }
 }
 async function carregarOficial(){
   if(carregando){avisar("Uma prova já está sendo preparada. Aguarde a conclusão.");return false;}
   const exame=$("oabExamSelect")?.value,tipo=$("oabTipoSelect")?.value;
   if(!/^\d{2}$/.test(exame||"")||! /^[1-4]$/.test(tipo||"")){
     avisar("Selecione primeiro um exame e o tipo de caderno.");return false;
   }
   const allowed=window.RATIO_OAB_DATA?.["exam"+exame];
   const book=allowed?.cadernos?.[Number(tipo)-1];
   if(!book?.pdf||!book.pdf.startsWith("https://s.oab.org.br/arquivos/")){
     avisar("Esta edição ainda não possui PDF oficial verificado no acervo.");return false;
   }
   carregando=true;
   const button=$("btnCarregarPdfOficial");
   if(button)button.disabled=true;
   let parsed;
   try {
     avisar("Abrindo a prova original dentro do RatioJuris. Não é necessário baixar ou enviar arquivo.");
     const pdfjs=await import(PDF_LIB);
     pdfjs.GlobalWorkerOptions.workerSrc=PDF_WORKER;
     const url="/api/oab-pdf?exame="+exame+"&tipo="+tipo;
     const task=pdfjs.getDocument({url,rangeChunkSize:65536});
     parsed=await task.promise;
     if(exame!==$("oabExamSelect")?.value||tipo!==$("oabTipoSelect")?.value){
       await parsed.destroy?.();
       avisar("A prova selecionada mudou. Selecione novamente o caderno para carregar seu texto.");
       return false;
     }
     const antigo=documento;
     documento=parsed;
     identidadeDocumento=exame+"-"+tipo;
     cache.clear();trechoAtual="";
     try{if(antigo&&antigo!==parsed)await antigo.destroy?.()}catch(_){}
     const selector=$("pdfPaginaSelect");selector.replaceChildren();
     for(let i=1;i<=documento.numPages;i++){
       const option=document.createElement("option");
       option.value=String(i);option.textContent="Página "+i;selector.appendChild(option);
     }
     selector.value="1";
     $("pdfLeitorControles").classList.remove("hidden");
     await mostrarPagina(1);
     avisar("Caderno oficial "+exame+"º, Tipo "+tipo+", carregado dentro do aplicativo ("+
       documento.numPages+" páginas). O texto extraído depende da estrutura do PDF da OAB.");
     return true;
   }catch(_){
     if(parsed)try{await parsed.destroy?.()}catch(_){}
     documento=null;cache.clear();trechoAtual="";
     $("pdfLeitorControles")?.classList.add("hidden");
     avisar("Não foi possível carregar o texto oficial nesta conexão. Use a prova integrada acima ou o link direto da OAB. Nenhuma questão será substituída por conteúdo inventado.");
     return false;
   }finally {
     carregando=false;
     if(button)button.disabled=false;
   }
 }
 async function textoPagina(pageNo){
   if(!documento)return "";
   const numero=Number(pageNo);
   if(!Number.isInteger(numero)||numero<1||numero>documento.numPages)return "";
   if(cache.has(numero))return cache.get(numero);
   const page=await documento.getPage(numero);
   const text=await page.getTextContent();
   let result="";
   for(const item of text.items){
     if(typeof item.str!=="string")continue;
     result+=item.str;
     result+=item.hasEOL?"\n":" ";
   }
   const cleaned=result.replace(/[ \t]+\n/g,"\n").replace(/\n[ \t]+/g,"\n").trim();
   cache.set(numero,cleaned);
   return cleaned;
 }
 async function mostrarPagina(n){
   if(!documento){avisar("Carregue um PDF do caderno oficial primeiro.");return false;}
   const number=Number(n);
   if(!Number.isInteger(number)||number<1||number>documento.numPages)return false;
   try{
     avisar("Extraindo texto da página "+number+".");
     const txt=await textoPagina(number);
     trechoAtual=txt;
     $("pdfPaginaSelect").value=String(number);
     const target=$("pdfTextoExtraido");
     target.textContent=txt||"Esta página não contém texto selecionável que o leitor consiga extrair.";
     if(!txt)avisar("Página "+number+" sem texto extraível. Pode ser imagem digitalizada.");
     else avisar("Página "+number+" de "+documento.numPages+" pronta para leitura acessível.");
     return true;
   }catch(_){
     avisar("Não foi possível ler a página selecionada.");
     return false;
   }
 }
 function extrairTrechoQuestao(texto,numero){
   if(!texto)return null;
   const n=Number(numero);
   if(!Number.isInteger(n)||n<1||n>80)return null;
   // Questões podem aparecer como "Questão 1", "QUESTÃO 01" ou número isolado.
   const pad=String(n).padStart(2,"0");
   const explicit=new RegExp("\\bquest[aã]o\\s*0*"+n+"\\b","i");
   let found=explicit.exec(texto);
   if(!found) {
     const numeric=new RegExp("(?:^|\\n)\\s*(?:"+n+"|"+pad+")\\s*(?:\\n|$)");
     found=numeric.exec(texto);
   }
   if(!found)return null;
   const offset=found.index;
   const rest=texto.slice(offset);
   const next=n+1;
   const nextRegex=new RegExp("(?:\\bquest[aã]o\\s*0*"+next+"\\b)|(?:\\n\\s*0*"+next+"\\s*\\n)","i");
   const nextMatch=nextRegex.exec(rest.slice(Math.max(1,found[0].length)));
   let candidate=nextMatch?
     rest.slice(0,Math.max(found[0].length,found[0].length+nextMatch.index)):rest;
   candidate=candidate.trim();
   return candidate.length>=30?candidate:null;
 }
 async function localizarQuestao(){
   const token=++buscaAtual;
   if(!documento){avisar("Carregue o PDF original da prova para localizar a questão.");return false;}
   const n=Number($("questaoOficialNumeroSelect")?.value||1);
   if(!Number.isInteger(n)||n<1||n>80)return false;
   avisar("Procurando questão "+n+" no texto extraível do PDF local.");
   for(let pageNo=1;pageNo<=documento.numPages;pageNo++){
     try{
       const full=await textoPagina(pageNo);
       if(token!==buscaAtual||String(n)!==$("questaoOficialNumeroSelect")?.value)return false;
       const excerpt=extrairTrechoQuestao(full,n);
       if(excerpt){
         $("pdfPaginaSelect").value=String(pageNo);
         trechoAtual=excerpt;
         $("pdfTextoExtraido").textContent=excerpt;
         const preview=$("textoQuestaoDentroSimulador");
         if(preview){
           preview._ratioQuestaoAnterior=$("oabExamSelect")?.value+"-"+$("oabTipoSelect")?.value+"-"+n;
           preview.textContent=excerpt;
           preview.focus();
         }else $("pdfTextoExtraido").focus();
         avisar("Possível localização da questão "+n+" na página "+pageNo+
           ". Confira o enunciado e as alternativas com o PDF original; a extração de colunas pode alterar a ordem.");
         return true;
       }
     }catch(_){}
   }
   avisar("A questão "+n+" não foi identificada automaticamente. "+
     "Use o seletor de páginas do PDF; a numeração pode não ser extraível na diagramação original.");
   return false;
 }
 async function estudarQuestaoAtual(){
   const exame=$("oabExamSelect")?.value,tipo=$("oabTipoSelect")?.value;
   if(!/^\d{2}$/.test(exame||"")||! /^[1-4]$/.test(tipo||"")){
     avisar("Selecione um exame oficial e o caderno primeiro.");return false;
   }
   if(!documento||identidadeDocumento!==exame+"-"+tipo){
     // Um arquivo local continua como alternativa, mas o fluxo padrão é direto da fonte oficial.
     if(documento)limpar();
     const loaded=await carregarOficial();
     if(!loaded)return false;
   }
   return localizarQuestao();
 }
 function ouvirTrecho(){
   if(!trechoAtual){avisar("Não existe texto extraído para ler.");return false;}
   if(!window.RatioA11y?.voiceText){
     avisar("Leitura por voz indisponível. O texto permanece disponível na página.");
     return false;
   }
   if(trechoAtual.length>3200){
     avisar("O texto desta página é longo. Serão lidos os primeiros 3.200 caracteres. "+
       "Para uma questão específica, utilize Localizar questão atual.");
   }
   return window.RatioA11y.voiceText(trechoAtual.slice(0,3200));
 }
 document.addEventListener("change",function(event){
   if(["oabExamSelect","oabTipoSelect"].includes(event.target?.id)&&documento)limpar();
 });
 window.RatioPdfAcessivel={carregar,carregarOficial,estudarQuestaoAtual,limpar,mostrarPagina,localizarQuestao,ouvirTrecho,extrairTrechoQuestao};
})();
