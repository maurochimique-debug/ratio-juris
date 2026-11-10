/* RatioJuris — Acessibilidade progressiva, sem serviços externos.
 * Compatibilidade de voz depende de navegador, sistema e vozes instaladas.
 * Não transmite mensagens de comunicação alternativa para servidor.
 */
(function(){
  "use strict";
  const $=id=>document.getElementById(id);
  const root=document.documentElement;
  const synth=()=>window.speechSynthesis;
  const support=()=>typeof window.SpeechSynthesisUtterance==="function" &&
     !!synth() && typeof synth().speak==="function";
  const STORE="ratio_a11y_";
  const save=(k,v)=>{try{localStorage.setItem(STORE+k,String(v));}catch(_){}};
  const load=(k,def)=>{try{return localStorage.getItem(STORE+k)??def;}catch(_){return def;}};
  function announce(text){
    const node=$("a11yStatus");
    if(node)node.textContent=text;
  }
  function setExpanded(open){
    const panel=$("painelAcessibilidade"),button=$("btnAcessibilidade");
    if(!panel||!button)return;
    panel.classList.toggle("hidden",!open);
    button.setAttribute("aria-expanded",open?"true":"false");
    button.setAttribute("aria-label",open?"Fechar painel de acessibilidade":"Abrir painel de acessibilidade");
    if(open){
      panel.focus();
      announce("Painel de acessibilidade aberto. Use Tab para percorrer os controles.");
    }else {
      button.focus();
      announce("Painel de acessibilidade fechado.");
    }
  }
  function toggle(){
    const p=$("painelAcessibilidade");
    if(p)setExpanded(p.classList.contains("hidden"));
  }
  function setContrast(active){
    const on=!!active;
    root.classList.toggle("a11y-high-contrast",on);
    const button=$("a11yContrastBtn");
    if(button)button.setAttribute("aria-pressed",on?"true":"false");
    save("contrast",on?"1":"0");
    announce(on?"Alto contraste ativado.":"Alto contraste desativado.");
  }
  function toggleContrast(){setContrast(!root.classList.contains("a11y-high-contrast"));}
  function setTextScale(percent){
    const accepted=[100,125,150];
    const n=Number(percent);
    const value=accepted.includes(n)?n:100;
    root.classList.toggle("a11y-font-large",value===125);
    root.classList.toggle("a11y-font-xlarge",value===150);
    const selector=$("a11yFontSelect");
    if(selector)selector.value=String(value);
    save("textscale",String(value));
    announce("Tamanho do texto configurado em "+value+" por cento.");
  }
  function rate(){
    const n=Number($("a11ySpeechRate")?.value);
    return [0.85,1,1.15].includes(n)?n:1;
  }
  function voiceText(text){
    const value=String(text??"").trim();
    if(!value){announce("Não há texto disponível para leitura.");return false;}
    if(!support()){
      announce("Leitura por voz indisponível neste navegador. O texto permanece acessível na página.");
      return false;
    }
    try{
      const engine=synth();
      engine.cancel();
      const utterance=new window.SpeechSynthesisUtterance(value);
      utterance.lang="pt-BR";
      utterance.rate=rate();
      const voices=typeof engine.getVoices==="function"?engine.getVoices():[];
      const preferred=voices.find(x=>x.lang?.toLowerCase()==="pt-br") ||
        voices.find(x=>x.lang?.toLowerCase().startsWith("pt"));
      if(preferred)utterance.voice=preferred;
      utterance.onstart=()=>announce("Leitura por voz iniciada.");
      utterance.onend=()=>announce("Leitura por voz concluída.");
      utterance.onerror=()=>announce("Não foi possível reproduzir a voz. Utilize a leitura em texto.");
      engine.speak(utterance);
      announce("Leitura solicitada ao sintetizador do dispositivo.");
      return true;
    }catch(_){
      announce("A síntese de voz não pôde ser iniciada. Verifique as permissões e vozes do dispositivo.");
      return false;
    }
  }
  function readOfficialQuestion(){
    const title=$("questaoOficialTitulo")?.textContent||"";
    const status=$("statusSimuladorOficial")?.textContent||"";
    const context=$("questaoOficialContexto")?.textContent||"";
    const response=$("feedbackQuestaoOficial")?.textContent||"";
    if(!title)return voiceText("Nenhuma prova oficial disponível. Selecione uma edição com gabarito importado.");
    return voiceText([title,status,context,response,
      "Para ouvir o enunciado ORIGINAL, baixe o caderno oficial e carregue o PDF no leitor acessível abaixo. "+
      "Após a extração, use Localizar questão atual e Ouvir texto extraído."].filter(Boolean).join(". "));
  }
  function readExamStatus(){
    const examNumber=$("oabExamSelect")?.value||"";
    const status=$("oabStatus")?.textContent||"";
    const anterior=examNumber!=="47";
    const result=anterior?$("oab46Resultado"):$("oabResultado");
    const progress=anterior?$("oab46Progresso"):$("oabProgresso");
    const desempenho=$("estatisticaMensagem")?.textContent||"";
    const feedback=result && !result.classList.contains("hidden")?result.textContent:"";
    return voiceText([status,progress?.textContent,feedback,desempenho].filter(Boolean).join(". "));
  }
  function pauseResume(){
    if(!support()){announce("Pausa de voz indisponível neste navegador.");return;}
    const s=synth();
    if(s.paused && typeof s.resume==="function"){
      s.resume();announce("Leitura retomada.");
    }else if(s.speaking && typeof s.pause==="function"){
      s.pause();announce("Leitura pausada.");
    }else announce("Nenhuma leitura em andamento.");
  }
  function stop(){
    if(!support()){announce("Nenhuma leitura por voz disponível.");return;}
    synth().cancel();
    announce("Leitura interrompida.");
  }
  function fillMessage(message){
    const area=$("a11yMessage");
    if(!area)return;
    area.value=String(message||"");
    area.focus();
    announce("Mensagem preparada. Pode editá-la ou escolher Falar mensagem.");
  }
  function speakMessage(){return voiceText($("a11yMessage")?.value||"");}
  function clearMessage(){
    const area=$("a11yMessage");
    if(!area)return;
    area.value="";
    area.focus();
    announce("Mensagem limpa.");
  }
  function init(){
    const scale=Number(load("textscale","100"));
    setTextScale(scale);
    setContrast(load("contrast","0")==="1");
    // Não iniciar áudio automaticamente: evita conflitos com leitores de tela.
    const voiceStatus=$("a11yVoiceAvailability");
    if(voiceStatus)voiceStatus.textContent=support() ?
      "Leitura em voz alta disponível pelo navegador. A qualidade da voz depende do dispositivo.":
      "Leitura em voz alta não disponível neste dispositivo. As questões e controles permanecem acessíveis por texto.";
    const panel=$("painelAcessibilidade");
    if(panel)panel.classList.add("hidden");
    const button=$("btnAcessibilidade");
    if(button)button.setAttribute("aria-expanded","false");
    window.addEventListener("keydown",event=>{
      if(event.key==="Escape" && panel && !panel.classList.contains("hidden")){
        setExpanded(false);
      }
    });
    announce("Recursos de acessibilidade preparados.");
  }
  window.RatioA11y={
    toggle, close:()=>setExpanded(false),setContrast,toggleContrast,
    setTextScale,readExamStatus,readOfficialQuestion,pauseResume,stop,fillMessage,
    speakMessage,clearMessage,voiceText
  };
  document.addEventListener("DOMContentLoaded",init);
})();
