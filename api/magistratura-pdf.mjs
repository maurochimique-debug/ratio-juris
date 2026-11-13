import {Readable} from "node:stream";
/* RatioJuris: proxy de documento oficial específico de magistratura, sem URL arbitrária. */
const DOCUMENTOS=Object.freeze({
 "tjsp189-prova1":"https://documento.vunesp.com.br/documento/stream/MjQwOTM0MQ%3D%3D",
 "tjsp189-gabarito":"https://documento.vunesp.com.br/documento/stream/MjY1Mjc0Nw%3D%3D"
});
export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 res.setHeader("X-Content-Type-Options","nosniff");
 if(!["GET","HEAD"].includes(req.method))return res.status(405).end("Método não permitido");
 const documento=String(req.query.documento||"");
 const source=DOCUMENTOS[documento];
 if(!source)return res.status(404).end("Documento não cadastrado");
 const range=String(req.headers.range||"");
 if(range&&!/^bytes=\d*-\d*$/.test(range))return res.status(416).end("Intervalo inválido");
 try{
  const upstream=await fetch(source,{method:req.method,headers:{Accept:"application/pdf",...(range?{Range:range}:{})},redirect:"follow",signal:AbortSignal.timeout(25000)});
  if(!["documento.vunesp.com.br","www.vunesp.com.br"].includes(new URL(upstream.url).hostname))
   return res.status(502).end("Redirecionamento não autorizado");
  if(![200,206].includes(upstream.status))return res.status(502).end("Documento oficial indisponível");
  const type=String(upstream.headers.get("content-type")||"");
  if(type&&!/pdf|octet-stream/i.test(type))return res.status(502).end("A fonte não retornou PDF");
  res.status(upstream.status);
  res.setHeader("Content-Type","application/pdf");
  res.setHeader("Content-Disposition",'inline; filename="'+documento+'.pdf"');
  for(const field of ["content-length","content-range","accept-ranges"]){
   const value=upstream.headers.get(field);if(value)res.setHeader(field,value);
  }
  if(req.method==="HEAD"){await upstream.body?.cancel();return res.end()}
  if(!upstream.body)return res.status(502).end("Resposta sem PDF");
  const stream=Readable.fromWeb(upstream.body);
  stream.on("error",()=>res.destroy());
  stream.pipe(res);
 }catch(_){if(!res.headersSent)res.status(502).end("Falha ao ler documento oficial");else res.destroy();}
}