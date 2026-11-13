// Confere que cada PDF que o app oferece está permitido no proxy de leitura.
// Uso: node scripts/validar-integracao-pdfs.mjs
import {readFileSync} from "node:fs";
const read=(p)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const db=JSON.parse(read("oab-data.js").match(/window\.RATIO_OAB_DATA\s*=\s*(\{[\s\S]*\});?\s*$/)?.[1]||"null");
const html=read("index.html"),proxy=read("api/oab-pdf.mjs"),keys=read("api/oab-gabarito.mjs");
const source={};
for(const match of proxy.matchAll(/^\s*"(\d{2})":\s*\[([\s\S]*?)\]/gm))
 source[match[1]]=[...match[2].matchAll(/"([^"]+)"/g)].map(m=>m[1]);
const answers=Object.fromEntries(
 [...keys.matchAll(/^\s*"(\d{2})"\s*:\s*"([^"]+)"/gm)].map(m=>[m[1],m[2]])
);
const errors=[],warnings=[];
let confirmed=0;
const check=(n,documents)=>{
 for(let tipo=1;tipo<=4;tipo++){
  const pdf=documents.cadernos?.[tipo-1]?.pdf;
  if(!pdf)continue;
  confirmed++;
  if(source[String(n)]?.[tipo-1]!==pdf)
   errors.push(n+"º Tipo "+tipo+": PDF não coincide com o proxy interno");
 }
 if(documents.gabaritoPDF&&answers[String(n)]!==documents.gabaritoPDF)
  errors.push(n+"º: gabarito não coincide com o proxy interno");
};
for(let n=10;n<=47;n++)if(db["exam"+n])check(n,db["exam"+n]);
// Fonte histórica publicada em index.html (não está em oab-data.js).
const start=html.indexOf("const arquivosDocumentaisOAB=Object.freeze({");
const finish=html.indexOf("\n    function documentosDoExameOAB",start);
if(start<0||finish<0)errors.push("Catálogo documental histórico não encontrado");
else{
 const section=html.slice(start,finish);
 for(const n of [10,13,30,38]){
  const block=section.match(new RegExp("\\n\\s*"+n+":\\{([\\s\\S]*?)(?=\\n\\s*\\d+:\\{|\\n\\s*\\}\\);)"))?.[1];
  if(!block){errors.push(n+"º: documentos históricos ausentes");continue;}
  const cadernos=[...block.matchAll(/tipo:(\d),cor:'[^']+',pdf:'([^']+)'/g)];
  for(const [,tipo,url] of cadernos){
   confirmed++;
   if(source[String(n)]?.[Number(tipo)-1]!==url)
    errors.push(n+"º Tipo "+tipo+": PDF histórico divergente do proxy");
  }
  const gab=block.match(/gabaritoPDF:'([^']+)'/)?.[1];
  if(gab&&answers[String(n)]!==gab)errors.push(n+"º: gabarito histórico divergente do proxy");
 }
}
for(const id of ["simulador-oficial","oabExamSelect","oabTipoSelect",
 "painelDocumentoOabNoApp","iframeDocumentoOabNoApp","resultadoBuscaContainer",
 "gabineteArtigoInput","gabineteLeiSelect"]){
 if(!html.includes('id="'+id+'"'))errors.push("Controle essencial ausente: "+id);
}
if(html.includes('id="configSimuladoAleatorio"'))errors.push("Seção aleatória removida reapareceu");
if(!html.includes("R$ 99")||!html.includes("R$ 370"))errors.push("Preços comerciais divergentes");
if(!html.includes("pesquisarConjurGabinete"))errors.push("Pesquisa complementar ConJur ausente");
if(!html.includes('id="leitorMobile"')&&!html.includes('/leitor-mobile-pdf.js'))
 errors.push("Leitor paginado para celular ausente");
if(html.includes('id="configSimuladoAleatorio"')||html.includes('Testar sininho'))
 errors.push("Controle removido de sorteio ou teste de som reapareceu");
if(html.includes("gabaritos oficiais auditados, sem comentários individuais"))
 errors.push("Banner confuso de gabaritos reapareceu");
if(html.includes("abrirAcervoBanca('fcc')")||html.includes("abrirAcervoBanca('cebraspe')"))
 errors.push("Bancas fora do escopo de magistratura reapareceram");
if(!html.includes('href="#acervo-vunesp"')||!html.includes('Magistratura TJSP'))
 errors.push("Acervo de magistratura não acessível pela seleção inicial");
if(!html.includes('id="motivoErroQuestao"'))
 errors.push("Breve explicação sobre erro de questão indisponível");
for(const name of ["btnQuestaoAnterior","btnQuestaoProxima","btnCorrigirSimulador",
 "btnLerQuestao","btnPararQuestao","btnAcessibilidade","painelAcessibilidade"]){
 if(!html.includes('id="'+name+'"'))errors.push("Controle móvel necessário ausente: "+name);
}
const ids={};
for(const m of html.matchAll(/\\bid="([^"]+)"/g))ids[m[1]]=(ids[m[1]]||0)+1;
for(const [id,count] of Object.entries(ids))if(count>1)errors.push("Identificador HTML duplicado: "+id);

console.log(JSON.stringify({pdfsConferidos:confirmed,erros:errors,avisos:warnings,
 escopo:"vínculos de código; não testa conexão à fonte nem renderização no celular"},null,2));
if(errors.length)process.exitCode=1;
