/* RATIO JURIS: proxy somente para PDF de concurso juridico publicado pelo CEBRASPE. */
const SOURCES=Object.freeze({
  "cebraspe":"https://cdn.cebraspe.org.br/concursos/tj_am_19_servidor/arquivos/481_tjam005__matriz.pdf"
});
function error(status,message){return new Response(message,{status,headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-store"}})}
export default {
  async fetch(request){
    if(!["GET","HEAD"].includes(request.method))return error(405,"Método não permitido");
    const bank=new URL(request.url).searchParams.get("banca");
    const original=SOURCES[bank];
    if(!original)return error(404,"Caderno não cadastrado");
    const range=request.headers.get("range");
    if(range&&!/^bytes=\d*-\d*$/.test(range))return error(416,"Intervalo inválido");
    const headers=new Headers({Accept:"application/pdf"});
    if(range)headers.set("Range",range);
    try{
      const response=await fetch(original,{method:request.method,headers,redirect:"manual",signal:AbortSignal.timeout(20000)});
      if(![200,206].includes(response.status))return error(502,"Fonte temporariamente indisponível");
      const ct=response.headers.get("content-type")||"";
      if(ct&&!/pdf|octet-stream/i.test(ct))return error(502,"Fonte não retornou PDF");
      const out=new Headers({"Content-Type":"application/pdf","Content-Disposition":'inline; filename="cebraspe-tjam-direito-2019.pdf"',"X-Content-Type-Options":"nosniff","Cache-Control":"public,max-age=600"});
      for(const key of ["content-length","content-range","accept-ranges"]){const v=response.headers.get(key);if(v)out.set(key,v)}
      return new Response(request.method==="HEAD"?null:response.body,{status:response.status,headers:out});
    }catch(_){return error(502,"Falha na consulta ao documento oficial")}
  }
};