let mensajes = [];
let contactos = [{ id: 1, nombre: "Amigo", avatar: "assets/avatar.png" }];

function addMessage(tipo, contenido, contactoId=1, imagen=null){
  let msg = { contactoId, tipo, contenido, imagen };
  mensajes.push(msg);
  renderMessage(msg);
}

function renderMessage(msg){
  const chatWindow = document.getElementById('chat-window');
  let div = document.createElement('div');
  div.classList.add('message', msg.tipo);
  div.innerHTML = msg.imagen ? `<img src="${msg.imagen}" style="max-width:100px;"><br>${msg.contenido}` : msg.contenido;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

document.getElementById('send-btn').addEventListener('click', () => {
  const input = document.getElementById('mensaje-input');
  if(input.value.trim() !== ''){
    addMessage('sent', input.value);
    input.value = '';
  }
});

// Exportar a Markdown
function exportarMarkdown() {
  let md = mensajes.map(m => {
    let nombre = contactos.find(c => c.id === m.contactoId).nombre;
    let img = m.imagen ? ` ![img](${m.imagen})` : "";
    return `**${nombre}**: ${m.contenido}${img}`;
  }).join("\n\n");

  let blob = new Blob([md], { type: "text/markdown" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "chat.md";
  a.click();
}

// Cargar mensajes iniciales desde data.json
fetch('data.json')
  .then(res => res.json())
  .then(data => {
      contactos = data.contactos;
      data.mensajes.forEach(msg => renderMessage(msg));
  });
