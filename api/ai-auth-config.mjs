/* Configuração pública de autenticação do piloto RatioJuris.
   Apenas URL e chave publicável; nunca retornar service_role ou segredos da IA. */
export default function handler(req,res){
  res.setHeader("Cache-Control","no-store");
  res.setHeader("X-Content-Type-Options","nosniff");
  if(req.method!=="GET")return res.status(405).json({error:"Método não permitido."});
  const url=String(process.env.RATIO_AI_SUPABASE_URL||"").replace(/\/$/,"");
  const publishableKey=String(process.env.RATIO_AI_SUPABASE_PUBLISHABLE_KEY||"");
  const available=/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)&&
    /^(sb_publishable_[A-Za-z0-9_-]+|eyJ[A-Za-z0-9_.-]+)$/.test(publishableKey);
  if(!available)return res.status(200).json({disponivel:false});
  return res.status(200).json({disponivel:true,url,publishableKey});
}
