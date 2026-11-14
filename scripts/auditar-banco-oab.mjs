// node scripts/auditar-banco-oab.mjs
// Auditoria estática: NÃO certifica origem textual, letras ou PDF pela leitura visual.
import { readFileSync } from "node:fs";
const source=readFileSync(new URL("../oab-data.js", import.meta.url),"utf8");
const match=source.match(/window\.RATIO_OAB_DATA\s*=\s*(\{[\s\S]*\});?\s*$/);
if(!match)throw new Error("Catálogo OAB não encontrado");
const db=JSON.parse(match[1]);
const expected=[1,2,3,4];
const records=[],issues=[];
for(let n=47;n>=10;n--){
 const e=db["exam"+n];
 if(!e){records.push({exame:n,cadernos:0,gabaritosValidos:0,estado:"catálogo histórico separado"});continue;}
 const books=e.cadernos||[];
 const keys=e.gabaritos||[];
 const valid=expected.filter(t=>typeof keys[t-1]==="string"&&keys[t-1].length===80).length;
 const distinct=books.filter(x=>x&&typeof x.pdf==="string"&&/^https:\/\/(?:s\.oab\.org\.br|oab\.fgv\.br)\//.test(x.pdf)).length;
 if(distinct!==4)issues.push(n+"º: número incorreto de PDFs cadastrados");
 if(valid!==4)issues.push(n+"º: quatro gabaritos de 80 posições não identificados");
 if(new Set(books.map(x=>x?.tipo)).size!==4)issues.push(n+"º: tipos de caderno inconsistentes");
 records.push({exame:n,cadernos:distinct,gabaritosValidos:valid,estado:valid===4&&distinct===4?"estrutura registrada":"pendente"});
}
const summary={
 escopo:"estrutura de metadados e gabaritos; não homologa enunciados nem conteúdo legal",
 examesEscopo:38,
 examesComEstruturaCompleta:records.filter(x=>x.cadernos===4&&x.gabaritosValidos===4).length,
 examesNoCatalogoHistorico:records.filter(x=>x.cadernos===0).map(x=>x.exame),
 posicoesDeQuestaoCandidatas:records.filter(x=>x.cadernos===4&&x.gabaritosValidos===4).length*80,
 inconsistencias:issues
};
console.log(JSON.stringify(summary,null,2));
if(issues.length)process.exitCode=1;
