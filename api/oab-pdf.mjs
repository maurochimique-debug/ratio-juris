/* Proxy de transmissão temporária de PDFs oficiais OAB/FGV, sem armazenar ou editar cadernos.
 * Lista fechada de fontes de provas já verificadas no repositório. Não é um proxy público aberto.
 * Os enunciados continuam originários de s.oab.org.br.
 */
const SOURCES = Object.freeze({
  "40": [
    "https://s.oab.org.br/arquivos/2024/03/11dfd35e-c74b-4c5a-8d8c-ce6c9c40505a.pdf",
    "https://s.oab.org.br/arquivos/2024/03/e3bb3c7b-fab4-410c-9c6c-9bf5b4e3980a.pdf",
    "https://s.oab.org.br/arquivos/2024/03/104cbe04-7e63-4917-a7c9-c17c81dcfc0a.pdf",
    "https://s.oab.org.br/arquivos/2024/03/7e424b0d-ac36-4d06-9f8d-f3d7f4cf9a26.pdf"
  ],
  "41": [
    "https://s.oab.org.br/arquivos/2024/07/19c7a9d4-0c6f-420c-90e2-113d66ded881.pdf",
    "https://s.oab.org.br/arquivos/2024/07/df1893ce-865b-4e7f-a15f-76f21964280f.pdf",
    "https://s.oab.org.br/arquivos/2024/07/f5c23a40-5b20-44a5-b0f4-dc44d1d67034.pdf",
    "https://s.oab.org.br/arquivos/2024/07/cba6ee4b-2e34-4341-9b8d-d0c0f83cb12e.pdf"
  ],
  "42": [
    "https://s.oab.org.br/arquivos/2024/12/6588c7e0-3c87-4efd-a0f5-ebef5dfcbb74.pdf",
    "https://s.oab.org.br/arquivos/2024/12/8c7a49ec-1f62-417a-b45a-9c9dc958019d.pdf",
    "https://s.oab.org.br/arquivos/2024/12/20701071-ee55-45d2-809e-3d5d981221c1.pdf",
    "https://s.oab.org.br/arquivos/2024/12/f3a737bc-fa2f-44ef-b01c-617e1623118b.pdf"
  ],
  "43": [
    "https://s.oab.org.br/arquivos/2025/04/145104f9-1301-453d-9079-3d5af4f8e60a.pdf",
    "https://s.oab.org.br/arquivos/2025/04/a7b60f68-32b5-44a8-9fea-41d9c4f2ccbc.pdf",
    "https://s.oab.org.br/arquivos/2025/04/f357a8e2-04de-4c73-be4f-8bf1230fc835.pdf",
    "https://s.oab.org.br/arquivos/2025/04/bbd4fe5e-27d3-4523-bb18-27ebe7353d3f.pdf"
  ],
  "44": [
    "https://s.oab.org.br/arquivos/2025/08/fda2cc49-fbbd-4893-9b75-0f61c177cd5d.pdf",
    "https://s.oab.org.br/arquivos/2025/08/5c87b5a1-5cb9-4250-9481-6ba64f818c9f.pdf",
    "https://s.oab.org.br/arquivos/2025/08/f573455a-d068-4dd0-90b7-8bb13606174d.pdf",
    "https://s.oab.org.br/arquivos/2025/08/b3b68be6-cbb9-411a-9bb7-3c06230d2b16.pdf"
  ],
  "45": [
    "https://s.oab.org.br/arquivos/2025/12/d092ea6d-5bdc-435e-a043-31520b8cdc95.pdf",
    "https://s.oab.org.br/arquivos/2025/12/d9062216-ffa0-4fa7-a7d5-32d2ae7a9ea0.pdf",
    "https://s.oab.org.br/arquivos/2025/12/1e79b996-7b50-464c-a06b-0b0d83b7a291.pdf",
    "https://s.oab.org.br/arquivos/2025/12/0758edda-55ff-4797-aa31-42686d57ecf1.pdf"
  ],
  "46": [
    "https://s.oab.org.br/arquivos/2026/05/b5f2a4bd-8885-4f42-909f-a2ecac329dab.pdf",
    "https://s.oab.org.br/arquivos/2026/05/9e37bd12-07a3-4cdb-aef9-09bb663721c5.pdf",
    "https://s.oab.org.br/arquivos/2026/05/c58cbc52-71d3-4991-a415-97c0b31c959e.pdf",
    "https://s.oab.org.br/arquivos/2026/05/44ac1fe4-5f00-43c8-a7c8-647c978a9012.pdf"
  ],
  "47": [
    "https://s.oab.org.br/arquivos/2026/09/7d502f11-d906-4378-bd43-27e0c854b981.pdf",
    "https://s.oab.org.br/arquivos/2026/09/b33cc8dc-3730-41d4-8acc-7651d67ec6e7.pdf",
    "https://s.oab.org.br/arquivos/2026/09/4602e8f9-828b-4ae7-a1cc-7a87c0f9f5f7.pdf",
    "https://s.oab.org.br/arquivos/2026/09/fc8c5341-bad3-49a5-918e-3b99e63c286b.pdf"
  ]
});
const allowMethods = new Set(["GET","HEAD"]);
const validRange = /^bytes=\d*-\d*$/;
function makeError(status,message) {
  return new Response(message,{status,headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
}
export default {
  async fetch(request) {
    if(!allowMethods.has(request.method))return makeError(405,"Método não permitido.");
    let url;
    try {url=new URL(request.url);} catch(_) {return makeError(400,"Endereço inválido.");}
    const exam=url.searchParams.get("exame"),type=url.searchParams.get("tipo");
    if(!/^\d{2}$/.test(exam||"")||! /^[1-4]$/.test(type||""))return makeError(400,"Exame ou caderno inválido.");
    const original=SOURCES[exam]?.[Number(type)-1];
    if(!original)return makeError(404,"Prova ainda não disponível no acervo verificado.");
    const source=new URL(original);
    if(source.protocol!=="https:" || source.hostname!=="s.oab.org.br"||!source.pathname.startsWith("/arquivos/")||!source.pathname.endsWith(".pdf"))
      return makeError(500,"Fonte oficial não reconhecida.");
    const requestedRange=request.headers.get("range");
    if(requestedRange && !validRange.test(requestedRange))return makeError(416,"Intervalo PDF não suportado.");
    const headers=new Headers({Accept:"application/pdf"});
    if(requestedRange)headers.set("Range",requestedRange);
    try {
      const upstream=await fetch(original,{method:request.method,headers,redirect:"manual",signal:AbortSignal.timeout(45000)});
      if(upstream.status!==200 && upstream.status!==206){
        return makeError(502,"O PDF oficial está indisponível temporariamente. Use o link da OAB na plataforma.");
      }
      const ct=upstream.headers.get("content-type")||"";
      if(ct && !/application\/(pdf|octet-stream)/i.test(ct))
        return makeError(502,"O servidor oficial não retornou um PDF. Utilize o link direto da OAB.");
      const out=new Headers({
        "Content-Type":"application/pdf",
        "Content-Disposition":'inline; filename="oab-'+exam+'-tipo-'+type+'.pdf"',
        "X-Content-Type-Options":"nosniff",
        "Referrer-Policy":"no-referrer",
        "Cache-Control":requestedRange?"private, max-age=0":"public, s-maxage=3600, max-age=600",
        "Access-Control-Expose-Headers":"Content-Length, Content-Range, Accept-Ranges"
      });
      for(const name of ["content-length","content-range","accept-ranges","etag","last-modified"]){
        const value=upstream.headers.get(name);
        if(value)out.set(name,value);
      }
      return new Response(request.method==="HEAD"?null:upstream.body,{
        status:upstream.status,
        headers:out
      });
    }catch(_){
      return makeError(502,"Não foi possível carregar a prova neste momento. Abra o arquivo diretamente na OAB.");
    }
  }
};
