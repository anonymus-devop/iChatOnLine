// -------------------- Variables iniciales --------------------
let mensajes = [];
let contactos = [
  { id: 1, nombre: "Amigo", avatar: "assets/avatar.png" },
  { id: 2, nombre: "Tú", avatar: "assets/avatar.png" }
];
let currentUserId = 2;
const chatWindow = document.getElementById('chat-window');
const contactName = document.getElementById('contact-name');
const body = document.body;

// -------------------- Panel Configuración --------------------
const configPanel = document.getElementById('config-panel');
const avatarInput = document.getElementById('avatarInput');
const nombreInput = document.getElementById('nombreInput');
const downloadBtn = document.getElementById('downloadBtn');

// Cargar caché
const cachedName = localStorage.getItem('userName');
const cachedAvatar = localStorage.getItem('userAvatar');
if(cachedName) {
  contactos.find(c=>c.id===currentUserId).nombre = cachedName;
  nombreInput.value = cachedName;
}
if(cachedAvatar) {
  contactos.find(c=>c.id===currentUserId).avatar = cachedAvatar;
}
contactName.textContent = contactos.find(c=>c.id===currentUserId).nombre;

// -------------------- Renderizar mensajes --------------------
function renderMessage(msg) {
  const div = document.createElement('div');
  div.className = `px-4 py-2 rounded-2xl max-w-[70%] break-words transition-all duration-300 animate-slideFade flex items-center gap-2`;
  
  const tipo = msg.from === currentUserId ? 'sent' : 'received';
  
  div.style.backgroundColor = tipo === 'sent'
      ? getComputedStyle(document.documentElement).getPropertyValue('--color-sent') || '#007AFF'
      : getComputedStyle(document.documentElement).getPropertyValue('--color-received') || '#E5E5EA';
  div.style.color = tipo === 'sent' ? 'white' : 'black';
  div.classList.add(tipo === 'sent' ? 'self-end' : 'self-start');

  const avatarImg = document.createElement('img');
  const userAvatar = contactos.find(c => c.id === msg.from).avatar;
  avatarImg.src = userAvatar;
  avatarImg.className = "w-6 h-6 rounded-full flex-shrink-0";

  const texto = document.createElement('span');
  texto.textContent = msg.contenido;

  if(tipo==='sent') {
    div.appendChild(texto);
    div.appendChild(avatarImg);
  } else {
    div.appendChild(avatarImg);
    div.appendChild(texto);
  }

  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// -------------------- Agregar mensaje --------------------
function addMessage(contenido) {
  const destinatario = currentUserId === 1 ? 2 : 1;
  const nuevoMensaje = {
    id: mensajes.length + 1,
    from: currentUserId,
    to: destinatario,
    contenido
  };
  mensajes.push(nuevoMensaje);
  renderMessage(nuevoMensaje);
}

// -------------------- Enviar mensaje --------------------
document.getElementById('send-btn').onclick = () => {
  const input = document.getElementById('mensaje-input');
  if (input.value.trim()) {
    addMessage(input.value);
    input.value = '';
  }
};

// -------------------- Exportar Markdown --------------------
function exportarMarkdown() {
  let md = mensajes.map(m =>
    `**${contactos.find(c => c.id === m.from).nombre}**: ${m.contenido}`
  ).join('\n\n');

  const blob = new Blob([md], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'chat.md';
  a.click();
}

// -------------------- Configuración Eventos --------------------
document.getElementById('config-btn').onclick = () => configPanel.classList.remove('hidden');
document.getElementById('closeConfig').onclick = () => configPanel.classList.add('hidden');
document.getElementById('closeConfigX').onclick = () => configPanel.classList.add('hidden');

document.getElementById('colorEnviado').oninput = e =>
  document.documentElement.style.setProperty('--color-sent', e.target.value);
document.getElementById('colorRecibido').oninput = e =>
  document.documentElement.style.setProperty('--color-received', e.target.value);
document.getElementById('fondoChat').oninput = e =>
  document.getElementById('app').style.backgroundColor = e.target.value + '33';

// Avatar
avatarInput.onchange = e => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    contactos.find(c => c.id === currentUserId).avatar = reader.result;
    localStorage.setItem('userAvatar', reader.result);
    chatWindow.innerHTML = '';
    mensajes.forEach(msg => renderMessage(msg));
  };
  reader.readAsDataURL(file);
};

// Nombre
nombreInput.onchange = e => {
  contactos.find(c => c.id === currentUserId).nombre = e.target.value;
  localStorage.setItem('userName', e.target.value);
  contactName.textContent = e.target.value;
};

// Descargar Markdown
downloadBtn.onclick = exportarMarkdown;

// -------------------- Alternar usuario --------------------
document.getElementById('switch-user').onclick = () => {
  currentUserId = currentUserId === 1 ? 2 : 1;
  contactName.textContent = contactos.find(c => c.id === currentUserId).nombre;
  nombreInput.value = contactos.find(c => c.id === currentUserId).nombre;
  chatWindow.innerHTML = '';
  mensajes.forEach(msg => renderMessage(msg));
};

// -------------------- Modo oscuro --------------------
body.ondblclick = () => body.classList.toggle('dark');

// -------------------- Cargar mensajes iniciales --------------------
fetch('data.json')
  .then(r => r.json())
  .then(data => {
    contactos = data.contactos.map(c => ({
      ...c,
      avatar: c.avatar || 'assets/avatar.png'
    }));
    mensajes = data.mensajes;
    mensajes.forEach(msg => renderMessage(msg));
  });
