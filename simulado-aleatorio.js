/* RATIO JURIS — seleção personalizada de questões oficiais, sem gerar enunciados. */
(function(){
 "use strict";
 let sessao=null;
 const $=id=>document.getElementById(id);
 function status(msg){const el=$("statusSimuladoAleatorio");if(el)el.textContent=msg;}
 function estado(){
  if(!sessao)return null;
  if(Number($("oabExamSelect")?.value)!==sessao.exame||Number($("oabTipoSelect")?.value)!==sessao.tipo)return null;
  return sessao;
 }
 function shuffle(list){
  const a=list.slice();
  for(let i=a.length-1;i>0;i--){
   let j;
   if(window.crypto?.getRandomValues){
    const b=new Uint32Array(1),cap=Math.floor(4294967296/(i+1))*(i+1);
    do{crypto.getRandomValues(b)}while(b[0]>=cap);
    j=b[0]%(i+1);
   }else j=Math.floor(Math.random()*(i+1));
   [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
 }
 function iniciar(){
  const exame=Number($("oabExamSelect")?.value),tipo=Number($("oabTipoSelect")?.value);
  const config=window.RATIO_OAB_DATA?.["exam"+exame];
  const chave=config?.gabaritos?.[tipo-1];
  if(typeof chave!=="string"||chave.length!==80){status("Escolha um exame com gabarito oficial integrado (39º a 47º).");return false;}
  const listaManual=String($("aleatorioQuestoesEspecificas")?.value||"").trim();
  const primeiro=Number($("aleatorioInicio").value),ultimo=Number($("aleatorioFim").value),qtd=Number($("aleatorioQuantidade").value);
  let candidatas=null;
  if(listaManual){
   const valores=new Set();
   for(const trecho of listaManual.split(/[,;\s]+/).filter(Boolean)){
    const m=/^(\d{1,2})(?:-(\d{1,2}))?$/.exec(trecho);
    if(!m){status("Lista inválida. Use: 1, 5, 10-15.");return false;}
    const i=Number(m[1]),f=Number(m[2]||m[1]);
    if(i<1||f>80||f<i){status("Os números devem estar entre 1 e 80.");return false;}
    for(let n=i;n<=f;n++)valores.add(n);
   }
   candidatas=[...valores];
  }
  if(!listaManual&&(![primeiro,ultimo,qtd].every(Number.isInteger)||primeiro<1||ultimo>80||ultimo<primeiro||qtd<1||qtd>ultimo-primeiro+1)){
   status("Informe um intervalo válido de 1 a 80 e uma quantidade que caiba nesse intervalo.");return false;
  }
  if(listaManual&&(!Number.isInteger(qtd)||qtd<1||qtd>candidatas.length)){
   status("A quantidade deve estar entre 1 e "+candidatas.length+" questões selecionadas.");return false;
  }
  const questoes=shuffle(candidatas||Array.from({length:ultimo-primeiro+1},(_,i)=>i+primeiro)).slice(0,qtd);
  sessao={exame,tipo,questoes,index:0,corrigida:false,respostas:{}};
  // Evita reaproveitar respostas de uma prova completa anterior sem o consentimento do aluno.
  status("Simulado com "+qtd+" questões sorteadas do "+exame+"º Exame, caderno Tipo "+tipo+".");
  original.irParaQuestaoOficial(questoes[0]);
  atualizar();
  return true;
 }
 function encerrar(){sessao=null;status("Modo livre: escolha qualquer uma das 80 questões.");original.renderizarSimuladorOficial();return true;}
 function atualizar(){
  const s=estado();if(!s)return;
  const pos=s.questoes[s.index];
  const label=$("statusSimuladorOficial");
  if(label)label.textContent="Sorteada "+(s.index+1)+"/"+s.questoes.length+" • Questão "+pos+" • Exame "+s.exame+" Tipo "+s.tipo;
  const prev=$("btnQuestaoAnterior"),next=$("btnQuestaoProxima");
  if(prev)prev.disabled=s.index===0;
  if(next){next.disabled=s.index===s.questoes.length-1;next.textContent=next.disabled?"Última questão sorteada":"Próxima questão sorteada";}
  const feedback=$("feedbackQuestaoOficial");
  const alternativa=s.respostas[pos]||"";
  if(feedback){
    const key=window.RATIO_OAB_DATA["exam"+s.exame].gabaritos[s.tipo-1][pos-1];
    feedback.textContent=s.corrigida?(key==="*"?"Questão anulada: ponto automático.":"Sua resposta: "+(alternativa||"em branco")+". Gabarito oficial: "+key+"."):(alternativa?"Alternativa "+alternativa+" registrada neste simulado.":"Leia o enunciado original e escolha A, B, C ou D.");
  }
  const buttons=$("alternativasQuestaoOficial")?.querySelectorAll("button");
  buttons?.forEach((b,i)=>{
   const selecionada=alternativa==="ABCD"[i];
   b.setAttribute("aria-pressed",String(selecionada));
   b.className="btn-touch rounded-xl px-5 py-3 border-2 font-black text-left whitespace-normal "+(selecionada?
     "border-purple-800 bg-purple-200 text-purple-950 dark:bg-purple-950 dark:text-white":
     "border-purple-500 bg-white dark:bg-[#12161A] text-purple-800 dark:text-purple-300");
  });
  // Não mostrar a avaliação prévia da prova completa durante o sorteio.
  for(const id of ["fundamentacaoErroOficial","painelDoutrinaQuestao"]){
   const pane=$(id);if(pane)pane.classList.add("hidden");
  }
  const fullCheck=$("btnConferirQuestaoOficial");if(fullCheck)fullCheck.classList.add("hidden");
  const correct=$("btnCorrigirSimulador");if(correct)correct.textContent="Corrigir questões sorteadas";
  const select=$("questaoOficialNumeroSelect");
  if(select)select.setAttribute("aria-label","Questão oficial atual. Durante o sorteio, utilize as setas de navegação.");
 }
 function corrigir(){
  const s=estado();if(!s)return false;
  s.corrigida=true;
  const chave=window.RATIO_OAB_DATA["exam"+s.exame].gabaritos[s.tipo-1];
  const pontos=s.questoes.filter(n=>chave[n-1]==="*"||s.respostas[n]===chave[n-1]).length;
  const feitas=s.questoes.filter(n=>Boolean(s.respostas[n])).length;
  status("Resultado: "+pontos+"/"+s.questoes.length+" pontos (anulações oficiais incluídas); "+feitas+" questões respondidas. Correção restrita às questões sorteadas.");
  atualizar();return true;
 }
 const original={};
 document.addEventListener("DOMContentLoaded",()=>{
  for(const k of ["irParaQuestaoOficial","moverQuestaoOficial","responderQuestaoOficial","corrigirSimuladorOficial","renderizarSimuladorOficial","atualizarArquivoOAB"]){
    original[k]=window[k];
  }
  if(Object.values(original).some(f=>typeof f!=="function")){status("Os controles do simulado não estão disponíveis nesta versão.");return;}
  window.irParaQuestaoOficial=function(numero){
   const s=estado(),n=Number(numero);
   if(s){
    const idx=s.questoes.indexOf(n);
    if(idx<0){status("Questão não sorteada. Encerre o modo aleatório para navegar por todas.");return false;}
    s.index=idx;
   }
   const ok=original.irParaQuestaoOficial(numero);atualizar();return ok;
  };
  window.moverQuestaoOficial=function(delta){
   const s=estado();if(!s)return original.moverQuestaoOficial(delta);
   const idx=s.index+Number(delta);
   if(idx<0||idx>=s.questoes.length)return false;
   return window.irParaQuestaoOficial(s.questoes[idx]);
  };
  window.responderQuestaoOficial=function(letra){
   const s=estado();if(!s)return original.responderQuestaoOficial(letra);
   if(s.corrigida){status("Simulado já corrigido. Inicie outro sorteio para responder novamente.");return false;}
   const pos=s.questoes[s.index];
   if(!"ABCD".includes(letra))return false;
   const chave=window.RATIO_OAB_DATA["exam"+s.exame].gabaritos[s.tipo-1][pos-1];
   if(chave==="*"){status("Questão anulada no gabarito definitivo; ponto automático.");return false;}
   const anterior=s.respostas[pos];
   s.respostas[pos]=letra;
   if(anterior!==letra && letra===chave && $("somAcertoSimulador")?.checked)window.RatioSomAcerto?.();
   atualizar();
   return true;
  };
  window.corrigirSimuladorOficial=function(){return estado()?corrigir():original.corrigirSimuladorOficial()};
  window.renderizarSimuladorOficial=function(){const result=original.renderizarSimuladorOficial();atualizar();return result;};
  window.atualizarArquivoOAB=function(){
   if(sessao&&(Number($("oabExamSelect")?.value)!==sessao.exame||Number($("oabTipoSelect")?.value)!==sessao.tipo))sessao=null;
   const result=original.atualizarArquivoOAB();if(!estado()){const btn=$("btnCorrigirSimulador");if(btn)btn.textContent="Corrigir minha prova";}
   atualizar();return result;
  };
  window.iniciarSimuladoAleatorio=iniciar;
  window.encerrarSimuladoAleatorio=function(){const b=$("btnCorrigirSimulador");if(b)b.textContent="Corrigir minha prova";return encerrar();};
 });
})();