/* 30º Exame OAB/FGV, 20/10/2019.
   Letras: gabarito preliminar oficial; * = anulações OAB de 25 e 29/10/2019.
   320 posições cruzadas contra a tabela de correspondência oficial.
   O documento definitivo das letras segue pendente de conferência documental.
   Sem questões, alternativas ou explicações sintéticas inventadas.
*/
(function(){
"use strict";
const db=window.RATIO_OAB_DATA;
if(!db||!Array.isArray(db.archive))return;
const catalog=db.archive.find(e=>Number(e.exame)===30);
if(!catalog||!Array.isArray(catalog.correspondenciaDocumental)||catalog.correspondenciaDocumental.length!==80)return;
const gabaritos=["CBBCDAABAADBDACBCDC*CDABDCADC*CDABADBDACBBADDBBDCACDACCD*DBCBCAACDBDDBADABACBABC","AACBDBBCAABDCCABDDCC*BDCADD*CCADBADBDCBAAABDDACBDBC*DCADCABDCBCABDDCDAABABDBCBAC","BABCBDCAAAACBDCBDCD*CACBDDDCDC*AABBAADDCBBADDBBCDADDCC*ACBABCCDADCBDDDBAABAABCCB","CCDABBABAABDBCDACCDC*CDADBCD*ADCBAADABDBCABDDCBBADDCA*CCDCBABDCDCDBADABADABBACBC"];
const anulacoesPorTipo=[[20,30,57],[21,28,52],[20,31,55],[21,29,54]];
const cadernos=[{"tipo":1,"cor":"Branca","pdf":"https://s.oab.org.br/arquivos/2019/10/5d1e94ef-83ee-4506-a2e9-38c62c98a8d1.pdf"},{"tipo":2,"cor":"Verde","pdf":"https://s.oab.org.br/arquivos/2019/10/4e49d924-07d1-4f9c-991d-6fb866c7bb4d.pdf"},{"tipo":3,"cor":"Amarela","pdf":"https://s.oab.org.br/arquivos/2019/10/55ead6d1-3bfc-41d6-bfdf-4e86944f8298.pdf"},{"tipo":4,"cor":"Azul","pdf":"https://s.oab.org.br/arquivos/2019/10/1f5cee04-b406-4d89-96ff-e7d6630fdf77.pdf"}];
const valid=gabaritos.length===4&&gabaritos.every(k=>k.length===80&&/^[ABCD*]{80}$/.test(k)) &&
  gabaritos.every((k,i)=>anulacoesPorTipo[i].every(q=>k[q-1]==='*')) &&
  catalog.correspondenciaDocumental.every((row,i)=>row.every((number,t)=>
    Number.isInteger(number)&&number>=1&&number<=80&&gabaritos[t+1][number-1]===gabaritos[0][i]));
if(!valid){console.error("RATIO JURIS: falha ao validar a tabela do 30º Exame");return;}
db.exam30={
  exame:30,
  dataProva:"20/10/2019",
  status:"GABARITO_PRELIMINAR_CONCILIADO_COM_TRES_ANULACOES_OFICIAIS_DEFINITIVO_PENDENTE_DE_CONFERENCIA",
  cadernos,
  gabaritos,
  correspondencia:catalog.correspondenciaDocumental,
  anulacoesPorTipo,
  disciplinas:[],
  gabaritoPDF:"https://s.oab.org.br/arquivos/2019/10/244695e0-d919-4f6d-8aa0-98a3baa100af.pdf",
  fonteOficial:"https://examedeordem.oab.org.br/EditaisProvas?NumeroExame=11563",
  fonteAnulacao:"https://www.oab.org.br/noticia/57686/oab-anula-tres-questoes-do-xxx-exame-de-ordem",
  nota:"320 letras do gabarito preliminar conferidas por correspondência oficial; questões 20,30,57 do Tipo 1 e equivalentes anuladas. A correção é histórica/provisória até cotejo com documento definitivo de 08/11/2019."
};
catalog.importado=true;
catalog.status="gabarito_preliminar_integrado_com_3_anulacoes_oficiais_definitivo_pendente_de_conferencia";
catalog.observacao="Correção histórica baseada no gabarito preliminar e comunicados oficiais de anulação. A versão definitiva das letras ainda não foi confrontada.";
const meta=db.metadata||{};
if(Array.isArray(meta.examesCorrigiveis)&&!meta.examesCorrigiveis.includes(30))
  meta.examesCorrigiveis.push(30);
meta.integracao30="GABARITO_PRELIMINAR_COM_ANULACOES_CONCILIADAS; DEFINITIVO_NAO_HOMOLOGADO";
window.RATIO_OAB_DATA=db;
})();