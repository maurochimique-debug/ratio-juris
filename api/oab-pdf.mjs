import {Readable} from "node:stream";
/* Proxy de transmissão temporária de PDFs oficiais OAB/FGV, sem armazenar ou editar cadernos.
 * Lista fechada de fontes de provas já verificadas no repositório. Não é um proxy público aberto.
 * Os enunciados continuam originários de s.oab.org.br.
 */
const SOURCES = Object.freeze({
 "16":[
 "https://oab.fgv.br/arq/615/15032015183319_CADERNO_TIPO_1_XVI_EXAME.pdf",
 "https://oab.fgv.br/arq/615/15032015183332_CADERNO_TIPO_2_XVI_EXAME.pdf",
 "https://oab.fgv.br/arq/615/15032015183341_CADERNO_TIPO_3_XVI_EXAME.pdf",
 "https://oab.fgv.br/arq/615/15032015183351_CADERNO_TIPO_4_XVI_EXAME.pdf"
 ],
 "17":[
 "https://oab.fgv.br/arq/616/19072015182947_CADERNO_TIPO_1_XVII_EXAME.pdf",
 "https://oab.fgv.br/arq/616/19072015182956_CADERNO_TIPO_2_XVII_EXAME.pdf",
 "https://oab.fgv.br/arq/616/19072015183009_CADERNO_TIPO_3_XVII_EXAME.pdf",
 "https://oab.fgv.br/arq/616/19072015183018_CADERNO_TIPO_4_XVII_EXAME.pdf"
 ],
 "18":[
 "https://oab.fgv.br/arq/617/29112015184841_CADERNO_TIPO_1_XVIII_EXAME.pdf",
 "https://oab.fgv.br/arq/617/29112015184856_CADERNO_TIPO_2_XVIII_EXAME.pdf",
 "https://oab.fgv.br/arq/617/29112015184907_CADERNO_TIPO_3_XVIII_EXAME.pdf",
 "https://oab.fgv.br/arq/617/29112015184916_CADERNO_TIPO_4_XVIII_EXAME.pdf"
 ],
 "19":[
 "https://oab.fgv.br/arq/620/05072016131425_CADERNO_TIPO_1_XIX_EXAME_alterado_FGV.PDF",
 "https://oab.fgv.br/arq/620/05072016131459_CADERNO_TIPO_2_XIX_EXAME.PDF",
 "https://oab.fgv.br/arq/620/05072016131524_CADERNO_TIPO_3_XIX_EXAME_alterado_FGV.PDF",
 "https://oab.fgv.br/arq/620/05072016131545_CADERNO_TIPO_4_XIX_EXAME.PDF"
 ],
 "20":["https://oab.fgv.br/arq/621/24072016185034_CADERNO_TIPO_1_XX_EXAME.pdf","https://oab.fgv.br/arq/621/24072016185043_CADERNO_TIPO_2_XX_EXAME.pdf","https://oab.fgv.br/arq/621/24072016185049_CADERNO_TIPO_3_XX_EXAME.pdf","https://oab.fgv.br/arq/621/24072016185056_CADERNO_TIPO_4_XX_EXAME.pdf"],
 "21":[
 "https://oab.fgv.br/arq/624/27112016173211_CADERNO_TIPO_1_XXI_EXAME.pdf",
 "https://oab.fgv.br/arq/624/27112016173223_CADERNO_TIPO_2_XXI_EXAME.pdf",
 "https://oab.fgv.br/arq/624/27112016173234_CADERNO_TIPO_3_XXI_EXAME.pdf",
 "https://oab.fgv.br/arq/624/27112016173245_CADERNO_TIPO_4_XXI_EXAME.pdf"
 ],
 "22":[
 "https://oab.fgv.br/arq/625/02042017172423_CADERNO_TIPO_1_XXII_EXAME.pdf",
 "https://oab.fgv.br/arq/625/02042017172433_CADERNO_TIPO_2_XXII_EXAME.pdf",
 "https://oab.fgv.br/arq/625/02042017172442_CADERNO_TIPO_3_XXII_EXAME.pdf",
 "https://oab.fgv.br/arq/625/02042017172449_CADERNO_TIPO_4_XXII_EXAME.pdf"
 ],
 "23":[
 "https://oab.fgv.br/arq/626/853921_CADERNO_TIPO_1_XXIII_EXAME.pdf",
 "https://oab.fgv.br/arq/626/1136234_CADERNO_TIPO_2_XXIII_EXAME.pdf",
 "https://oab.fgv.br/arq/626/879083_CADERNO_TIPO_3_XXIII_EXAME.pdf",
 "https://oab.fgv.br/arq/626/863326_CADERNO_TIPO_4_XXIII_EXAME.pdf"
 ],
 "24":[
 "https://s.oab.org.br/arquivos/2019/10/dd43bd31-3a68-480c-9888-861ec6cd498b.pdf",
 "https://s.oab.org.br/arquivos/2019/10/00960d89-67b1-4238-a395-9be235a1f019.pdf",
 "https://s.oab.org.br/arquivos/2019/10/0347121b-44a1-4400-ac77-a71790e43a4b.pdf",
 "https://s.oab.org.br/arquivos/2019/10/752731c1-907b-47ba-ac43-e7810b96e68a.pdf"
 ],
 "25":[
 "https://s.oab.org.br/arquivos/2019/10/0a7c96e3-141b-4627-b7f3-dd5b5db062d0.pdf",
 "https://s.oab.org.br/arquivos/2019/10/b15936d5-871a-4a4a-bed3-dca3d309b2a2.pdf",
 "https://s.oab.org.br/arquivos/2019/10/428ac5d5-b4ca-4ce4-b890-97ede3d27304.pdf",
 "https://s.oab.org.br/arquivos/2019/10/cf29e8c6-f375-493c-b950-a86a18442725.pdf"
 ],
 "26":[
 "https://oab.fgv.br/arq/629/882160_CADERNO_TIPO_1_XXVI_EXAME.pdf",
 "https://oab.fgv.br/arq/629/603126_CADERNO_TIPO_2_XXVI_EXAME.pdf",
 "https://oab.fgv.br/arq/629/614961_CADERNO_TIPO_3_XXVI_EXAME.pdf",
 "https://oab.fgv.br/arq/629/591395_CADERNO_TIPO_4_XXVI_EXAME.pdf"
 ],
 "27":[
 "https://s.oab.org.br/arquivos/2019/10/9f651111-3c54-4ed5-b5e8-31f3da3a2036.pdf",
 "https://s.oab.org.br/arquivos/2019/10/4f54546b-7017-4ff5-a0b2-684fd73deb88.pdf",
 "https://s.oab.org.br/arquivos/2019/10/478afb9c-0658-4393-921c-3bac6cc0a0cd.pdf",
 "https://s.oab.org.br/arquivos/2019/10/0b654f83-378d-4b51-89cd-82993a77fb5d.pdf"
 ],
  "28":[
    "https://oab.fgv.br/arq/631/1338368_CADERNO_TIPO_1_XXVIII_EXAME%20-%20ENVIO.pdf",
    "https://s.oab.org.br/arquivos/2019/10/8fa07fe0-1947-4a84-8c86-2ce25ad6808c.pdf",
    "https://s.oab.org.br/arquivos/2019/10/4c1bb9b9-e0ca-42eb-b148-b7f30a70cadf.pdf",
    "https://s.oab.org.br/arquivos/2019/10/c2f79da6-616f-4a8e-b3fb-59437dd3a8a0.pdf"
  ],
 "29":[
 "https://s.oab.org.br/arquivos/2019/10/b960528b-8433-4d32-be2f-d8a98eb911a2.pdf",
 "https://s.oab.org.br/arquivos/2019/10/2def5693-0e41-4ea0-9579-073348c7cc78.pdf",
 "https://s.oab.org.br/arquivos/2019/10/38d51065-690f-452f-97e4-d809b54cfcce.pdf",
 "https://s.oab.org.br/arquivos/2019/10/0442f2da-ca82-47bc-b249-ce1cd4316599.pdf"
 ],
 "31":[
 "https://s.oab.org.br/arquivos/2020/02/5cffeded-9393-4c6d-b8f8-a4fdd44058ac.pdf",
 "https://s.oab.org.br/arquivos/2020/02/28b67110-c074-4854-91cc-4e71e891b570.pdf",
 "https://s.oab.org.br/arquivos/2020/02/0c475eb7-5531-4275-aa7e-ac30c685d5cf.pdf",
 "https://s.oab.org.br/arquivos/2020/02/715115e3-9082-456d-814a-9997dad6f149.pdf"
 ],
 "32":[
 "https://s.oab.org.br/arquivos/2021/06/c9115bff-9ec7-4ff3-a8d6-30022c5a0b86.pdf",
 "https://s.oab.org.br/arquivos/2021/06/6960ac04-667b-4f14-9c81-065fc3f5425e.pdf",
 "https://s.oab.org.br/arquivos/2021/06/ac82b50f-7eda-47a7-8604-a9f5c6307766.pdf",
 "https://s.oab.org.br/arquivos/2021/06/94b368e1-ed5e-46b7-9466-8adab4e3c28b.pdf"
 ],
  "33":[
    "https://s.oab.org.br/arquivos/2021/10/dcde2e9e-98cd-4837-aac3-5d05920ec255.pdf",
    "https://s.oab.org.br/arquivos/2021/10/96c0b351-cbd6-4f3a-89d3-2a8f706b5c46.pdf",
    "https://s.oab.org.br/arquivos/2021/10/c5762877-473c-4c65-ba60-9a72e2868037.pdf",
    "https://s.oab.org.br/arquivos/2021/10/b0b91cbf-dc33-496b-8c81-5b5ff40e1cf0.pdf"
  ],
  "34": [
    "https://s.oab.org.br/arquivos/2022/02/64610b85-1721-477b-9078-21cb15f6740f.pdf",
    "https://s.oab.org.br/arquivos/2022/02/580d27cc-f67c-4368-9e30-816c5ee5aa57.pdf",
    "https://s.oab.org.br/arquivos/2022/02/cb74c9b7-3a75-4bab-b24b-bfca5c5d06e2.pdf",
    "https://s.oab.org.br/arquivos/2022/02/f89b8088-6452-4f43-957c-dd62eb3a620e.pdf"
  ],
  "35": [
    "https://oab.fgv.br/arq/638/686848_OAB222%20Advogado%20%28EOU%29%20Tipo%201.pdf",
    "https://oab.fgv.br/arq/638/820648_OAB222%20Advogado%20%28EOU%29%20Tipo%202.pdf",
    "https://oab.fgv.br/arq/638/840593_OAB222%20Advogado%20%28EOU%29%20Tipo%203.pdf",
    "https://oab.fgv.br/arq/638/811337_OAB222%20Advogado%20%28EOU%29%20Tipo%204.pdf"
  ],
  "36": [
    "https://oab.fgv.br/arq/639/527735_Advogado(EOU)%20Tipo%201.pdf",
    "https://oab.fgv.br/arq/639/562789_Advogado(EOU)%20Tipo%202.pdf",
    "https://oab.fgv.br/arq/639/586336_Advogado(EOU)%20Tipo%203.pdf",
    "https://oab.fgv.br/arq/639/556216_Advogado(EOU)%20Tipo%204.pdf"
  ],
  "37": [
    "https://s.oab.org.br/arquivos/2023/02/20ac00a0-9a53-482a-89d2-b1cee39f6a08.pdf",
    "https://s.oab.org.br/arquivos/2023/02/8632a339-3b5e-468b-9795-28c62801bb6d.pdf",
    "https://s.oab.org.br/arquivos/2023/02/bbe9a510-bfc4-4017-89ce-d333e4e5d6d1.pdf",
    "https://s.oab.org.br/arquivos/2023/02/7e2b885c-aa86-4ffc-88cd-f7c42e0e23da.pdf"
  ],
  "38": [
    "https://s.oab.org.br/arquivos/2023/07/1bf68b8c-a8da-4bbe-a1ec-2134353ad2e6.pdf",
    "https://s.oab.org.br/arquivos/2023/07/19b6be37-874d-4c7b-9c85-f4ed6143af56.pdf",
    "https://s.oab.org.br/arquivos/2023/07/bd47af79-8f5f-4dbe-9cb7-afc3c09c631e.pdf",
    "https://s.oab.org.br/arquivos/2023/07/1ddd5487-f965-498b-b1da-c556d644cef1.pdf"
  ],
  "39": [
    "https://s.oab.org.br/arquivos/2023/11/8340b3e9-4337-4351-929c-3dcfd772e54a.pdf",
    "https://s.oab.org.br/arquivos/2023/11/ea2729d0-af4a-4409-86c1-1d592d3a59c7.pdf",
    "https://s.oab.org.br/arquivos/2023/11/2900f40f-499f-43d8-afe1-ac8d560f9801.pdf",
    "https://s.oab.org.br/arquivos/2023/11/ea326f38-6db2-409b-a6a4-fa7433880b63.pdf"
  ],
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

export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 res.setHeader("X-Content-Type-Options","nosniff");
 if(!["GET","HEAD"].includes(req.method))return res.status(405).end("Método não permitido.");
 const exame=String(req.query.exame||""),tipo=String(req.query.tipo||"");
  if(!/^\d{2}$/.test(exame)||!/^[1-4]$/.test(tipo))return res.status(400).end("Exame ou caderno inválido.");
 const original=SOURCES[exame]?.[Number(tipo)-1];
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
  res.setHeader("Content-Disposition",'inline; filename="oab-${exame}-tipo-${tipo}.pdf"');
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
