import assert from 'node:assert/strict';
import handler from '../api/artigo-oficial.mjs';
const casos=[
 {lei:'l9784',artigo:'6',termo:'O requerimento inicial do interessado'},
 {lei:'lep',artigo:'33',termo:'A jornada normal de trabalho'},
 {lei:'je',artigo:'5',termo:'O Juiz dirigirá o processo com liberdade'},
 {lei:'hediondos',artigo:'12',termo:'Esta lei entra em vigor na data de sua publicação'},
 {lei:'je',artigo:'23',termo:'tentativa de conciliação não presencial'},
 {lei:'clt',artigo:'240',termo:'Nos casos de urgência ou de acidente'}
];
async function consultar(caso){
 let code=200, response,headers={};
 const res={
  setHeader(k,v){headers[k]=v;return this;},
  status(n){code=n;return this;},
  json(body){response=body;return this;}
 };
 await handler({method:'GET',query:{lei:caso.lei,artigo:caso.artigo}},res);
 assert.equal(code,200,caso.lei+':'+caso.artigo);
 assert.equal(response.lei,caso.lei);
 assert.equal(response.artigo,caso.artigo);
 assert.ok(response.conteudo.includes(caso.termo));
 assert.ok(response.source.startsWith('https://'));
 assert.match(response.verificado_em,/^\d{4}-\d{2}-\d{2}$/);
}
for(const caso of casos)await consultar(caso);
console.log('PASS: '+casos.length+' artigos oficiais com transcrição verificada disponíveis sem depender da rede.');
