let mensajes = [];
let contactos = [{ id: 1, nombre: "Amigo" }];
const chatWindow = document.getElementById('chat-window');

function renderMessage(msg){
  let div = document.createElement('div');
  div.className = 'px-4 py-2 rounded-2xl max-w-[70%] break-words transition-all duration-300';
  div.style.backgroundColor = msg.tipo==='sent'?getComputedStyle(document.documentElement).getPropertyValue('--color-sent') : getComputedStyle(document.documentElement).getPropertyValue('--color-received');
  div.style.color = msg.tipo==='sent'?'white':'black';
  div.textContent = msg.contenido;
  div.classList.add('animate-slideFade');
  div.classList.add(msg.tipo==='sent'?'self-end':'self-start');
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addMessage(tipo, contenido){
  let msg={tipo,contenido,contactoId:1};
  mensajes.push(msg);
  renderMessage(msg);
}

document.getElementById('send-btn').onclick=()=>{
  const input=document.getElementById('mensaje-input');
  if(input.value.trim()){ addMessage('sent', input.value); input.value=''; }
}

// Export Markdown
function exportarMarkdown(){
  let md=mensajes.map(m=>'**'+contactos.find(c=>c.id===m.contactoId).nombre+'**: '+m.contenido).join('\n\n');
  let blob=new Blob([md],{type:'text/markdown'});
  let a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='chat.md'; a.click();
}

// Configuración
const configPanel=document.getElementById('config-panel');
document.getElementById('config-btn').onclick=()=>configPanel.classList.remove('hidden');
document.getElementById('closeConfig').onclick=()=>configPanel.classList.add('hidden');

document.getElementById('colorEnviado').oninput=e=>document.documentElement.style.setProperty('--color-sent',e.target.value);
document.getElementById('colorRecibido').oninput=e=>document.documentElement.style.setProperty('--color-received',e.target.value);
document.getElementById('fondoChat').oninput=e=>document.getElementById('app').style.backgroundColor=e.target.value+'33';

// Cargar mensajes iniciales
fetch('data.json').then(r=>r.json()).then(data=>{
  contactos = data.contactos;
  data.mensajes.forEach(msg=>renderMessage(msg));
});
