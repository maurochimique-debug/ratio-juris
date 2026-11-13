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
const FONTES_ALTERNATIVAS=Object.freeze({
  cc:["https://www2.camara.leg.br/legin/fed/lei/2002/lei-10406-10-janeiro-2002-432893-normaatualizada-pl.html","https://legis.senado.leg.br/norma/552282/publicacao/34620807"],
  cpp:["https://legis.senado.leg.br/norma/528776/publicacao/34620736","https://www2.camara.leg.br/legin/fed/declei/1940-1949/decreto-lei-3689-3-outubro-1941-322206-normaatualizada-pe.html"],
  oab:["https://www2.camara.leg.br/legin/fed/lei/1994/lei-8906-4-julho-1994-349751-normaatualizada-pl.html","https://legis.senado.leg.br/norma/550782/publicacao/34619591"],
  cf:["https://legis.senado.leg.br/norma/579494/publicacao/16434817"],
  cpc:["https://www2.camara.leg.br/legin/fed/lei/2015/lei-13105-16-marco-2015-780273-normaatualizada-pl.html","https://legis.senado.leg.br/norma/584917/publicacao/34619046"],
  lindb:["https://legis.senado.leg.br/norma/529744/publicacao/34620738"],
  ctn:["https://www2.camara.leg.br/legin/fed/lei/1960-1969/lei-5172-25-outubro-1966-358971-normaatualizada-pl.html","https://legis.senado.leg.br/norma/547034/publicacao/34620375"]
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
  // A redação oficial pode representar "Art. 5º" como "Art. 5 o",
  // usar hífen, ponto, sobrescrito HTML ou espaço de largura variável.
  const parts=/^(\d{1,4})(?:-([A-Z]))?$/.exec(num);
  if(!parts)return null;
  const digits=parts[1];
  const quantity=digits.length>3?digits.slice(0,-3)+"\\.?"+digits.slice(-3):digits;
  const suffix=parts[2]?"\\s*[-–]\\s*"+parts[2]:"";
  const head="Art(?:igo)?\\.?\\s*"+quantity+suffix+"(?:(?:\\s*[º°o])?\\s*[.:-–—]?)(?=\\s|$)";
  const start=new RegExp("(^|\\n)\\s*"+head,"gim");
  const anyArticle=/(^|\n)\s*Art(?:igo)?\.?\s*(?:\d{1,2}\.\d{3}|\d{1,4})(?:\s*[-–]\s*[A-Z])?(?:\s*[º°o])?\s*[.:-–—]?(?=\s|$)/gim;
  const matches=[...text.matchAll(start)];
  const boundaries=[...text.matchAll(anyArticle)];
  for(const match of matches){
    const at=match.index+(match[1]?.length||0);
    const next=boundaries.find(x=>x.index>at+20);
    const passage=text.slice(at,next?.index??Math.min(text.length,at+12000)).trim();
    // Artigos curtos também são válidos; não descartar redação oficial com menos de 30 caracteres.
    if(passage.length>=12&&passage.length<=100000&&/^Art(?:igo)?\.?\s*\d/i.test(passage)){
      return passage;
    }
  }
  // Fontes legislativas distintas às vezes compactam artigos em uma única linha.
  // Segunda tentativa com limite estrito e marcador de artigo seguinte.
  const compact=text.replace(/\s+/g," ").trim();
  const inline=new RegExp("\\b"+head.replace("(?=\\s|$)","(?=\\s|$)"),"gi");
  const result=inline.exec(compact);
  if(!result)return null;
  const nextArticle=/(?:\s{1,})Art(?:igo)?\.?\s*\d{1,4}(?:\s*[-–]\s*[A-Z])?\s*[º°o]?\s*[.:-–—]?(?=\s|$)/gi;
  nextArticle.lastIndex=result.index+result[0].length;
  const next=nextArticle.exec(compact);
  const excerpt=compact.slice(result.index,Math.min(next?.index??compact.length,result.index+12000)).trim();
  return excerpt.length>=12?excerpt:null;
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
const candidates=[source,...(FONTES_ALTERNATIVAS[lei]||[])];
const failures=[];
for(const candidate of candidates){
 try{
  const response=await fetch(candidate,{headers:{"Accept":"text/html"},signal:AbortSignal.timeout(9500),redirect:"follow"});
  if(!response.ok){failures.push(response.status);continue;}
  const host=new URL(response.url).hostname;
  if(!["www.planalto.gov.br","planalto.gov.br","www2.camara.leg.br","legis.senado.leg.br"].includes(host)){
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
  source,alternativa:FONTES_ALTERNATIVAS[lei]?.[0]||null,
  aviso:"Use os links oficiais para consultar o texto completo. Nenhum conteúdo jurídico foi inventado.",
  motivos:failures
});
}
