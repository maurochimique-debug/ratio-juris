// Auditoria estrutural de gabaritos do RatioJuris.
// Uso: node scripts/validar-gabaritos-oab.mjs
// A aprovação estrutural NÃO substitui a conferência documental com a OAB/FGV.
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve,dirname} from "node:path";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const source=readFileSync(resolve(root,"oab-data.js"),"utf8");
const match=source.match(/window\.RATIO_OAB_DATA\s*=\s*(\{[\s\S]*\});?\s*$/);
if(!match)throw new Error("Formato do catálogo OAB não reconhecido");
const db=JSON.parse(match[1]);
const erros=[];
const avisos=[];
let comparacoes=0;
let integrados=0;
const adicionar=(exam,mensagem)=>erros.push(`${exam}º: ${mensagem}`);
for(let n=47;n>=10;n--){
 const exame=db["exam"+n];
 if(!exame){
   avisos.push(`${n}º: sem gabaritos integrados; correção automática deve continuar bloqueada`);
   continue;
 }
 integrados++;
 if(!Array.isArray(exame.cadernos)||exame.cadernos.length!==4)adicionar(n,"não há quatro cadernos");
 if(!Array.isArray(exame.gabaritos)||exame.gabaritos.length!==4){
   adicionar(n,"não há quatro sequências de gabarito");
   continue;
 }
 exame.gabaritos.forEach((g,i)=>{
   if(typeof g!=="string"||g.length!==80||/[^ABCD*]/.test(g))
     adicionar(n,`gabarito Tipo ${i+1} não contém exatamente 80 códigos válidos`);
 });
 if(!exame.correspondencia){
   avisos.push(`${n}º: sem correspondência cadastrada; verificar os quatro tipos na fonte oficial`);
   continue;
 }
 if(!Array.isArray(exame.correspondencia)||exame.correspondencia.length!==80){
   adicionar(n,"tabela de correspondência não contém 80 linhas");
   continue;
 }
 for(let tipo=2;tipo<=4;tipo++){
   const col=exame.correspondencia.map(row=>row?.[tipo-2]);
   if(col.some(v=>!Number.isInteger(v)||v<1||v>80)||new Set(col).size!==80){
     adicionar(n,`correspondência do Tipo ${tipo} não é permutação de 1 a 80`);
     continue;
   }
   for(let q=0;q<80;q++){
     const base=exame.gabaritos[0][q],destino=exame.gabaritos[tipo-1][col[q]-1];
     if(base!==destino && base!=="*" && destino!=="*")
       adicionar(n,`Tipo ${tipo}, questão ${q+1}: divergência com questão correspondente ${col[q]}`);
     comparacoes++;
   }
 }
}
console.log(JSON.stringify({
 escopo:"validação estrutural, não documental",
 examesIntegrados:integrados,
 comparacoes,
 erros,
 avisos
},null,2));
if(erros.length)process.exitCode=1;
