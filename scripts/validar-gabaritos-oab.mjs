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
let diferencasDeLetra=0;
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
     if((base==="*")!==(destino==="*")){
       avisos.push(`${n}º: conferir anulação do Tipo 1 questão ${q+1} e Tipo ${tipo} questão ${col[q]} na documentação oficial`);
     }
     if(base!==destino && base!=="*" && destino!=="*"){
       diferencasDeLetra++;
       // A numeração equivalente não garante a mesma letra: a banca pode
       // permutar também as alternativas. Sem fonte de correspondência
       // documental, uma divergência continua sendo erro a investigar.
       if(!exame.fonteCorrespondencia)
         adicionar(n,`Tipo ${tipo}, questão ${q+1}: letras diferentes na correspondência sem fonte documental`);
     }
     comparacoes++;
   }
 }
}
// Verifica correspondências documentais sem tratá-las como gabaritos corrigíveis.
for(const entry of db.archive||[]){
 const mapa=entry.correspondenciaDocumental;
 if(!mapa)continue;
 const numero=entry.exame;
 if(db["exam"+numero]?.gabaritos)continue;
 if(!Array.isArray(mapa)||mapa.length!==80){
   adicionar(numero,"correspondência documental incompleta");
   continue;
 }
 for(let tipo=2;tipo<=4;tipo++){
   const coluna=mapa.map(linha=>linha?.[tipo-2]);
   if(coluna.some(n=>!Number.isInteger(n)||n<1||n>80)||new Set(coluna).size!==80)
     adicionar(numero,`correspondência documental Tipo ${tipo} não é permutação 1–80`);
 }
 const anuladas=entry.anulacoesOficiaisTipo1||[];
 const porTipo=entry.anulacoesOficiaisPorTipo||{};
 for(let tipo=1;tipo<=4;tipo++){
   const esperado=tipo===1?anuladas:anuladas.map(n=>mapa[n-1]?.[tipo-2]);
   const armazenado=porTipo[String(tipo)]||[];
   if(esperado.join(",")!==armazenado.join(","))
     adicionar(numero,`anulações Tipo ${tipo} não coincidem com a tabela documental`);
 }
 avisos.push(`${numero}º: correspondência documental conferida estruturalmente; gabarito definitivo não integrado`);
}
console.log(JSON.stringify({
 escopo:"validação estrutural, não documental",
 examesIntegrados:integrados,
 comparacoes,
 diferencasDeLetra,
 erros,
 avisos
},null,2));
if(erros.length)process.exitCode=1;
