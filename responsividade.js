/* Navegação responsiva e atalhos de teclado do RatioJuris. */
(function(){
 "use strict";
 const $=id=>document.getElementById(id);
 function setMenu(open,restoreFocus){
   const menu=$("menuMobile"),toggle=$("btnMenuMobile");
   if(!menu||!toggle)return false;
   const active=!!open;
   menu.hidden=!active;
   menu.classList.toggle("hidden",!active);
   toggle.setAttribute("aria-expanded",active?"true":"false");
   toggle.setAttribute("aria-label",active?"Fechar menu de navegação":"Abrir menu de navegação");
   const icon=toggle.querySelector("i");
   if(icon){icon.classList.toggle("fa-bars",!active);icon.classList.toggle("fa-xmark",active);}
   if(active){
     const link=menu.querySelector("a");
     link?.focus();
   }else if(restoreFocus)toggle.focus();
   return true;
 }
 function toggleMenu(){return setMenu($("menuMobile")?.hidden===true,false);}
 function closeMenu(){return setMenu(false,false);}
 function init(){
   const toggle=$("btnMenuMobile"),menu=$("menuMobile");
   if(!toggle||!menu)return;
   menu.hidden=true;
   menu.classList.add("hidden");
   toggle.setAttribute("aria-expanded","false");
   document.addEventListener("keydown",event=>{
     if(event.key==="Escape"&&!menu.hidden){setMenu(false,true);return;}
     if(!event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
     const region=$("simulador-oficial");
     if(!region||!region.contains(event.target))return;
     const tag=String(event.target?.tagName||"").toUpperCase();
     if(["INPUT","SELECT","TEXTAREA"].includes(tag))return;
     if(event.key==="ArrowLeft"||event.key==="ArrowRight"){
       const direction=event.key==="ArrowRight"?1:-1;
       if(typeof window.moverQuestaoOficial==="function"){
         event.preventDefault();
         window.moverQuestaoOficial(direction);
       }
     }
   });
   window.addEventListener("resize",()=>{
     if(window.innerWidth>=1024&&!menu.hidden)closeMenu();
   });
   document.addEventListener("click",event=>{
     if(menu.hidden||menu.contains(event.target)||toggle.contains(event.target))return;
     closeMenu();
   });
 }
 window.RatioResponsive={toggleMenu,closeMenu};
 document.addEventListener("DOMContentLoaded",init);
})();
