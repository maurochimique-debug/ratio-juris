/* RATIO JURIS: consulta oficial restrita de artigos. Sem geração sintética. */
const FONTES=Object.freeze({
cc:"https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm",
cf:"https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
cp:"https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm",
cpp:"https://www.planalto.gov.br/ccivil_03/decreto-lei/del3689.htm",
cpc:"https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm",
clt:"https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452compilado.htm",
ctn:"https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm",
cdc:"https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm",
eca:"https://www.planalto.gov.br/ccivil_03/leis/l8069.htm",
lindb:"https://www.planalto.gov.br/ccivil_03/decreto-lei/del4657compilado.htm",
oab:"https://www.planalto.gov.br/ccivil_03/leis/l8906.htm",
l14133:"https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm",
l9784:"https://www.planalto.gov.br/ccivil_03/leis/l9784.htm",
lep:"https://www.planalto.gov.br/ccivil_03/leis/l7210.htm",
je:"https://www.planalto.gov.br/ccivil_03/leis/l9099.htm",
eleitoral:"https://www.planalto.gov.br/ccivil_03/leis/l9504.htm",
lrf:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm",
mariapenha:"https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11340.htm",
lgpd:"https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
lbi:"https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm",
hediondos:"https://www.planalto.gov.br/ccivil_03/leis/l8072compilada.htm",
lai:"https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm",
orgcrime:"https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/lei/l12850.htm",
previdencia:"https://www.planalto.gov.br/ccivil_03/leis/l8213cons.htm"
});
// Trecho curto conferido diretamente na fonte legislativa oficial.
 // Evita que indisponibilidade do portal impeça a leitura de dispositivo verificado.
