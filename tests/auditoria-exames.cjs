/* Auditoria estrutural do acervo OAB 47º–14º. Executar: node tests/auditoria-exames.cjs
   Testes NÃO substituem homologação documental do enunciado e gabarito definitivo.
*/
"use strict";
const fs=require("node:fs");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const context={window:{},console};
vm.runInNewContext(fs.readFileSync("oab-data.js","utf8"),context,{timeout:1000});
vm.runInNewContext(fs.readFileSync("oab30-integracao.js","utf8"),context,{timeout:1000});
const db=context.window.RATIO_OAB_DATA;
const summary={exames:0,cadernos:0,gabaritos:0,questoesPorTipo:80,pendenciasDocumentais:[],erros:[]};
for(let exam=47;exam>=14;exam--){
  const d=db["exam"+exam];
  if(!d){summary.erros.push(exam+"º ausente");continue;}
  summary.exames++;
  if(!Array.isArray(d.cadernos)||d.cadernos.length!==4||d.cadernos.some((b,i)=>Number(b?.tipo)!==i+1||!/^https:\/\//.test(b.pdf||"")))
    summary.erros.push(exam+"º sem quatro PDFs oficiais vinculados");
  else summary.cadernos+=4;
  if(!Array.isArray(d.gabaritos)||d.gabaritos.length!==4||d.gabaritos.some(k=>typeof k!=="string"||!/^[ABCD*]{80}$/.test(k)))
    summary.erros.push(exam+"º sem 4 x 80 chaves válidas");
  else summary.gabaritos+=4;
}
// Conferência de identidade entre gabaritos por cor somente onde validada.
// Nem toda tabela de correspondência permite comparar letras entre cadernos:
// o 39º Exame possui advertência expressa contra essa inferência.
const thirty=db.exam30;
assert.ok(thirty,"30º Exame precisa estar integrado");
assert.deepEqual(Array.from(thirty.anulacoesPorTipo,v=>Array.from(v)),[[20,30,57],[21,28,52],[20,31,55],[21,29,54]]);
for(let i=0;i<80;i++)for(let c=1;c<4;c++)
 assert.equal(thirty.gabaritos[0][i],thirty.gabaritos[c][thirty.correspondencia[i][c-1]-1],
   "30º: equivalência das questões "+(i+1));
for(const exam of [47,46,45]){
 const doc=db["exam"+exam];
 const covered=new Set();
 for(const r of doc.disciplinas||[])for(let n=r.start;n<=r.end;n++)covered.add(n);
 assert.equal(covered.size,80,exam+"º: disciplinas precisam cobrir todas as 80 questões");
}
summary.pendenciasDocumentais=[
 "30º: cotejar todas as letras com gabarito definitivo após recursos",
 "47º–14º: homologar extração dos 80 enunciados e quatro alternativas nos navegadores",
 "39º: usar gabarito independente por cor; não pressupor letras idênticas pela equivalência",
 "44º: ausência de tabela de equivalência eletrônica não invalida os gabaritos individuais"
];
assert.equal(summary.exames,34);
assert.equal(summary.cadernos,136);
assert.equal(summary.gabaritos,136);
assert.deepEqual(summary.erros,[]);
console.log(JSON.stringify({resultado:"PASSOU_AUDITORIA_ESTRUTURAL",...summary},null,2));
