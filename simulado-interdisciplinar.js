/* RATIO JURIS: módulo complementar. Preserva todas as provas, cadernos e gabaritos. */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const KEY="ratio_interdisciplinar_80_v1";
const AREAS=[
 ["Constitucional e Administrativo",["Direito Constitucional","Direito Administrativo"]],
 ["Civil e Processo Civil",["Direito Civil","Direito Processual Civil"]],
 ["Penal e Processo Penal",["Direito Penal","Direito Processual Penal"]],
 ["Empresarial e Tributário",["Direito Empresarial","Direito Tributário"]],
 ["Trabalho e Processo do Trabalho",["Direito do Trabalho","Direito Processual do Trabalho"]],
 ["Consumidor e Civil",["Direito do Consumidor","Direito Civil"]],
 ["Ética e Constitucional",["Ética Profissional e Estatuto da OAB","Direito Constitucional"]],
 ["Direitos Humanos e Processual",["Direitos Humanos","Direito Processual Civil"]]
];
const exams=[47,46,45];
let items=[],position=0,answers={};
const data=()=>window.RATIO_OAB_DATA||{};
function examData(n){return data()["exam"+n]||null;}
function checkedItem(exam,number){
 const d=examData(exam),book=d?.cadernos?.find(b=>Number(b.tipo)===1),key=d?.gabaritos?.[0]?.[number-1];
 if(!book?.pdf||!/^https:\/\/(?:s\.oab\.org\.br\/arquivos\/|oab\.fgv\.br\/arq\/)/.test(book.pdf)||!key||!/[ABCD*]/.test(key))return null;
 const disc=d.disciplinas?.find(a=>number>=a.start&&number<=a.end);
 return {id:exam+"-1-"+number,exam,number,pdf:book.pdf,key,subject:disc?.name||"Direito",source:d.fonteProva||"https://oab.fgv.br/"};
}
function construct(){
 items=[];
 const used=new Set();
 // 80 referências distintas (8 x 10), extraídas exclusivamente dos exames cujo
 // gabarito e a classificação disciplinar estão presentes no acervo.
 for(let b=0;b<8;b++){
   const rotation=[...exams.slice(b%exams.length),...exams.slice(0,b%exams.length)];
   const candidates=[];
   for(const exam of rotation){
     const d=examData(exam);
     const preferred=(d?.disciplinas||[]).filter(x=>AREAS[b][1].some(tag=>String(x.name).toLowerCase().includes(tag.toLowerCase().replace("direito ",""))));
     for(const range of preferred){
       for(let n=range.start;n<=range.end;n++){
         const item=checkedItem(exam,n);
         if(item&&!used.has(item.id)&&!candidates.some(v=>v.id===item.id))candidates.push(item);
       }
     }
   }
   const chosen=candidates.slice(0,10);
   chosen.forEach(item=>{used.add(item.id);items.push({...item,block:b,theme:AREAS[b][0]});});
 }
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(answers));}catch(_){}}
function load(){try{answers=JSON.parse(localStorage.getItem(KEY)||"{}")||{};}catch(_){answers={};}}
function validAnswer(item){return Object.prototype.hasOwnProperty.call(answers,item.id);}
function result(item){const x=answers[item.id];return item.key==="*"?"anulada":!x?"branco":x===item.key?"acerto":"erro";}
function status(message){const el=$("interStatus");if(el)el.textContent=message;}
function metrics(){
 const all=items.filter(validAnswer);
 const a=all.filter(i=>result(i)==="acerto").length,e=all.filter(i=>result(i)==="erro").length,n=items.filter(i=>i.key==="*").length;
 const el=$("interMetrics");if(el)el.textContent="Respondidas: "+all.length+"/80 · Acertos: "+a+" · Erros: "+e+" · Anuladas: "+n+" · Aproveitamento: "+(a+e?Math.round(100*a/(a+e)):0)+"%";
}
function render(){
 const item=items[position],container=$("interQuestion"),buttons=$("interAnswers");
 if(!item){status("O acervo ainda não contém 80 questões com referência oficial e gabarito vinculado. Não serão criadas questões fictícias.");$("interStart")?.setAttribute("disabled","");return;}
 $("interTitle").textContent="Questão "+(position+1)+" de 80 · Bloco "+(item.block+1)+"/8";
 $("interSubject").textContent=item.theme+" · "+item.subject+" · "+item.exam+"º Exame OAB, Tipo 1 (Branca), questão "+item.number;
 $("interBlock").value=String(item.block);$("interNumber").value=String(position);
 $("interPdf").href=item.pdf;$("interSource").href=item.source;
 const out=$("interFeedback");out.textContent=validAnswer(item)?"Resposta registrada: "+answers[item.id]+". "+(item.key==="*"?"Questão anulada.":result(item)==="acerto"?"Correta no gabarito histórico.":"Resposta divergente do gabarito histórico. Correta: "+item.key+"."):"";
 buttons.innerHTML="";
 "ABCD".split("").forEach(letter=>{
   const button=document.createElement("button");
   button.type="button";button.textContent=letter;button.className="min-h-[52px] rounded-xl border-2 border-purple-500 px-4 py-3 font-black text-purple-900 dark:text-white bg-white dark:bg-ratio-cardDark";
   button.setAttribute("aria-pressed",String(answers[item.id]===letter));
   if(answers[item.id]===letter)button.classList.add("ring-2","ring-amber-400");
   button.addEventListener("click",()=>{
     // Somente corrigir após o usuário conferir o enunciado oficial.
     answers[item.id]=letter;save();render();
   });buttons.appendChild(button);
 });
 container.textContent="Aguardando leitura segura do enunciado original. Consulte o PDF oficial abaixo ou use “Abrir no simulador principal”. Nenhuma pergunta será reconstruída por IA.";
 metrics();
}
function navigate(i){if(i<0||i>=items.length)return;position=i;version++;render();}
function goOriginal(){
 const item=items[position];if(!item)return;
 const exam=$("oabExamSelect"),type=$("oabTipoSelect"),num=$("questaoOficialNumeroSelect");
 if(!exam||!type||!num){status("Simulador principal indisponível.");return;}
 exam.value=String(item.exam);exam.dispatchEvent(new Event("change",{bubbles:true}));
 type.value="1";type.dispatchEvent(new Event("change",{bubbles:true}));
 // aguardar atualização das opções dependentes
 setTimeout(()=>{
   if(typeof window.irParaQuestaoOficial==="function")window.irParaQuestaoOficial(item.number);
   else{num.value=String(item.number);num.dispatchEvent(new Event("change",{bubbles:true}));}
   $("simulador-oficial")?.scrollIntoView({behavior:"smooth",block:"start"});
   window.RatioPdfAcessivel?.estudarQuestaoAtual?.({foco:true});
 },150);
}
function init(){
 construct();load();
 const block=$("interBlock"),numbers=$("interNumber");
 if(!block||!numbers)return;
 for(let b=0;b<8;b++){const opt=document.createElement("option");opt.value=b;opt.textContent="Bloco "+(b+1)+" — "+AREAS[b][0];block.appendChild(opt);}
 items.forEach((item,i)=>{const opt=document.createElement("option");opt.value=i;opt.textContent=(i+1)+" · "+item.exam+"º Exame, Q"+item.number;numbers.appendChild(opt);});
 block.addEventListener("change",()=>navigate(Number(block.value)*10));
 numbers.addEventListener("change",()=>navigate(Number(numbers.value)));
 $("interPrev").addEventListener("click",()=>navigate(position-1));
 $("interNext").addEventListener("click",()=>navigate(position+1));
 $("interStart").addEventListener("click",goOriginal);
 $("interReset").addEventListener("click",()=>{if(confirm("Limpar apenas as respostas do simulado interdisciplinar?")){answers={};save();render();}});
 render();status(items.length===80?"80 referências de questões organizadas em 8 blocos. Confira o enunciado no leitor oficial antes de responder.":"Apenas "+items.length+" de 80 referências disponíveis: provas e gabaritos ausentes não serão inventados.");
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();