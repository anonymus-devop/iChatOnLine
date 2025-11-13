// script.js actualizado: swap de usuarios y configuración con cierre funcional

document.addEventListener('DOMContentLoaded', () => {
  let mensajes = [];
  let contactos = [{id:1,nombre:'Amigo',avatar:'assets/avatar.png'},{id:2,nombre:'Tú',avatar:'assets/avatar.png'}];
  let currentUserId = 2;

  const chatWindow = document.getElementById('chat-window');
  const contactName = document.getElementById('contact-name');
  const body = document.body;
  const configPanel = document.getElementById('config-panel');
  const avatarInput = document.getElementById('avatarInput');
  const nombreInput = document.getElementById('nombreInput');
  const closeConfigBtn = document.getElementById('closeConfig');
  const closeConfigXBtn = document.getElementById('closeConfigX');

  const cachedName = localStorage.getItem('userName');
  const cachedAvatar = localStorage.getItem('userAvatar');
  if(cachedName){contactos.find(c=>c.id===currentUserId).nombre=cachedName; nombreInput.value=cachedName;}
  if(cachedAvatar){contactos.find(c=>c.id===currentUserId).avatar=cachedAvatar;}

  contactName.textContent = contactos.find(c=>c.id===currentUserId).nombre;

  function renderMessage(msg){
    const div = document.createElement('div');
    div.className = 'px-4 py-2 rounded-2xl max-w-[70%] break-words transition-all duration-300 flex items-center gap-2';
    const tipo = msg.from === currentUserId ? 'sent' : 'received';
    div.style.backgroundColor = tipo==='sent'?getComputedStyle(document.documentElement).getPropertyValue('--color-sent')||'#007AFF':getComputedStyle(document.documentElement).getPropertyValue('--color-received')||'#E5E5EA';
    div.style.color = tipo==='sent'?'white':'black';
    div.textContent = msg.contenido;
    div.classList.add(tipo==='sent'?'self-end':'self-start');
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function addMessage(contenido){
    const destinatario = currentUserId===1?2:1;
    const nuevoMensaje = {id:mensajes.length+1,from:currentUserId,to:destinatario,contenido};
    mensajes.push(nuevoMensaje);
    renderMessage(nuevoMensaje);
  }

  document.getElementById('send-btn').onclick = () => {
    const input = document.getElementById('mensaje-input');
    if(input.value.trim()){ addMessage(input.value); input.value=''; }
  };

  function swapUser(){
    currentUserId = currentUserId===1?2:1;
    contactName.textContent = contactos.find(c=>c.id===currentUserId).nombre;
    nombreInput.value = contactos.find(c=>c.id===currentUserId).nombre;
    chatWindow.innerHTML='';
    mensajes.forEach(msg=>renderMessage(msg));
  }

  function abrirConfiguracion(){
    configPanel.classList.remove('hidden');
  }

  function cerrarConfiguracion(){
    configPanel.classList.add('hidden');
  }

  // Cerrar config con botones X y cerrar
  closeConfigBtn.onclick = cerrarConfiguracion;
  closeConfigXBtn.onclick = cerrarConfiguracion;

  // -------------------- Atajo Ctrl + Alt + O + U solo swap de usuario --------------------
  document.addEventListener('keydown', e => {
    if(e.ctrlKey && e.altKey && e.key.toLowerCase()==='o'){
      const handleNextKey = event => {
        if(event.key.toLowerCase()==='u'){
          swapUser(); // solo swap, NO abrir configuración
        }
        document.removeEventListener('keydown', handleNextKey);
      };
      document.addEventListener('keydown', handleNextKey);
    }
  });

  // -------------------- Atajo Ctrl + Alt + G para abrir configuración --------------------
  document.addEventListener('keydown', e => {
    if(e.ctrlKey && e.altKey && e.key.toLowerCase()==='g'){
      abrirConfiguracion();
    }
  });

  body.ondblclick = ()=> body.classList.toggle('dark');

  async function cargarMensajes(){
    const res = await fetch('/api/messages');
    const msgs = await res.json();
    mensajes = msgs;
    chatWindow.innerHTML='';
    mensajes.forEach(msg=>renderMessage(msg));
  }
  cargarMensajes();
});
