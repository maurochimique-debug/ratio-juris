/* Leitura local de PDFs escolhidos pelo usuário. Sem upload ao servidor, sem corpus inventado.
   PDF.js © Mozilla contributors, Apache-2.0. CDN versão fixa, carregada somente quando solicitada.
   Os textos são extraídos na sessão do navegador e nunca são gravados em localStorage. */
(function(){
 "use strict";
 const $=id=>document.getElementById(id);
 const PDF_LIB="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";
 const PDF_WORKER="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";
 let documento=null;
 let cache=new Map();
 let cacheQuestoes=new Map();
 let trechoAtual="";
 let carregando=false;
 let promessaOficial=null;
 let buscaAtual=0;
 let identidadeDocumento="";
 let versaoSelecao=0;
 function avisar(msg){
   const texto=String(msg||"");
   const el=$("pdfLeitorStatus");if(el)el.textContent=texto;
   const avisoSimulador=$("statusLocalizacaoQuestao");if(avisoSimulador)avisoSimulador.textContent=texto;
 }
 function exibirDocumentoNoCard(exame,tipo,mensagem){
   if(String($("oabExamSelect")?.value)!==String(exame)||
      String($("oabTipoSelect")?.value)!==String(tipo))return false;
   const wrap=$("fallbackEnunciado"),frame=$("fallbackEnunciadoPdf");
   const link=$("questaoPdfLinkVisivel");
   const book=window.RATIO_OAB_DATA?.["exam"+exame]?.cadernos?.[Number(tipo)-1];
   if(!book?.pdf)return false;
   if(link){link.href=book.pdf;link.classList.remove("hidden");}
   if(wrap&&frame){
     wrap.classList.remove("hidden");
     const url="/api/oab-pdf?exame="+encodeURIComponent(exame)+
       "&tipo="+encodeURIComponent(tipo)+"&fallback="+Date.now()+"#toolbar=1&navpanes=0";
     if(frame.getAttribute("src")!==url)frame.src=url;
     frame.title="Caderno oficial do "+exame+"º Exame, Tipo "+tipo+" — consulta do enunciado";
   }
   const preview=$("textoQuestaoDentroSimulador");
   if(preview){preview.textContent=mensagem;preview.setAttribute("data-extracao-validada","nao");}
   const card=$("cardEnunciadoCompleto");if(card)card.open=true;
   return true;
 }
 function limpar(){
   versaoSelecao++;
   buscaAtual++;
   identidadeDocumento="";
   const anterior=documento;
   documento=null;
   if(anterior)Promise.resolve(anterior.destroy?.()).catch(()=>{});
   cache.clear();
   cacheQuestoes.clear();
   trechoAtual="";
   const input=$("pdfOficialLocal");if(input)input.value="";
   const tela=$("pdfTextoExtraido");if(tela)tela.textContent="";
   const pagina=$("pdfPaginaSelect");if(pagina)pagina.replaceChildren();
   const controles=$("pdfLeitorControles");if(controles)controles.classList.add("hidden");
   avisar("Selecione o PDF oficial correspondente ao exame e ao tipo de caderno atuais.");
 }
 async function carregar(){
   const panel=$("detalhesLeitorPdf");if(panel)panel.open=true;
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
   const versao=versaoSelecao;
   try {
     avisar("Preparando o PDF no navegador. Nenhum arquivo será enviado ao servidor.");
     const pdfjs=await import(PDF_LIB);
     pdfjs.GlobalWorkerOptions.workerSrc=PDF_WORKER;
     const bytes=new Uint8Array(await file.arrayBuffer());
     const loadingTask=pdfjs.getDocument({data:bytes,useSystemFonts:true,disableFontFace:true});
     const parsed=await loadingTask.promise;
     if(versao!==versaoSelecao||examAtStart!==$("oabExamSelect")?.value||typeAtStart!==$("oabTipoSelect")?.value){
       await parsed.destroy?.();
       avisar("O exame ou o caderno mudou durante a leitura. Selecione novamente o PDF correspondente.");
       return false;
     }
     documento=parsed;
     identidadeDocumento="arquivo-local";
     cache.clear();
     cacheQuestoes.clear();
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
   // Carregamentos automáticos não expandem painéis extras na tela de estudo.
   if(carregando){avisar("Uma prova já está sendo preparada. Aguarde a conclusão.");return false;}
   const exame=$("oabExamSelect")?.value,tipo=$("oabTipoSelect")?.value;
   if(!/^\d{2}$/.test(exame||"")||! /^[1-4]$/.test(tipo||"")){
     avisar("Selecione primeiro um exame e o tipo de caderno.");return false;
   }
   const allowed=window.RATIO_OAB_DATA?.["exam"+exame];
   const book=allowed?.cadernos?.[Number(tipo)-1] || (exame==="38"?{pdf:$("oabCadernoPdf")?.href}:null);
   if(!book?.pdf||!/^https:\/\/(?:s\.oab\.org\.br\/arquivos\/|oab\.fgv\.br\/arq\/)/.test(book.pdf)){
     avisar("Esta edição ainda não possui PDF oficial verificado no acervo.");return false;
   }
   const versao=versaoSelecao;
   carregando=true;
   const button=$("btnCarregarPdfOficial");
   if(button)button.disabled=true;
   let parsed;
   try {
     avisar("Abrindo a prova original dentro do RatioJuris. Não é necessário baixar ou enviar arquivo.");
     const pdfjs=await import(PDF_LIB);
     pdfjs.GlobalWorkerOptions.workerSrc=PDF_WORKER;
     const url="/api/oab-pdf?exame="+exame+"&tipo="+tipo;
     const task=pdfjs.getDocument({url,disableRange:true,disableStream:true,useSystemFonts:true,disableFontFace:true});
     parsed=await task.promise;
     if(versao!==versaoSelecao||exame!==$("oabExamSelect")?.value||tipo!==$("oabTipoSelect")?.value){
       await parsed.destroy?.();
       avisar("A prova selecionada mudou. Selecione novamente o caderno para carregar seu texto.");
       return false;
     }
     const antigo=documento;
     documento=parsed;
     identidadeDocumento=exame+"-"+tipo;
     cache.clear();cacheQuestoes.clear();trechoAtual="";
     try{if(antigo&&antigo!==parsed)await antigo.destroy?.()}catch(_){}
     const selector=$("pdfPaginaSelect");selector.replaceChildren();
     for(let i=1;i<=documento.numPages;i++){
       const option=document.createElement("option");
       option.value=String(i);option.textContent="Página "+i;selector.appendChild(option);
     }
     selector.value="1";
     $("pdfLeitorControles").classList.remove("hidden");
     await mostrarPagina(1);
     if(versao!==versaoSelecao||identidadeDocumento!==exame+"-"+tipo)return false;
     avisar("Caderno oficial "+exame+"º, Tipo "+tipo+", carregado dentro do aplicativo ("+
       documento.numPages+" páginas). O texto extraído depende da estrutura do PDF da OAB.");
     return true;
   }catch(_){
     if(parsed && parsed!==documento)try{await parsed.destroy?.()}catch(_){}
     if(versao!==versaoSelecao)return false;
     documento=null;cache.clear();cacheQuestoes.clear();trechoAtual="";
     $("pdfLeitorControles")?.classList.add("hidden");
     const preview=$("textoQuestaoDentroSimulador");
     if(exame===$("oabExamSelect")?.value && tipo===$("oabTipoSelect")?.value){
       exibirDocumentoNoCard(exame,tipo,
         "Não foi possível extrair o texto automaticamente. O caderno original desta prova está disponível abaixo, com os botões de resposta A, B, C e D.");
     }
     avisar("Não foi possível carregar o texto oficial nesta conexão. Use a prova integrada acima ou o link direto da OAB. Nenhuma questão será substituída por conteúdo inventado.");
     return false;
   }finally {
     carregando=false;
     if(button)button.disabled=false;
   }
 }
 function reconstruirPaginaPorColunas(items,largura,altura){
   // Páginas da OAB possuem duas colunas; a sequência bruta do PDF.js
   // pode intercalar alternativas de questões distintas.
   if(!Array.isArray(items)||!largura||!altura)return "";
   const meio=largura/2, colunas=[[],[]];
   for(const item of items){
     if(typeof item?.str!=="string"||!item.str.trim())continue;
     const x=Number(item.transform?.[4]),y=Number(item.transform?.[5]);
     if(!Number.isFinite(x)||!Number.isFinite(y))continue;
     if(y<altura*.055 || y>altura*.945)continue;
     colunas[x<meio?0:1].push({x,y,text:item.str.trim(),width:Number(item.width)||0});
   }
   const juntar=(itemsCol)=>{
     const sorted=itemsCol.sort((a,b)=>b.y-a.y||a.x-b.x);
     const lines=[];
     for(const item of sorted){
       let line=lines.find(l=>Math.abs(l.y-item.y)<=2.4);
       if(!line){line={y:item.y,parts:[]};lines.push(line);}
       line.parts.push(item);
     }
     return lines.sort((a,b)=>b.y-a.y).map(l=>{
       let result="",last=null;
       for(const item of l.parts.sort((a,b)=>a.x-b.x)){
         const gap=last?item.x-(last.x+last.width):0;
         result+=(result&&gap>1.3?" ":"")+item.text;
         last=item;
       }
       return result.trim();
     }).filter(Boolean).join("\n");
   };
   return colunas.map(juntar).filter(Boolean).join("\n");
 }
 async function textoPagina(pageNo){
   if(!documento)return "";
   const numero=Number(pageNo);
   if(!Number.isInteger(numero)||numero<1||numero>documento.numPages)return "";
   if(cache.has(numero))return cache.get(numero);
   const pdfAtual=documento;
   const versao=versaoSelecao;
   const page=await pdfAtual.getPage(numero);
   const content=await page.getTextContent();
   if(versao!==versaoSelecao||pdfAtual!==documento)return "";
   const viewport=page.getViewport({scale:1});
   const emColunas=reconstruirPaginaPorColunas(content.items,viewport.width,viewport.height);
   const original=content.items.map(item=>typeof item.str==="string"?
     item.str+(item.hasEOL?"\n":" "):"").join("").trim();
   const cleaned=(emColunas||original).replace(/[ \t]+\n/g,"\n").replace(/\n[ \t]+/g,"\n").trim();
   if(versao!==versaoSelecao||pdfAtual!==documento)return "";
   cache.set(numero,cleaned);
   return cleaned;
 }
 async function mostrarPagina(n){
   if(!documento){avisar("Carregue um PDF do caderno oficial primeiro.");return false;}
   const number=Number(n);
   if(!Number.isInteger(number)||number<1||number>documento.numPages)return false;
   const versao=versaoSelecao;
   const pdfAtual=documento;
   try{
     avisar("Extraindo texto da página "+number+".");
     const txt=await textoPagina(number);
     if(versao!==versaoSelecao||pdfAtual!==documento)return false;
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
   const lines=String(texto).replace(/\r/g,"").split(/\n/);
   // PDFs oficiais usam "QUESTÃO 39", "Questão 39 —", "39" isolado
   // ou o número no começo da mesma linha do enunciado.
   const marcador=(line)=>{
     const value=String(line||"").trim();
     const formal=/^(?:QUEST[AÃ]O|QUESTAO)\s*(?:N[º°.]?\s*)?0*(\d{1,2})(?:\s*[.):-–—]\s*|\s+|$)/i.exec(value);
     if(formal)return {numero:Number(formal[1]),formal:true};
     const standalone=/^0*(\d{1,2})\s*[.):-]?\s*$/.exec(value);
     return standalone?{numero:Number(standalone[1]),formal:false}:null;
   };
   let start=-1;
   for(let index=0;index<lines.length;index++){
     const m=marcador(lines[index]);
     if(m?.numero===n){start=index;break;}
   }
   if(start<0)return null;
   let end=lines.length;
   for(let k=start+1;k<lines.length;k++){
     const m=marcador(lines[k]);
     if(m&&(m.numero===n+1||m.numero===n+2)){end=k;break;}
   }
   const excerpt=lines.slice(start,end).join("\n").trim();
   if(excerpt.length<55||excerpt.length>9500)return null;
   return excerpt;
 }
 // Separa alternativas somente quando as quatro marcações estão inequívocas.
 // Se a extração estiver ambígua, preserva o texto integral para não omitir respostas.
 function separarAlternativasOficiais(trecho){
   const texto=String(trecho||"").trim();
   const marcador=/(^|[\n\r]|\s)([A-D])\s*[\)\.]\s+/g;
   const achados=[];
   let m;
   while((m=marcador.exec(texto))!==null){
     achados.push({letra:m[2],inicio:m.index+m[1].length,fim:marcador.lastIndex});
   }
   for(let i=0;i<=achados.length-4;i++){
     const seq=achados.slice(i,i+4);
     if(seq.map(x=>x.letra).join("")!=="ABCD")continue;
     if(achados.length!==4)continue;
     const enunciado=texto.slice(0,seq[0].inicio).trim();
     const opcoes=seq.map((x,j)=>texto.slice(x.fim,j===3?texto.length:seq[j+1].inicio).trim());
     if(enunciado.length<35||opcoes.some(v=>v.length<2||v.length>1600))continue;
     return {enunciado,alternativas:opcoes};
   }
   return null;
 }
 function renderizarTextoQuestao(numero,pagina,trecho,opcoes={}){
   const n=Number(numero);
   const chaveDocumento=$("oabExamSelect")?.value+"-"+$("oabTipoSelect")?.value;
   if(!trecho||(identidadeDocumento!==chaveDocumento&&identidadeDocumento!=="arquivo-local")||
      Number($("questaoOficialNumeroSelect")?.value)!==n)return false;
   const selectorPagina=$("pdfPaginaSelect");
   if(selectorPagina)selectorPagina.value=String(pagina);
   trechoAtual=trecho;
   const textoAcessivel=$("pdfTextoExtraido");
   if(textoAcessivel)textoAcessivel.textContent=trecho;
   const preview=$("textoQuestaoDentroSimulador");
   if(preview){
     preview._ratioQuestaoAnterior=chaveDocumento+"-"+n;
     // O card recolhivel preserva integralmente o enunciado e as alternativas
     // do documento original; os botões abaixo servem apenas para responder.
     const separado=separarAlternativasOficiais(trecho);
     preview.textContent=trecho;
     preview.setAttribute("data-extracao-validada",separado?"sim":"nao");
     const card=$("cardEnunciadoCompleto");if(card)card.open=true;
     const official=$("questaoOficialPdf");if(official)official.classList.add("hidden");
     const wrap=$("fallbackEnunciado");if(wrap)wrap.classList.add("hidden");
     const frame=$("fallbackEnunciadoPdf");if(frame)frame.removeAttribute("src");
     const botoes=$("alternativasQuestaoOficial")?.querySelectorAll("button");
     if(botoes)Array.from(botoes).forEach((botao,i)=>{
       const letra="ABCD"[i];
       botao.textContent=letra;
       botao.setAttribute("aria-label","Responder alternativa "+letra);
     });
     if(opcoes.foco!==false)preview.focus();
   }
   return true;
 }
 async function localizarQuestao(opcoes={}){
   const token=++buscaAtual;
   if(!documento){avisar("Carregue o PDF original da prova para localizar a questão.");return false;}
   const n=Number($("questaoOficialNumeroSelect")?.value||1);
   if(!Number.isInteger(n)||n<1||n>80)return false;
   const chaveDocumento=$("oabExamSelect")?.value+"-"+$("oabTipoSelect")?.value;
   const chaveQuestao=chaveDocumento+"-"+n;
   const memorizada=cacheQuestoes.get(chaveQuestao);
   if(memorizada && (identidadeDocumento===chaveDocumento||identidadeDocumento==="arquivo-local")){
     const ok=renderizarTextoQuestao(n,memorizada.pagina,memorizada.trecho,opcoes);
     if(ok){
       avisar("Questão "+n+" recuperada do PDF oficial já consultado nesta sessão.");
       return true;
     }
   }
   avisar("Procurando questão "+n+" no texto extraível do PDF oficial.");
   for(let pageNo=1;pageNo<=documento.numPages;pageNo++){
     try{
       const full=await textoPagina(pageNo);
       if(token!==buscaAtual||(identidadeDocumento!==chaveDocumento&&identidadeDocumento!=="arquivo-local")||
          Number($("questaoOficialNumeroSelect")?.value)!==n)return false;
       let excerpt=extrairTrechoQuestao(full,n);
       // Questões que começam no fim da página podem continuar na próxima.
       // Só mesclar quando o marcador da questão está na página atual.
       if(excerpt && pageNo<documento.numPages && excerpt.length<180){
         const next=await textoPagina(pageNo+1);
         const combined=extrairTrechoQuestao(full+"\n"+next,n);
         if(combined&&combined.length>excerpt.length)excerpt=combined;
       }
       if(excerpt){
         const ok=renderizarTextoQuestao(n,pageNo,excerpt,opcoes);
         if(!ok)return false;
         cacheQuestoes.set(chaveQuestao,{pagina:pageNo,trecho:excerpt});
         avisar("Possível localização da questão "+n+" na página "+pageNo+
           ". Confira a formatação e as alternativas com o PDF original quando necessário.");
         return true;
       }
     }catch(_){}
   }
   const preview=$("textoQuestaoDentroSimulador");
   if(preview && token===buscaAtual && (identidadeDocumento===chaveDocumento||identidadeDocumento==="arquivo-local")){
     exibirDocumentoNoCard($("oabExamSelect")?.value,$("oabTipoSelect")?.value,
       "A questão "+n+" não foi encontrada com segurança no texto extraído. Leia o caderno original exibido abaixo e assinale sua resposta. A numeração e o gabarito continuam vinculados à cor selecionada.");
   }
   avisar("A questão "+n+" não foi identificada automaticamente. "+
     "Use o seletor de páginas do PDF; a numeração pode não ser extraível na diagramação original.");
   return false;
 }
 async function abrirLeitorPdfAcessivel(){
   const panel=$("detalhesLeitorPdf");if(panel)panel.open=true;
   if(panel)panel.scrollIntoView({block:"start",behavior:"smooth"});
   return carregarOficial();
 }
 async function estudarQuestaoAtual(opcoes={}){
   const card=$("cardEnunciadoCompleto");if(card)card.open=true;
   const exame=$("oabExamSelect")?.value,tipo=$("oabTipoSelect")?.value;
   if(!/^\d{2}$/.test(exame||"")||! /^[1-4]$/.test(tipo||"")){
     avisar("Selecione um exame oficial e o caderno primeiro.");return false;
   }
   const identidadeAlvo=exame+"-"+tipo;
   if(!documento||identidadeDocumento!==identidadeAlvo){
     // Aguarda eventual PDF antigo sem reutilizar sua identidade nem recursão.
     if(promessaOficial){
       try{await promessaOficial}catch(_){}
       if(exame!==$("oabExamSelect")?.value||tipo!==$("oabTipoSelect")?.value)return false;
     }
     if(identidadeDocumento!==identidadeAlvo){
       if(documento)limpar();
       if(carregando){
         avisar("O leitor está finalizando a prova anterior. Toque em Recarregar texto oficial desta questão.");
         return false;
       }
       const tarefa=carregarOficial();
       promessaOficial=tarefa;
       let ok=false;
       try{ok=await tarefa}finally{if(promessaOficial===tarefa)promessaOficial=null}
       if(!ok||exame!==$("oabExamSelect")?.value||tipo!==$("oabTipoSelect")?.value)return false;
     }
   }
   if(identidadeDocumento!==identidadeAlvo)return false;
   return localizarQuestao(opcoes);
 }
 function cancelarBusca(){buscaAtual++;}
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
   if(["oabExamSelect","oabTipoSelect"].includes(event.target?.id))limpar();
 });
 window.RatioPdfAcessivel={carregar,carregarOficial,abrirLeitorPdfAcessivel,estudarQuestaoAtual,limpar,mostrarPagina,localizarQuestao,cancelarBusca,ouvirTrecho,extrairTrechoQuestao};
})();
