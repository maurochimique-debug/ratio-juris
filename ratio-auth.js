/* RatioJuris: sessão piloto isolada e mantida somente em memória.
   Não reutiliza usuários/sessões do PITRYA; não armazena tokens em localStorage. */
(function(){
 "use strict";
 const $=id=>document.getElementById(id);
 let token="", expiry=0, config=null, busy=false;
 const status=msg=>{const el=$("rjAuthStatus");if(el)el.textContent=msg;};
 const button=()=> $("rjAuthSubmit");
 function sync(){
   const active=!!token&&Date.now()<expiry;
   if(!active){token="";expiry=0;}
   if($("rjAuthLogin"))$("rjAuthLogin").hidden=active;
   if($("rjAuthLogout"))$("rjAuthLogout").hidden=!active;
   document.dispatchEvent(new Event("ratiojuris-auth-change"));
 }
 async function init(){
   try{
     const response=await fetch("/api/ai-auth-config",{cache:"no-store"});
     if(!response.ok)throw Error("Configuração indisponível");
     const data=await response.json();
     if(!data.disponivel || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(data.url||""))return;
     config={url:data.url,publishableKey:data.publishableKey};
     if($("rjAuthSection"))$("rjAuthSection").hidden=false;
     status("Entre com sua conta piloto do RatioJuris. A sessão termina ao fechar ou recarregar a página.");
   }catch(_){status("Login ainda indisponível no servidor.");}
 }
 async function login(){
   if(busy||!config)return;
   const email=String($("rjAuthEmail")?.value||"").trim(),password=String($("rjAuthPassword")?.value||"");
   if(!email||!password){status("Informe e-mail e senha.");return;}
   busy=true;if(button())button().disabled=true;
   status("Validando sua conta...");
   try{
     const resp=await fetch(config.url+"/auth/v1/token?grant_type=password",{
       method:"POST",headers:{"Content-Type":"application/json",apikey:config.publishableKey},
       body:JSON.stringify({email,password}),cache:"no-store"
     });
     const data=await resp.json().catch(()=>({}));
     if(!resp.ok||!data.access_token||!Number.isFinite(Number(data.expires_in)))throw Error("Login não autorizado");
     const verify=await fetch(config.url+"/auth/v1/user",{
       headers:{apikey:config.publishableKey,Authorization:"Bearer "+data.access_token},cache:"no-store"
     });
     if(!verify.ok)throw Error("Não foi possível validar a sessão");
     token=data.access_token;
     expiry=Date.now()+Math.max(0,Number(data.expires_in)-60)*1000;
     if($("rjAuthPassword"))$("rjAuthPassword").value="";
     sync();status("Sessão autenticada. A liberação do piloto será verificada ao enviar a pergunta.");
   }catch(_){token="";expiry=0;sync();status("Não foi possível entrar. Verifique suas credenciais e autorização.");}
   finally{busy=false;if(button())button().disabled=false;}
 }
 function logout(){token="";expiry=0;sync();status("Sessão encerrada neste navegador.");}
 window.RatioJurisAuth={getAccessToken:async()=>{sync();return token||null;},isSignedIn:()=>!!token&&Date.now()<expiry};
 document.addEventListener("DOMContentLoaded",()=>{
   init();sync();
   button()?.addEventListener("click",login);
   $("rjAuthLogout")?.addEventListener("click",logout);
   $("rjAuthPassword")?.addEventListener("keydown",e=>{if(e.key==="Enter")login();});
 });
})();
