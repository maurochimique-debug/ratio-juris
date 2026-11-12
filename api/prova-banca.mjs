import {Readable} from "node:stream";
/* RATIO JURIS: proxy somente para PDF de concurso juridico publicado pelo CEBRASPE. */
const SOURCES=Object.freeze({
  "cebraspe":"https://cdn.cebraspe.org.br/concursos/tj_am_19_servidor/arquivos/481_tjam005__matriz.pdf"
});

export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 res.setHeader("X-Content-Type-Options","nosniff");
 if(!["GET","HEAD"].includes(req.method))return res.status(405).end("Método não permitido.");
 const banca=String(req.query.banca||"");
 const original=SOURCES[banca];
 if(!original)return res.status(404).end("Documento oficial não cadastrado.");
 const range=typeof req.headers.range==="string"?req.headers.range:"";
 if(range&&!/^bytes=\d*-\d*$/.test(range))return res.status(416).end("Intervalo inválido.");
 const headers={Accept:"application/pdf"};if(range)headers.Range=range;
 try{
  const upstream=await fetch(original,{method:req.method,headers,redirect:"manual",signal:AbortSignal.timeout(30000)});
  if(![200,206].includes(upstream.status))return res.status(502).end("Fonte oficial indisponível.");
  const type=upstream.headers.get("content-type")||"";
  if(type&&!/pdf|octet-stream/i.test(type))return res.status(502).end("A fonte não retornou PDF.");
  res.status(upstream.status);
  res.setHeader("Content-Type","application/pdf");
  res.setHeader("Content-Disposition",'inline; filename="cebraspe-prova.pdf"');
  for(const name of ["content-length","content-range","accept-ranges","etag","last-modified"]){
   const value=upstream.headers.get(name);if(value)res.setHeader(name,value);
  }
  if(req.method==="HEAD"){await upstream.body?.cancel();return res.end();}
  if(!upstream.body)return res.status(502).end("PDF sem conteúdo.");
  const stream=Readable.fromWeb(upstream.body);
  stream.on("error",()=>{if(!res.headersSent)res.status(502);res.destroy();});
  stream.pipe(res);
 }catch(_){if(!res.headersSent)res.status(502).end("Falha ao transmitir documento oficial.");else res.destroy();}
}
