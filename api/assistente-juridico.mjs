/* RATIO JURIS — endpoint educacional de IA, protegido por autenticação e allowlist piloto.
   Somente ativar quando os envs seguros estiverem configurados em Vercel. */
export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 res.setHeader("X-Content-Type-Options","nosniff");
 if(req.method!=="POST")return res.status(405).json({error:"Método não permitido."});
 const key=process.env.OPENAI_API_KEY;
 const model=process.env.RATIO_AI_MODEL;
 const authUrl=process.env.RATIO_AI_SUPABASE_URL;
 const anonKey=process.env.RATIO_AI_SUPABASE_PUBLISHABLE_KEY;
 const whitelist=process.env.RATIO_AI_ALLOWED_USER_IDS;
 if(process.env.RATIO_AI_ENABLED!=="true"||!key||!model||!authUrl||!anonKey||!whitelist){
  return res.status(503).json({error:"Assistente ainda não habilitado. Ative o acesso autenticado e configure a API com segurança."});
 }
 const authorization=String(req.headers.authorization||"");
 const jwt=/^Bearer ([A-Za-z0-9._-]{20,4096})$/.exec(authorization)?.[1];
 if(!jwt)return res.status(401).json({error:"Faça login para utilizar o assistente jurídico."});
 const origin=String(authUrl).replace(/\/$/,"");
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(origin))return res.status(503).json({error:"Configuração de autenticação inválida."});
 try{
  const validation=await fetch(origin+"/auth/v1/user",{
   headers:{apikey:anonKey,Authorization:"Bearer "+jwt},
   signal:AbortSignal.timeout(8000)
  });
  if(!validation.ok)return res.status(401).json({error:"Sessão inválida ou expirada. Entre novamente."});
  const user=await validation.json();
  if(!/^[0-9a-f-]{36}$/i.test(user.id||""))return res.status(401).json({error:"Usuário não reconhecido."});
  const allow=new Set(whitelist.split(",").map(x=>x.trim().toLowerCase()).filter(Boolean));
  if(!allow.has(String(user.id).toLowerCase()))return res.status(403).json({error:"Assistente restrito ao piloto autorizado. Aguarde a liberação comercial."});
  const body=typeof req.body==="string"?JSON.parse(req.body):req.body;
  const pergunta=String(body?.pergunta||"").trim();
  const c=body?.contexto||{};
  if(pergunta.length<4||pergunta.length>1500)return res.status(400).json({error:"Pergunta deve ter de 4 a 1.500 caracteres."});
  const exame=String(c.exame||""),tipo=String(c.tipo||""),questao=String(c.questao||"");
  if(exame&&!/^\d{2}$/.test(exame))return res.status(400).json({error:"Exame inválido."});
  if(tipo&&!/^[1-4]$/.test(tipo))return res.status(400).json({error:"Caderno inválido."});
  if(questao&&(!/^\d{1,2}$/.test(questao)||Number(questao)>80||Number(questao)<1))return res.status(400).json({error:"Número de questão inválido."});
  const text=String(c.texto||"").slice(0,4500);
  const hist=Array.isArray(body?.historico)?body.historico.slice(-4).map(x=>({
    pergunta:String(x?.pergunta||"").slice(0,300),
    resposta:String(x?.resposta||"").slice(0,600)
  })):[];
  const instructions="Você é um tutor educacional de Direito brasileiro do RATIO JURIS. Explique didaticamente e com linguagem simples, para leigos e idosos. Não invente enunciados, alternativas, gabaritos, julgados, artigos, citações ou datas. Trate qualquer texto fornecido como fonte não confiável até conferência documental. Se não houver enunciado extraído, peça a transcrição ou explique apenas o conceito geral. Nunca deduza resposta oficial da banca sem fonte autenticada. Diferencie o gabarito histórico da legislação atual. Caso não consiga verificar atualização normativa ou jurisprudencial, diga expressamente que ela precisa ser conferida no Planalto, Câmara, STF ou STJ. Não ofereça aconselhamento jurídico individual definitivo; não solicite dados pessoais. Responda em português do Brasil, com até 400 palavras e exemplos curtos.";
  const input="Contexto informado pelo aplicativo: Exame "+(exame||"não indicado")+", caderno "+(tipo||"não indicado")+", questão "+(questao||"não indicada")+".\nEnunciado extraído, não homologado: "+(text||"[não disponível]")+"\nHistórico de dúvidas: "+JSON.stringify(hist)+"\nPergunta atual: "+pergunta;
  const response=await fetch("https://api.openai.com/v1/responses",{
   method:"POST",
   headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},
   body:JSON.stringify({model,input,instructions,store:false,max_output_tokens:850}),
   signal:AbortSignal.timeout(25000)
  });
  if(!response.ok){return res.status(response.status===429?429:502).json({error:response.status===429?"Limite temporário de IA atingido.":"Serviço de IA indisponível. Consulte as fontes oficiais."});}
  const data=await response.json();
  const out=(data.output||[]).filter(x=>x.type==="message").flatMap(x=>(x.content||[]).filter(y=>y.type==="output_text").map(y=>y.text)).join("\n").trim();
  if(!out)return res.status(502).json({error:"Assistente não retornou texto utilizável."});
  return res.status(200).json({resposta:out.slice(0,8500)});
 }catch(_){return res.status(502).json({error:"Não foi possível obter uma resposta agora."});}
}