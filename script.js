// Enhance an already-readable page: content remains visible when JavaScript is disabled.
const icons={cow:'<path d="m5 8-2-2-1 3 3 3v6h3v-4h8v4h3v-7l2-2-1-3-3 2H9L7 6 5 8Z"/><path d="M5 11h3m8-2v4m-5-5 2 3m6 1h2"/>',link:'<path d="m10 13 4-4m-6 6-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 2 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(1 1)"/>',history:'<path d="M3 5h17M3 10h12M3 15h7m7-2v6m-3-3h6"/><rect x="13" y="11" width="9" height="11" rx="2"/>',person:'<circle cx="12" cy="6" r="3"/><path d="M5 22v-5a7 7 0 0 1 14 0v5M9 14l3 4 3-4"/>',stethoscope:'<path d="M5 3v6a5 5 0 0 0 10 0V3M4 3h3m6 0h3M10 14v3a5 5 0 0 0 10 0v-4"/><circle cx="20" cy="10" r="3"/>',plus:'<path d="M12 4v16M4 12h16"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18m-14 4h2m3 0h2m3 0h1M7 17h2m3 0h2"/>'};
document.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${icons[el.dataset.icon]}</svg>`});
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menú')}
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú')});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
if('IntersectionObserver' in window){document.documentElement.classList.add('js');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}
const dialog=document.querySelector('#info-dialog');
const messages={terms:['Términos de uso','Los términos de uso de ANITEC todavía no están publicados.'],privacy:['Política de privacidad','La política de privacidad de ANITEC todavía no está publicada. Esta landing no incluye formularios de registro.'],cookies:['Preferencias de cookies','Esta landing no utiliza cookies ni herramientas de seguimiento. No necesitas configurar preferencias.'],contact:['Conoce más sobre ANITEC','El canal de contacto de ANITEC aún no está disponible en esta página.']};
document.querySelectorAll('[data-dialog]').forEach(button=>button.addEventListener('click',()=>{const [title,text]=messages[button.dataset.dialog];document.querySelector('#dialog-title').textContent=title;document.querySelector('#dialog-text').textContent=text;dialog.showModal()}));
document.querySelectorAll('.dialog-close,.dialog-done').forEach(b=>b.addEventListener('click',()=>dialog.close()));dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});

// All continuous effects are event-driven; no idle animation loop is kept running.
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
const runningAnimations=new Set();
function animateOnce(element,frames,options){
 if(motionPreference.matches||!element.animate)return;
 const animation=element.animate(frames,options);runningAnimations.add(animation);
 animation.finished.then(()=>runningAnimations.delete(animation)).catch(()=>runningAnimations.delete(animation));
}
const title=document.querySelector('.hero h1');
const lines=title.innerHTML.split(/<br\s*\/?\s*>/i);
title.innerHTML=lines.map(line=>`<span class="headline-line"><span class="headline-inner">${line}</span></span>`).join('');
const motionReady=document.fonts?Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,1200))]):Promise.resolve();
motionReady.then(()=>{
 title.querySelectorAll('.headline-inner').forEach((line,index)=>animateOnce(line,[{transform:'translateY(110%) rotate(2deg)',opacity:0},{transform:'translateY(0) rotate(0)',opacity:1}],{duration:1000,delay:index*110,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));
 animateOnce(document.querySelector('.hero-picture'),[{clipPath:'inset(10% 5% 12% 5% round 180px 180px 25px 25px)',opacity:0},{clipPath:'inset(0% 0% 0% 0% round 180px 180px 25px 25px)',opacity:1}],{duration:1400,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
});
const header=document.querySelector('.header');const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');header.append(progress);
const photographs=[...document.querySelectorAll('.hero-picture,.care-picture,.about-picture')];
let scrollFrame=0;
function updateScroll(){
 scrollFrame=0;const available=document.documentElement.scrollHeight-window.innerHeight;
 progress.style.transform=`scaleX(${available>0?Math.min(1,window.scrollY/available):0})`;
 header.classList.toggle('scrolled',window.scrollY>20);
 photographs.forEach(photo=>{let offset=0;if(!motionPreference.matches&&finePointer.matches){const rect=photo.getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight)offset=Math.max(-10,Math.min(10,(innerHeight/2-rect.top-rect.height/2)*.025));}photo.style.setProperty('--photo-y',`${offset}px`)});
}
function scheduleScroll(){if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll)}
window.addEventListener('scroll',scheduleScroll,{passive:true});window.addEventListener('resize',scheduleScroll,{passive:true});updateScroll();
document.querySelectorAll('.card').forEach(card=>{
 let frame=0,x=0,y=0;
 const reset=()=>{cancelAnimationFrame(frame);frame=0;card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');card.style.setProperty('--lift','0px')};
 card.addEventListener('pointermove',event=>{if(motionPreference.matches||!finePointer.matches)return;const rect=card.getBoundingClientRect();x=(event.clientX-rect.left)/rect.width;y=(event.clientY-rect.top)/rect.height;if(!frame)frame=requestAnimationFrame(()=>{frame=0;card.style.setProperty('--rx',`${(0.5-y)*5}deg`);card.style.setProperty('--ry',`${(x-.5)*6}deg`);card.style.setProperty('--lift','-6px');card.style.setProperty('--mx',`${x*100}%`);card.style.setProperty('--my',`${y*100}%`)});});
 card.addEventListener('pointerleave',reset);card.addEventListener('pointercancel',reset);motionPreference.addEventListener('change',reset);
});
document.querySelectorAll('.button').forEach(button=>{
 button.addEventListener('pointermove',event=>{if(motionPreference.matches||!finePointer.matches)return;const rect=button.getBoundingClientRect();button.style.setProperty('--bx',`${(event.clientX-rect.left-rect.width/2)*.07}px`);button.style.setProperty('--by',`${(event.clientY-rect.top-rect.height/2)*.1}px`)});
 const reset=()=>{button.style.setProperty('--bx','0px');button.style.setProperty('--by','0px')};button.addEventListener('pointerleave',reset);button.addEventListener('pointercancel',reset);motionPreference.addEventListener('change',reset);
});
motionPreference.addEventListener('change',()=>{if(motionPreference.matches)runningAnimations.forEach(animation=>animation.cancel());scheduleScroll()});
