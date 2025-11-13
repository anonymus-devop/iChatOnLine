// -------------------- Variables iniciales --------------------
let mensajes = [];
let contactos = [
  { id: 1, nombre: "Amigo" },
  { id: 2, nombre: "Tú" }
];
let currentUserId = 2; // usuario por defecto "Tú"
const chatWindow = document.getElementById('chat-window');
const contactName = document.getElementById('contact-name');
const body = document.body;

// -------------------- Renderizar un mensaje --------------------
function renderMessage(msg) {
  const div = document.createElement('div');
  div.className = `px-4 py-2 rounded-2xl max-w-[70%] break-words transition-all duration-300 animate-slideFade`;
  
  // Tipo según usuario actual
  const tipo = msg.from === currentUserId ? 'sent' : 'received';
  
  div.style.backgroundColor = tipo === 'sent'
      ? getComputedStyle(document.documentElement).getPropertyValue('--color-sent') || '#007AFF'
      : getComputedStyle(document.documentElement).getPropertyValue('--color-received') || '#E5E5EA';
  div.style.color = tipo === 'sent' ? 'white' : 'black';
  div.classList.add(tipo === 'sent' ? 'self-end' : 'self-start');
  div.textContent = msg.contenido;
  
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

// -------------------- Panel de configuración --------------------
const configPanel = document.getElementById('config-panel');
document.getElementById('config-btn').onclick = () => configPanel.classList.remove('hidden');
document.getElementById('closeConfig').onclick = () => configPanel.classList.add('hidden');

document.getElementById('colorEnviado').oninput = e => 
  document.documentElement.style.setProperty('--color-sent', e.target.value);
document.getElementById('colorRecibido').oninput = e => 
  document.documentElement.style.setProperty('--color-received', e.target.value);
document.getElementById('fondoChat').oninput = e => 
  document.getElementById('app').style.backgroundColor = e.target.value + '33';

// -------------------- Alternar usuario --------------------
document.getElementById('switch-user').onclick = () => {
  currentUserId = currentUserId === 1 ? 2 : 1;
  contactName.textContent = contactos.find(c => c.id === currentUserId).nombre;
  
  // Limpiar y volver a renderizar mensajes según usuario actual
  chatWindow.innerHTML = '';
  mensajes.forEach(msg => renderMessage(msg));
};

// -------------------- Modo oscuro --------------------
body.ondblclick = () => body.classList.toggle('dark');

// -------------------- Cargar mensajes iniciales --------------------
fetch('data.json')
  .then(r => r.json())
  .then(data => {
    contactos = data.contactos;
    mensajes = data.mensajes; // cargar todos los mensajes desde el inicio
    mensajes.forEach(msg => renderMessage(msg));
  });
