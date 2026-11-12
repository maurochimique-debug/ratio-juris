import {Readable} from "node:stream";
/* RATIO JURIS: gabaritos definitivos oficiais por exame, proxy fechado. */
const SOURCES=Object.freeze({
 "24":"https://s.oab.org.br/arquivos/2019/10/4d42e652-059a-4d53-bd1a-3b9d4664aed6.pdf",
 "25":"https://s.oab.org.br/arquivos/2019/10/4ec4500e-8317-4ff4-ade3-360c4041cf43.pdf",
 "26":"https://oab.fgv.br/arq/629/85363_GABARITOS%20PRELIMIARES_XXVI_EXAME_DE_ORDEM%20%281%29.pdf",
 "27":"https://s.oab.org.br/arquivos/2019/10/2f041f29-9c43-4409-9c32-171428a67b3a.pdf",
  "28":"https://oab.fgv.br/arq/631/283981_339414_GABARITOS_RETIFICADOS_XXVIII_EXAME_DE_ORDEM.pdf",
 "29":"https://s.oab.org.br/arquivos/2019/10/7f821bd9-45a2-420e-a62c-e1130eeefa52.pdf",
 "31":"https://s.oab.org.br/arquivos/2020/02/d25ed53f-a3cb-4b86-a76f-ba7c7caa15d3.pdf",
 "32":"https://oab.fgv.br/arq/635/590557_GABARITOS%20PRELIMINARES_XXXII_EXAME_DE_ORDEM_Proposta2_ANULACOES.pdf",
  "33":"https://s.oab.org.br/arquivos/2021/10/0f6c7896-6e63-4791-b96e-9861acd22b66.pdf",
  "34":"https://s.oab.org.br/arquivos/2022/02/81b3cb2f-bf13-41ad-9a3f-096b9c98f6bc.pdf",
  "35":"https://oab.fgv.br/arq/638/474880_GABARITOS%20DEFINITIVOS_XXXV_EXAME_DE_ORDEM.pdf",
  "36":"https://oab.fgv.br/arq/639/243215_GABARITOS%20DEFINITIVOS_XXXVI_EXAME_DE_ORDEM.pdf",
  "37":"https://s.oab.org.br/arquivos/2023/03/31073a05-1e9f-4f56-8b1a-bf537f62f9a3.pdf",
  "38": "https://s.oab.org.br/arquivos/2023/07/899aa8b1-ad89-4f8a-8eae-6fa62154c0da.pdf",
  "39": "https://s.oab.org.br/arquivos/2023/12/a664be30-2748-463b-b7a8-f4911a0ca0b8.pdf",
  "40": "https://s.oab.org.br/arquivos/2024/04/b64dd2cd-94fb-47fa-90b6-459e2d375a69.pdf",
  "41": "https://s.oab.org.br/arquivos/2024/08/84fbe13b-0efb-4b50-b729-aaba9edd95e5.pdf",
  "42": "https://s.oab.org.br/arquivos/2024/12/f7a7e51f-5468-402d-b594-c09a0e499b9f.pdf",
  "43": "https://s.oab.org.br/arquivos/2025/05/2d003602-840e-4ef2-9a4a-004144a35268.pdf",
  "44": "https://s.oab.org.br/arquivos/2025/09/b6fb7503-e2cf-4e9b-8b0a-9b822df591fe.pdf",
  "45": "https://s.oab.org.br/arquivos/2026/01/183549bb-ee34-4ac4-aefb-5962d96acca0.pdf",
  "46": "https://s.oab.org.br/arquivos/2026/05/0662d6ed-01a3-4ee5-905f-a6704d72992b.pdf",
  "47": "https://s.oab.org.br/arquivos/2026/09/572dc8e2-78a0-4e37-b6de-20709e2c59ab.pdf"
});

export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 res.setHeader("X-Content-Type-Options","nosniff");
 if(!["GET","HEAD"].includes(req.method))return res.status(405).end("Método não permitido.");
 const exame=String(req.query.exame||"");if(!/^\d{2}$/.test(exame))return res.status(400).end("Exame inválido.");
 const original=SOURCES[exame];
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
  res.setHeader("Content-Disposition",'inline; filename="oab-${exame}-gabarito.pdf"');
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
