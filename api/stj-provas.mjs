import {Readable} from "node:stream";
/* Somente PDFs oficiais Cebraspe/STJ 2018, identificados por cargo e modalidade.
   Não oferece outros arquivos ou URLs dinâmicas. */
const SOURCES=Object.freeze({
 "basicos":"https://cdn.cebraspe.org.br/concursos/STJ_18/arquivos/MATRIZ_385_STJCB1__PAG_3.PDF",
 "especificos":"https://cdn.cebraspe.org.br/concursos/STJ_18/arquivos/MATRIZ_385_STJ007__PAG_4.PDF",
 "gabarito-basicos":"https://cdn.cebraspe.org.br/concursos/STJ_18/arquivos/GAB_DEFINITIVO_385_STJCB1.PDF",
 "gabarito-especificos":"https://cdn.cebraspe.org.br/concursos/STJ_18/arquivos/GAB_DEFINITIVO_385_STJ007.PDF",
 "tecnico-basicos":"https://cdn.cebraspe.org.br/concursos/STJ_18/arquivos/MATRIZ_385_STJCB4__PAG_3.PDF",
 "tecnico-especificos":"https://cdn.cebraspe.org.br/concursos/STJ_18/arquivos/MATRIZ_385_STJ009__PAG_3.PDF",
 "tecnico-gabarito-basicos":"https://cdn.cebraspe.org.br/concursos/STJ_18/arquivos/GAB_DEFINITIVO_385_STJCB4.PDF",
 "tecnico-gabarito-especificos":"https://cdn.cebraspe.org.br/concursos/STJ_18/arquivos/GAB_DEFINITIVO_385_STJ009.PDF"
});
export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 res.setHeader("X-Content-Type-Options","nosniff");
 if(!["GET","HEAD"].includes(req.method))return res.status(405).end("Método não permitido.");
 const documento=String(req.query.documento||"");
 const original=SOURCES[documento];
 if(!original)return res.status(404).end("Documento oficial não cadastrado.");
 const range=typeof req.headers.range==="string"?req.headers.range:"";
 if(range&&!/^bytes=\d*-\d*$/.test(range))return res.status(416).end("Intervalo inválido.");
 try{
  const upstream=await fetch(original,{method:req.method,headers:{Accept:"application/pdf",...(range?{Range:range}:{})},redirect:"manual",signal:AbortSignal.timeout(25000)});
  if(![200,206].includes(upstream.status))return res.status(502).end("Fonte Cebraspe indisponível.");
  const contentType=upstream.headers.get("content-type")||"";
  if(contentType&&!/pdf|octet-stream/i.test(contentType))return res.status(502).end("A fonte não retornou PDF.");
  res.status(upstream.status);
  res.setHeader("Content-Type","application/pdf");
  res.setHeader("Content-Disposition",'inline; filename="stj-2018-'+documento+'.pdf"');
  for(const name of ["content-length","content-range","accept-ranges"]){
   const value=upstream.headers.get(name);if(value)res.setHeader(name,value);
  }
  if(req.method==="HEAD"){await upstream.body?.cancel();return res.end();}
  if(!upstream.body)return res.status(502).end("PDF vazio.");
  const stream=Readable.fromWeb(upstream.body);
  stream.on("error",()=>res.destroy());
  stream.pipe(res);
 }catch(_){if(!res.headersSent)res.status(502).end("Falha na transmissão do PDF oficial.");else res.destroy();}
}