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
l9784:"https://www.planalto.gov.br/ccivil_03/leis/l9784.htm"
});
const FONTES_ALTERNATIVAS=Object.freeze({
  cc:"https://www2.camara.leg.br/legin/fed/lei/2002/lei-10406-10-janeiro-2002-432893-normaatualizada-pl.html",
  oab:"https://www2.camara.leg.br/legin/fed/lei/1994/lei-8906-4-julho-1994-349751-normaatualizada-pl.html"
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
function extract(text,num){
const n=num.replace(/-/g,"[-–]");
const pattern=new RegExp("(^|\\n)\\s*Art(?:igo)?\\.?\\s*"+n+"(?:[º°]|\\.)?\\s*(?:[-–—.]|\\s)","gim");
const candidates=[...text.matchAll(pattern)];
const all=[...text.matchAll(/(^|\n)\s*Art(?:igo)?\.?\s*\d{1,4}(?:[-–][A-Za-z])?(?:[º°]|\.)?\s*(?:[-–—.]|\s)/gim)];
for(const m of candidates){
  const at=m.index+(m[1]?.length||0);
  const next=all.find(x=>x.index>at+20);
  const snippet=text.slice(at,next?.index??Math.min(text.length,at+12000)).trim();
  if(snippet.length>=45 && snippet.length<=12000 && /Art(?:igo)?\.?\s*\d+/i.test(snippet.slice(0,50)))return snippet;
}
return null;
}
export default async function handler(req,res){
res.setHeader("Cache-Control","no-store");
res.setHeader("X-Content-Type-Options","nosniff");
if(req.method!=="GET"){res.status(405).json({error:"Método não permitido"});return;}
const lei=String(req.query.lei||"");
const artigo=String(req.query.artigo||"").toUpperCase();
if(!Object.hasOwn(FONTES,lei)||!/^[1-9]\d{0,3}(?:-[A-Z])?$/.test(artigo)){
 res.status(400).json({error:"Lei ou artigo inválido"});return;
}
const source=FONTES[lei];
const candidates=[source,FONTES_ALTERNATIVAS[lei]].filter(Boolean);
const failures=[];
for(const candidate of candidates){
 try{
  const response=await fetch(candidate,{headers:{"Accept":"text/html"},signal:AbortSignal.timeout(9500),redirect:"follow"});
  if(!response.ok){failures.push(response.status);continue;}
  const host=new URL(response.url).hostname;
  if(!["www.planalto.gov.br","planalto.gov.br","www2.camara.leg.br"].includes(host)){
    failures.push("redirecionamento");continue;
  }
  if(Number(response.headers.get("content-length")||"0")>6000000){failures.push("tamanho");continue;}
  const bytes=await response.arrayBuffer();
  if(bytes.byteLength>6000000){failures.push("tamanho");continue;}
  const header=response.headers.get("content-type")||"";
  const charset=/charset\s*=\s*["']?([\w-]+)/i.exec(header)?.[1]||"";
  const utf8=new TextDecoder("utf-8").decode(bytes);
  const html=/iso-8859-1|windows-1252/i.test(charset)||utf8.includes("�")?
    new TextDecoder("windows-1252").decode(bytes):utf8;
  if(!/<(?:html|body)/i.test(html)){failures.push("html");continue;}
  const conteudo=extract(toText(html),artigo);
  if(!conteudo){failures.push("artigo não localizado");continue;}
  res.status(200).json({
    lei,artigo,source:response.url,conteudo,
    aviso:"Transcrição automática de fonte legislativa oficial. Confira redação vigente, notas e alterações na fonte."
  });
  return;
 }catch(_){failures.push("fonte indisponível");}
}
res.status(502).json({
  error:"Não foi possível recuperar com segurança o artigo solicitado.",
  source,alternativa:FONTES_ALTERNATIVAS[lei]||null,
  aviso:"Use os links oficiais para consultar o texto completo. Nenhum conteúdo jurídico foi inventado."
});
}
