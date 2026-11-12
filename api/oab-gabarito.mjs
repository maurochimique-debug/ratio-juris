/* RATIO JURIS: gabaritos definitivos oficiais por exame, proxy fechado. */
const SOURCES=Object.freeze({
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
function error(status,message){return new Response(message,{status,headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-store"}})}
export default {
  async fetch(request){
    if(!["GET","HEAD"].includes(request.method))return error(405,"Método não permitido");
    const exam=new URL(request.url).searchParams.get("exame");
    const original=SOURCES[exam];
    if(!original)return error(404,"Gabarito definitivo não integrado nesta edição");
    const range=request.headers.get("range");
    if(range&&!/^bytes=\d*-\d*$/.test(range))return error(416,"Intervalo inválido");
    const headers=new Headers({Accept:"application/pdf"});
    if(range)headers.set("Range",range);
    try{
      const response=await fetch(original,{method:request.method,headers,redirect:"manual",signal:AbortSignal.timeout(35000)});
      if(![200,206].includes(response.status))return error(502,"Gabarito oficial indisponível na origem");
      const type=response.headers.get("content-type")||"";
      if(type&&!/pdf|octet-stream/i.test(type))return error(502,"A fonte não retornou PDF");
      const out=new Headers({"Content-Type":"application/pdf","Content-Disposition":'inline; filename="oab-'+exam+'-gabarito-definitivo.pdf"',"X-Content-Type-Options":"nosniff","Cache-Control":"public,s-maxage=1200,max-age=600"});
      for(const key of ["content-length","content-range","accept-ranges"]){const value=response.headers.get(key);if(value)out.set(key,value)}
      return new Response(request.method==="HEAD"?null:response.body,{status:response.status,headers:out});
    }catch(_){return error(502,"Não foi possível carregar o gabarito neste momento")}
  }
};