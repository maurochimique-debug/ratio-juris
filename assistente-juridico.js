/* RATIO JURIS — assistente pedagógico opcional, sem expor segredos no navegador. */
(function(){
 "use strict";
 const $=id=>document.getElementById(id);
 let open=false;
 let busy=false;
 let serviceReady=false;
 const history=[];
 const btn=()=> $("rjAiToggle");
 const panel=()=> $("rjAiPanel");
 function notice(msg){const el=$("rjAiStatus");if(el)el.textContent=msg;}
 function append(kind,text){
  const log=$("rjAiMessages");if(!log)return;
  const card=document.createElement("div");
  card.className="rj-ai-message "+(kind==="aluno"?"rj-ai-user":"rj-ai-assistant");
  const name=document.createElement("strong");name.textContent=kind==="aluno"?"Você:":"Assistente Jurídico:";
  const body=document.createElement("p");body.className="mt-1 whitespace-pre-wrap break-words";body.textContent=text;
  card.append(name,body);log.appendChild(card);log.scrollTop=log.scrollHeight;
 }
 function toggle(force){
  open=typeof force==="boolean"?force:!open;
  const p=panel(),b=btn();if(!p||!b)return;
  p.hidden=!open;
  b.setAttribute("aria-expanded",String(open));
  if(open){$("rjAiQuestion")?.focus();checkAvailability();}else b.focus();
 }
 async function checkAvailability(){
  try{
    const result=await fetch("/api/assistente-juridico",{method:"GET",cache:"no-store"});
    if(!result.ok)throw new Error("Falha de disponibilidade");
    const data=await result.json();
    serviceReady=data.disponivel===true;
    const sendButton=$("rjAiSend");
    if(sendButton)sendButton.disabled=!serviceReady||busy;
    if(!serviceReady){
      notice("IA ainda não habilitada no servidor. Você pode escrever sua dúvida, mas o envio ficará indisponível até a configuração segura.");
    }else{
      notice("Serviço disponível. Para enviar, é necessário login autenticado e autorização no piloto.");
    }
  }catch(_){
    serviceReady=false;
    const sendButton=$("rjAiSend");
    if(sendButton)sendButton.disabled=true;
    notice("Não foi possível verificar a IA. O envio está suspenso para evitar uma falsa confirmação.");
  }
 }
 function context(){
  const exame=$("oabExamSelect")?.value||"";
  const tipo=$("oabTipoSelect")?.value||"";
  const questao=$("questaoOficialNumeroSelect")?.value||"";
  const tex=$("textoQuestaoDentroSimulador");
  const texto=tex?.dataset.extracaoValidada==="sim"?tex.textContent.trim():"";
  return {exame,tipo,questao,texto:texto.slice(0,4500)};
 }
 function explainCurrent(){
  const c=context();
  if(!c.exame||!c.questao){notice("Primeiro selecione uma questão do exame.");return;}
  if(c.texto){
   $("rjAiQuestion").value="Explique os conceitos cobrados nesta questão, com linguagem simples, sem presumir a legislação atual. Informe o que devo conferir na fonte oficial.";
   notice("Contexto da questão "+c.questao+" carregado. Revise e envie sua dúvida.");
  }else{
   $("rjAiQuestion").value="Como posso entender a questão "+c.questao+" do "+c.exame+"º Exame da OAB, caderno tipo "+c.tipo+"? O enunciado ainda não foi extraído; explique como localizar e verificar os fundamentos sem inventar o conteúdo.";
   notice("O enunciado ainda não está disponível em texto. A IA não receberá um enunciado inventado.");
  }
  toggle(true);
 }
 async function send(){
  if(busy)return;
  const input=$("rjAiQuestion"),question=String(input?.value||"").trim();
  if(question.length<4||question.length>1500){notice("Escreva uma dúvida entre 4 e 1.500 caracteres.");return;}
  if(!serviceReady){notice("IA ainda indisponível. Sua pergunta permanece no campo.");return;}
  const c=context();
  busy=true;
  $("rjAiSend").disabled=true;
  notice("Consultando o assistente...");
  // Só registra a pergunta na conversa quando o servidor devolve uma resposta.
  try{
   const token=await window.RatioJurisAuth?.getAccessToken?.();
   const headers={"Content-Type":"application/json"};
   if(typeof token==="string"&&token)headers.Authorization="Bearer "+token;
   const resp=await fetch("/api/assistente-juridico",{
     method:"POST",headers,cache:"no-store",
     body:JSON.stringify({pergunta:question,contexto:c,historico:history.slice(-4)})
   });
   let data={};try{data=await resp.json()}catch(_){}
   if(!resp.ok){
    const explanation=resp.status===503?
      "A IA está desativada no servidor. Configure o acesso seguro na Vercel antes de testar; a pergunta foi preservada no campo.":
      resp.status===429?"O limite de consultas foi atingido. Tente novamente mais tarde.":
      resp.status===401?"É necessário conectar o login autenticado do Ratio Juris e entrar na conta para usar a IA.":
      resp.status===403?"Seu usuário ainda não foi autorizado a utilizar a IA. A pergunta permanece no campo para uma nova tentativa.":
      "Não foi possível consultar a IA agora. Utilize os documentos oficiais da prova.";
    append("assistente",explanation);notice(data.error||"Consulta indisponível.");return;
   }
   const answer=String(data.resposta||"").slice(0,8500);
   if(!answer){append("assistente","O serviço não retornou uma explicação verificável.");return;}
   append("aluno",question);
   append("assistente",answer);
   input.value="";
   history.push({pergunta:question,resposta:answer.slice(0,1000)});
   if(history.length>6)history.shift();
   notice("Explicação educacional — confira o texto legal vigente nas fontes oficiais.");
  }catch(_){
   append("assistente","Sem conexão com o serviço de IA. O estudo de questões e a consulta de legislação continuam disponíveis.");
   notice("Falha de rede. Nenhuma resposta foi inventada.");
  }finally{busy=false;$("rjAiSend").disabled=!serviceReady;}
 }
 document.addEventListener("DOMContentLoaded",()=>{
  const sendButton=$("rjAiSend");if(sendButton)sendButton.disabled=true;
  btn()?.addEventListener("click",()=>toggle());
  $("rjAiClose")?.addEventListener("click",()=>toggle(false));
  $("rjAiExplain")?.addEventListener("click",explainCurrent);
  $("rjAiSend")?.addEventListener("click",send);
  $("rjAiQuestion")?.addEventListener("keydown",e=>{
   if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)){e.preventDefault();send();}
   if(e.key==="Escape")toggle(false);
  });
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&open)toggle(false);});
 });
})();