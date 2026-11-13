// Proteção contra alterações acidentais dos gabaritos definitivos publicados.
// Valores transcritos e confrontados com os PDFs da OAB/FGV.
// Executar: node scripts/teste-gabaritos-oficiais-39-44.mjs
import {readFileSync} from "node:fs";
import {dirname,resolve} from "node:path";
import {fileURLToPath} from "node:url";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const source=readFileSync(resolve(root,"oab-data.js"),"utf8");
const match=source.match(/window\.RATIO_OAB_DATA\s*=\s*(\{[\s\S]*\});?\s*$/);
if(!match)throw new Error("Fonte OAB não encontrada");
const data=JSON.parse(match[1]);
const oficiais={
  "39": [
    "ADDCADBADDCBACABB*ACBACACDADCDADCABCCDBDCDBBCBAB*ABDCDDDABBBDA*CDAACCBDBBABCBAAC",
    "CADDAADBDDBCBACA*BCABAACCCDADADADCCBDBDCDCBBCBAAB*DBDCDDAABBBDC*CDAABCBDBBACCBAA",
    "DCADBAADDDABCBACB*CAABCADCCDACADADBCBDCDCDBBBC*AABDDBDCDDAABBBAC*CDACBABDBBACCBA",
    "ADBAADDCDDCABCBA*BACABACADCCDDCADACBDCDCDBBBBCB*AACDDDBDBDAABBAAC*CDBCBABDBAACCB"
  ],
  "44": [
    "CBBACBCCADCDCDDBDADCDABCCCDBADAADCBADCCADBAABACBBACDAABDDDBCDCBDCBABAADCBACADBBA",
    "CBBBCCCADADCDDBCADCDDACBACCDBADCDAABCDBDCAAAABACBBDCDAABDBCDCDCBABBDAACABCDBBAAD",
    "BCACBBCCADDDCBCDDACDADCBBACCDCDAADBABDCACDAABABACBABDCDACDDBCDBBDCBAAACDCABAADBB",
    "BACCCBCBDABDDCDCADDCADBCDBACCDCDAAABDBDCACAABABBACDAABDCBCDCDDABBDCBAAABCDCBAADB"
  ]
};
const urls={
 "39":"https://s.oab.org.br/arquivos/2023/12/a664be30-2748-463b-b7a8-f4911a0ca0b8.pdf",
 "44":"https://s.oab.org.br/arquivos/2025/09/b6fb7503-e2cf-4e9b-8b0a-9b822df591fe.pdf"
};
let errors=[];
for(const [n,keys] of Object.entries(oficiais)){
 const exam=data["exam"+n];
 for(let i=0;i<4;i++){
  const actual=exam?.gabaritos?.[i];
  if(actual!==keys[i])errors.push(n+"º Tipo "+(i+1)+": resposta diferente do PDF "+urls[n]);
 }
}
const keys39=data.exam39?.gabaritos||[];
const map=data.exam39?.correspondencia||[];
if(map.length!==80)errors.push("39º: correspondência oficial incompleta");
const warnings=[];
if(map.length===80){
 for(let tipo=1;tipo<4;tipo++)for(let q=0;q<80;q++){
  const p=map[q][tipo-1]-1;
  if((keys39[0]?.[q]==="*")!==(keys39[tipo]?.[p]==="*"))
   warnings.push("39º tipo "+(tipo+1)+": revisar anulação Q"+(q+1)+" -> Q"+(p+1));
 }
}
console.log(JSON.stringify({validatedSources:urls,checkedAnswers:640,
 errors,warnings,level:"regressão documental dos gabaritos; não homologação integral de questões"},null,2));
if(errors.length)process.exitCode=1;
