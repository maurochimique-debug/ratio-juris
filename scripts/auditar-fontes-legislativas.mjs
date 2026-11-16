// Health check: queries official-source-backed article 1 of each registered diploma.
// Does not publish legal text or alter production records.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const api=readFileSync(new URL('../api/artigo-oficial.mjs',import.meta.url),'utf8');
const definitions=api.match(/const FONTES=Object\.freeze\(\{([\s\S]*?)\}\);/)?.[1];
if(!definitions)throw Error('Mapa de diplomas não encontrado');
const laws=[...definitions.matchAll(/^\s*([a-z][a-z0-9]*):"https:\/\//gm)].map(m=>m[1]);
if(laws.length!==34)throw Error('Quantidade inesperada de diplomas: '+laws.length);
const origin=(process.env.RATIO_JURIS_BASE_URL||'https://ratiojuris.vercel.app').replace(/\/$/,'');
if(!/^https:\/\/[a-z0-9.-]+$/i.test(origin))throw Error('Origem inválida');
const checks=[];
async function check(law){
 const start=Date.now();
 try{
  // Artigo 1º da Lei 9.605 é vetado; utilizar artigo substantivo para a auditoria.
  const artigo=law==='crimesambientais'?'2':'1';
  const response=await fetch(origin+'/api/artigo-oficial?lei='+encodeURIComponent(law)+'&artigo='+artigo,{
   signal:AbortSignal.timeout(22000),headers:{Accept:'application/json'}});
  const json=await response.json().catch(()=>null);
  const valid=response.ok&&json?.lei===law&&json?.artigo===artigo&&
    typeof json.conteudo==='string'&&new RegExp('^Art(?:igo)?\\.?\\s*'+artigo+'(?:[º°o])?(?=[\\s.:\\-–—])','i').test(json.conteudo)&&
    typeof json.source==='string'&&/^https:\/\//.test(json.source);
  return {lei:law,ok:Boolean(valid),http:response.status,ms:Date.now()-start,
    origem:valid?new URL(json.source).hostname:null,
    codigo:valid?null:(json?.codigo||'RESPOSTA_INVALIDA')};
 }catch(e){
  return {lei:law,ok:false,http:null,ms:Date.now()-start,codigo:e?.name||'FALHA_REDE'};
 }
}
for(let i=0;i<laws.length;i+=2){
 checks.push(...await Promise.all(laws.slice(i,i+2).map(check)));
}
const success=checks.filter(x=>x.ok).length;
mkdirSync('artifacts',{recursive:true});
writeFileSync('artifacts/saude-leitor-legislativo.json',JSON.stringify({
 checkedAt:new Date().toISOString(),baseUrl:origin,total:checks.length,success,checks
},null,2)+'\n');
console.log('Leitor legislativo: '+success+'/'+checks.length+' diplomas com artigo 1 retornado.');
for(const c of checks)console.log((c.ok?'OK  ':'FAIL')+' '+c.lei.padEnd(14)+' '+String(c.http||'---')+' '+c.ms+'ms '+(c.codigo||''));
if(success!==checks.length)process.exitCode=1;