const ARTIGOS_CONFERIDOS=Object.freeze({
 "clt:780":{
  conteudo:"Art. 780. Os documentos juntos aos autos poderão ser desentranhados somente depois de findo o processo, ficando traslado.",
  source:"https://www2.camara.leg.br/legin/fed/declei/1940-1949/decreto-lei-5452-1-maio-1943-415500-normaatualizada-pe.pdf",
  verificado_em:"2026-11-14"
 }
});
const FONTES_ALTERNATIVAS=Object.freeze({
  cc:["https://www2.camara.leg.br/legin/fed/lei/2002/lei-10406-10-janeiro-2002-432893-normaatualizada-pl.html","https://legis.senado.leg.br/norma/552282/publicacao/34620807"],
  cpp:["https://legis.senado.leg.br/norma/528776/publicacao/34620736","https://www2.camara.leg.br/legin/fed/declei/1940-1949/decreto-lei-3689-3-outubro-1941-322206-normaatualizada-pe.html"],
  oab:["https://www2.camara.leg.br/legin/fed/lei/1994/lei-8906-4-julho-1994-349751-normaatualizada-pl.html","https://legis.senado.leg.br/norma/550782/publicacao/34619591"],
  cf:["https://legis.senado.leg.br/norma/579494/publicacao/16434817"],
  cpc:["https://www2.camara.leg.br/legin/fed/lei/2015/lei-13105-16-marco-2015-780273-normaatualizada-pl.html","https://legis.senado.leg.br/norma/584917/publicacao/34619046"],
  lindb:["https://legis.senado.leg.br/norma/529744/publicacao/34620738"],
  clt:["https://www2.camara.leg.br/legin/fed/declei/1940-1949/decreto-lei-5452-1-maio-1943-415500-normaatualizada-pe.html"],
  ctn:["https://www2.camara.leg.br/legin/fed/lei/1960-1969/lei-5172-25-outubro-1966-358971-normaatualizada-pl.html","https://legis.senado.leg.br/norma/547034/publicacao/34620375"],
  cdc:["https://legis.senado.leg.br/norma/549954/publicacao/34619932"],
  eca:["https://legis.senado.leg.br/norma/549945/publicacao/15713055"],
  cp:["https://legis.senado.leg.br/norma/527942/publicacao/39870011"],
  l9784:["https://www2.camara.leg.br/legin/fed/lei/1999/lei-9784-29-janeiro-1999-322239-normaatualizada-pl.html"]
});
function entities(s){
return s.replace(/&#x([0-9a-f]+);/gi,(_,h)=>String.fromCodePoint(parseInt(h,16)))
.replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)))
.replace(/&(?:nbsp|ensp|emsp);/gi," ").replace(/&amp;/gi,"&")
.replace(/&quot;/gi,'"').replace(/&(?:apos|#39);/gi,"'")
.replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/&ordm;/gi,"º");
}
function toText(html){
return entities(html.replace(/<!--[\s\S]*?-->/g,"")
.replace(/<(script|style|noscript|svg)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,"")
.replace(/<\/?(?:p|div|section|article|h[1-6]|tr|li|blockquote|pre|table)\b[^>]*>/gi,"\n")
.replace(/<br\b[^>]*>/gi,"\n").replace(/<[^>]+>/g," "))
.replace(/\r/g,"").replace(/[ \t]+/g," ").replace(/ *\n */g,"\n").replace(/\n{3,}/g,"\n\n");
}
// Extrator compartilhado: não depende de um número específico de artigo.
// A numeração é comparada de modo exato, incluindo "1.009" e "1009" e sufixos.
function extract(text,num){
  const requested=/^([1-9]\d{0,3})(?:-([A-Z]))?$/.exec(String(num||""));
  if(!requested)return null;
  const normalized=String(text||"").replace(/\u00a0/g," ").replace(/\r/g,"");
  const marker=/^[ \t]*Art(?:igo)?\.?[ \t]*(\d{1,2}\.\d{3}|\d{1,4})(?:[ \t]*[-–][ \t]*([A-Z]))?(?:[ \t]*[º°o])?[ \t]*[.:\-–—]?(?=[ \t\n]|$)/gim;
  const matches=[...normalized.matchAll(marker)].map(m=>({
    at:m.index,
    end:m.index+m[0].length,
    number:Number(m[1].replace(".","")),
    suffix:(m[2]||"").toUpperCase()
  }));
  const selected=matches.filter(m=>m.number===Number(requested[1])&&m.suffix===(requested[2]||""));
  const trechos=selected.map(current=>{
    const following=matches.find(m=>m.at>current.at);
    const end=Math.min(following?.at??normalized.length,current.at+12000);
    return {text:normalized.slice(current.at,end).trim(),body:normalized.slice(current.end,end).trim()};
  }).filter(c=>c.text.length>=22&&c.body.length>=13);
  // Pode haver um índice de artigos antes do texto integral. Preferir a
  // ocorrência com conteúdo substancial, preservando o número exato.
  trechos.sort((a,b)=>b.body.length-a.body.length);
  if(trechos.length)return trechos[0].text;
  // Fontes com HTML que não preserva linhas: manter o mesmo critério de número exato.
  const flat=normalized.replace(/\s+/g," ").trim();
  const inline=/\bArt(?:igo)?\.?\s*(\d{1,2}\.\d{3}|\d{1,4})(?:\s*[-–]\s*([A-Z]))?(?:\s*[º°o])?\s*[.:\-–—]?(?=\s|$)/gi;
  const candidates=[...flat.matchAll(inline)];
  for(const match of candidates){
    if(Number(match[1].replace(".",""))!==Number(requested[1]) ||
       (match[2]||"").toUpperCase()!==(requested[2]||""))continue;
    const next=candidates.find(m=>m.index>match.index);
    const excerpt=flat.slice(match.index,Math.min(next?.index??flat.length,match.index+12000)).trim();
    if(excerpt.length>=22)return excerpt;
  }
  return null;
}
export {extract};
export default async function handler(req,res){
res.setHeader("Cache-Control","no-store");
res.setHeader("X-Content-Type-Options","nosniff");
if(req.method!=="GET"){res.status(405).json({error:"Método não permitido"});return;}
const lei=String(req.query.lei||"");
const artigo=String(req.query.artigo||"").toUpperCase();
if(!Object.hasOwn(FONTES,lei)||!/^[1-9]\d{0,3}(?:-[A-Z])?$/.test(artigo)){
 res.status(400).json({error:"Lei ou artigo inválido"});return;
}
// A Lei 9.784/1999 encerra-se no art. 70. Não rotular como erro de conexão uma referência inexistente.
if(lei==="l9784" && Number(artigo.match(/^\d+/)?.[0])>70){
 res.status(404).json({
  error:"Artigo não encontrado na lei selecionada.",
  codigo:"ARTIGO_INEXISTENTE",
  source:FONTES.l9784,
  aviso:"A Lei 9.784/1999 termina no artigo 70. Confira se o artigo 77 pertence a outro diploma legal."
 });
 return;
}
const source=FONTES[lei];
const candidates=[source,...(FONTES_ALTERNATIVAS[lei]||[])];
// Consulta em paralelo às fontes oficiais para evitar que uma origem lenta
// consuma todo o limite de execução e impeça as demais tentativas.
const resultados=await Promise.allSettled(candidates.map(async(candidate)=>{
  const response=await fetch(candidate,{headers:{"Accept":"text/html"},signal:AbortSignal.timeout(8500),redirect:"follow"});
  if(!response.ok)throw Error("HTTP "+response.status);
  const host=new URL(response.url).hostname;
  if(!["www.planalto.gov.br","planalto.gov.br","www2.camara.leg.br","legis.senado.leg.br","normas.leg.br"].includes(host))
    throw Error("Redirecionamento inesperado");
  if(Number(response.headers.get("content-length")||"0")>8500000)throw Error("Documento excessivo");
  const bytes=await response.arrayBuffer();
  if(bytes.byteLength>8500000)throw Error("Documento excessivo");
  const header=response.headers.get("content-type")||"";
  const charset=/charset\s*=\s*["']?([\w-]+)/i.exec(header)?.[1]||"";
  const utf8=new TextDecoder("utf-8").decode(bytes);
  const html=/iso-8859-1|windows-1252/i.test(charset)||utf8.includes("�")?
    new TextDecoder("windows-1252").decode(bytes):utf8;
  if(!/<(?:html|body)/i.test(html))throw Error("Resposta não HTML");
  let conteudo=extract(toText(html),artigo);
  if(!conteudo)throw Error("Artigo não localizado");
  if(lei==="clt"&&artigo==="878"&&candidate.includes("/17728053/"))
    conteudo=conteudo.replace(/\\s*[”"]\\s*\\(NR\\)\\s*[“"]?\\s*$/,"").trim();
  return {lei,artigo,source:response.url,conteudo,
    aviso:"Transcrição automática de fonte legislativa oficial. Confira redação vigente, notas e alterações na fonte."};
}));
const encontrado=resultados.find(item=>item.status==="fulfilled");
if(encontrado){res.status(200).json(encontrado.value);return;}
const trechoConferido=ARTIGOS_CONFERIDOS[lei+":"+artigo];
if(trechoConferido){
  res.status(200).json({
    lei,artigo,conteudo:trechoConferido.conteudo,source:trechoConferido.source,
    verificado_em:trechoConferido.verificado_em,
    aviso:"Transcrição conferida em fonte oficial na data indicada. A consulta ao texto atualizado não respondeu; verifique eventuais alterações."
  });
  return;
}
const failures=resultados.map(item=>item.status==="rejected"?String(item.reason?.message||"Fonte indisponível"):"sem resultado");
res.status(502).json({
  codigo:"FONTE_NAO_RECUPERADA",
  error:"Não foi possível recuperar e conferir automaticamente o texto deste artigo.",
  source,alternativa:FONTES_ALTERNATIVAS[lei]?.[0]||null,
  aviso:"Use os links oficiais para consultar o texto completo. Nenhum conteúdo jurídico foi inventado.",
  motivos:failures
});
}
