window.addEventListener('scroll',function(){document.getElementById('nav').classList.toggle('scrolled',window.scrollY>50)});
var mt=document.getElementById('menu-toggle'),nl=document.getElementById('nav-links'),no=document.getElementById('nav-overlay');
function closeMenu(){nl.classList.remove('active');no.classList.remove('active');document.body.style.overflow=''}
function openMenu(){nl.classList.add('active');no.classList.add('active');document.body.style.overflow='hidden'}
mt.addEventListener('click',function(){nl.classList.contains('active')?closeMenu():openMenu()});
no.addEventListener('click',closeMenu);
document.querySelectorAll('.nav-links a').forEach(function(a){a.addEventListener('click',closeMenu)});
function handleSubmit(){
  var n=document.getElementById('cf-name'),e=document.getElementById('cf-email'),m=document.getElementById('cf-message'),s=document.getElementById('form-status'),btn=document.getElementById('form-btn');
  if(!n||!e||!m)return;
  if(!n.value.trim()||!e.value.trim()||!m.value.trim()){s.style.color='#e74c3c';s.textContent='Please fill in all required fields.';return}
  btn.disabled=true;btn.textContent='Sending...';s.textContent='';
  fetch('/api/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:n.value.trim(),email:e.value.trim(),company:(document.getElementById('cf-company')||{}).value||'',interest:(document.getElementById('cf-interest')||{}).value||'',message:m.value.trim()})})
  .then(function(r){return r.json()})
  .then(function(d){if(d.success){s.style.color='#22864f';s.textContent=d.message;n.value='';e.value='';m.value='';var c=document.getElementById('cf-company');if(c)c.value='';var i=document.getElementById('cf-interest');if(i)i.selectedIndex=0}else{s.style.color='#e74c3c';s.textContent=d.error||'Error.'}})
  .catch(function(){s.style.color='#e74c3c';s.textContent='Network error. Email us at efficient1880@gmail.com'})
  .finally(function(){btn.disabled=false;btn.innerHTML='Send Inquiry &rarr;'});
}