// ============================================================================
// REFERENCIAS A ELEMENTOS DEL DOM
// ============================================================================

// Busca en el documento HTML el elemento con id="inputMensaje" y lo guarda en una variable.
// Este será el campo donde el usuario escribe su texto.
const input = document.getElementById('inputMensaje');      

// Busca el botón con id="botonEnviar". Será el que dispara la acción de enviar.
const boton = document.getElementById('botonEnviar');       

// Busca el contenedor principal del chat donde aparecerán los mensajes.
const cuerpo = document.getElementById('cuerpoChat');       



// ============================================================================
// BASE DE DATOS SIMULADA DE PRODUCTOS
// ============================================================================
// Aquí creamos un objeto llamado "productos" que funciona como una base de datos local.
// Cada clave ("001", "002", etc.) representa un producto con sus propiedades (nombre, precio, etc.).
const productos = {
  "001": {
    id: "001",
    nombre: "Auriculares Bluetooth",
    precio: 89.90,
    categoria: "Tecnología",
    descripcion: "Auriculares con cancelación de ruido y batería de 20h.",
    stock: 10,
    oferta: "10% de descuento por lanzamiento"
  },
  "002": {
    id: "002",
    nombre: "Zapatillas deportivas",
    precio: 129.00,
    categoria: "Calzado",
    descripcion: "Zapatillas resistentes para entrenamiento diario.",
    stock: 5,
    oferta: "Compra 1 y llévate medias gratis"
  },
  "003": {
    id: "003",
    nombre: "Mochila Ejecutiva",
    precio: 149.50,
    categoria: "Accesorios",
    descripcion: "Diseño impermeable y acolchado para laptops de hasta 17''.",
    stock: 3,
    oferta: "Envío gratis por tiempo limitado"
  }
};



// ============================================================================
// EVENTOS DE INTERACCIÓN DEL USUARIO
// ============================================================================

// ============================================================================
// 🎧 BLOQUE: DETECTAR CUANDO EL USUARIO ESCRIBE EN EL INPUT
// ============================================================================

// 🧠 Contexto general:
// addEventListener() es un método que "escucha" un evento del usuario
// (por ejemplo: clic, presionar tecla, escribir texto, etc.)
// y ejecuta una función cada vez que ese evento ocurre.
//
// Sintaxis general:
// elemento.addEventListener('tipo_de_evento', función_que_se_ejecuta);

// En este caso, el evento es 'input' → se activa cada vez que el contenido
// del campo de texto cambia (ya sea escribiendo, borrando o pegando texto).

input.addEventListener('input', () => {
  // -------------------------------------------------------------
  // 🧩 EXPLICACIÓN DE "() => { }"
  // -------------------------------------------------------------
  // Esto se llama "función flecha" o "arrow function".
  //
  // Es una forma compacta de declarar funciones anónimas en JavaScript.
  // Se llama "anónima" porque no tiene nombre propio (como function x()).
  //
  // Ejemplo equivalente:
  //     () => { ... }   ↔   function() { ... }
  //
  // Ambos hacen lo mismo, pero las flechas:
  //   - Son más cortas y modernas (introducidas en ES6).
  //   - No crean su propio contexto de 'this' (útil en callbacks).
  //   - Se usan mucho en funciones pequeñas que solo sirven en un lugar.
  //
  // ❓ ¿Por qué no se pone directamente una función aparte como enviarMensaje?
  // Porque aquí queremos ejecutar *inmediatamente* una acción específica
  // cuando ocurre el evento, sin necesidad de que la función exista por separado.
  // 
  // Ejemplo alternativo:
  //   function revisarInput() { ... }
  //   input.addEventListener('input', revisarInput);
  //
  // Eso también funcionaría, pero como la acción es simple y no se reutiliza
  // en otra parte, se prefiere una arrow function dentro del listener.
  // -------------------------------------------------------------


  // -------------------------------------------------------------
  // 1️⃣ Verificar si hay texto real en el input
  // -------------------------------------------------------------
  // "input.value" obtiene lo que el usuario ha escrito.
  // "trim()" elimina espacios al principio y al final.
  // Si después de eso queda algo distinto de '', significa que hay texto.
  const activo = input.value.trim() !== '';

  // -------------------------------------------------------------
  // 2️⃣ Habilitar o deshabilitar el botón según haya texto o no
  // -------------------------------------------------------------
  // "boton.disabled" es un valor booleano:
  //   true  = botón deshabilitado
  //   false = botón habilitado
  //
  // Si activo = true → !activo = false → el botón se habilita.
  // Si activo = false → !activo = true → el botón se deshabilita.
  boton.disabled = !activo;

  // -------------------------------------------------------------
  // 3️⃣ Cambiar la opacidad del botón (efecto visual)
  // -------------------------------------------------------------
  // "boton.style" permite modificar estilos CSS directamente desde JS.
  // "opacity" controla qué tan visible es un elemento:
  //   1   = 100% visible
  //   0.6 = semitransparente, aspecto de desactivado.
  //
  // El operador ternario ( ? : ) significa:
  //   condición ? valor_si_verdadero : valor_si_falso
  //
  // En este caso:
  //   Si hay texto (activo = true) → opacidad 1
  //   Si está vacío (activo = false) → opacidad 0.6
  boton.style.opacity = activo ? '1' : '0.6';

  // -------------------------------------------------------------
  // 4️⃣ Cambiar el tipo de cursor según el estado del botón
  // -------------------------------------------------------------
  // Esto mejora la experiencia del usuario visualmente.
  // "cursor" define cómo se ve el puntero del mouse al pasar por encima.
  //
  // - "pointer"     → aparece la manito (clickeable)
  // - "not-allowed" → aparece el símbolo de prohibido (no disponible)
  //
  // Nuevamente usamos el operador ternario.
  boton.style.cursor = activo ? 'pointer' : 'not-allowed';
});



// ============================================================================
// ENVÍO DE MENSAJES
// ============================================================================

// Cuando se hace clic en el botón, se ejecuta la función enviarMensaje().
boton.addEventListener('click', enviarMensaje);

// También permite enviar el mensaje al presionar la tecla “Enter”.
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') enviarMensaje();
});



// ============================================================================
// FUNCIÓN PRINCIPAL: ENVIAR MENSAJE
// ============================================================================
function enviarMensaje() {
  // Obtiene el texto que el usuario escribió y elimina espacios innecesarios.
  const texto = input.value.trim();

  // Si está vacío, no hace nada y se detiene la función.
  if (texto === '') return;                          

  // Muestra el mensaje del usuario en pantalla.
  agregarMensaje('usuario', texto);       

  // Limpia el campo de entrada.
  input.value = '';                                  

  // Fuerza que se vuelva a evaluar el evento input (para desactivar el botón).
  input.dispatchEvent(new Event('input')); 

  // Simula un pequeño tiempo de espera antes de que el bot responda.
  setTimeout(() => {
    procesarRespuesta(texto);                        
  }, 500); // 500 milisegundos = 0.5 segundos
}



// ============================================================================
// FUNCIÓN: AGREGAR UN MENSAJE AL CHAT
// ============================================================================
function agregarMensaje(tipo, contenidoHTML) {
  // Crea dinámicamente un nuevo elemento <div> para el mensaje.
  const mensaje = document.createElement('div');     

  // Le asigna las clases CSS: "mensaje" y el tipo recibido ("usuario" o "bot").
  mensaje.className = 'mensaje ' + tipo;             

  // Inserta el contenido (texto o HTML) dentro del div.
  mensaje.innerHTML = contenidoHTML;                 

  // Añade el nuevo mensaje al final del contenedor del chat.
  cuerpo.appendChild(mensaje);                       

  // Hace que el scroll del chat baje automáticamente al último mensaje.
  cuerpo.scrollTop = cuerpo.scrollHeight;            
}



// ============================================================================
// FUNCIÓN: PROCESAR LA RESPUESTA DEL BOT
// ============================================================================
function procesarRespuesta(texto) {
  // Convierte el texto del usuario a minúsculas para hacer comparaciones más simples.
  const mensaje = texto.toLowerCase();               


  // --------------------------------------------------------------------------
  // CASO 1: Comando especial "/listar" → mostrar lista de productos.
  // --------------------------------------------------------------------------
  if (mensaje === "/listar") {
    let respuesta = "<strong>Productos disponibles:</strong><br>";

    // Recorre todos los productos en la base de datos.
    for (const id in productos) {
      const p = productos[id];
      respuesta += `
        <br>
        <img src="producto.png" alt="img" style="width:40px;vertical-align:middle;margin-right:8px;">
        <strong>${p.nombre}</strong> (ID: ${p.id}) - $${p.precio.toFixed(2)}<br>
      `;
    }

    // Agrega un texto final invitando a pedir más detalles.
    respuesta += `<br><em>Escribe el nombre o ID de un producto para ver más detalles.</em>`;

    // Muestra la respuesta en el chat.
    agregarMensaje('bot', respuesta);
    return; // Termina la función aquí.
  }



  // --------------------------------------------------------------------------
  // CASO 2: Buscar coincidencia con un producto (por nombre o ID)
  // --------------------------------------------------------------------------
  let encontrado = null; // Variable temporal para guardar el producto hallado.

  // Recorre todos los productos de la base.
  for (const id in productos) {
    const p = productos[id];

    // Compara si el mensaje contiene el nombre o el ID del producto.
    if (
      mensaje.includes(p.nombre.toLowerCase()) ||   // Coincidencia por nombre
      mensaje.includes(p.id)                        // Coincidencia por ID
    ) {
      encontrado = p; // Guarda el producto hallado.
      break;          // Detiene la búsqueda.
    }
  }



  // --------------------------------------------------------------------------
  // CASO 3: Si se encontró un producto, mostrar sus detalles.
  // --------------------------------------------------------------------------
  if (encontrado) {
    const p = encontrado;

    // Plantilla HTML con los datos del producto.
    const respuesta = `
      <img src="producto.png" alt="img" style="width:50px;vertical-align:middle;margin-bottom:6px;"><br>
      <strong>${p.nombre}</strong><br>
      <strong>ID:</strong> ${p.id}<br>
      <strong>Categoría:</strong> ${p.categoria}<br>
      <strong>Descripción:</strong> ${p.descripcion}<br>
      <strong>Precio:</strong> $${p.precio.toFixed(2)}<br>
      <strong>Stock:</strong> ${p.stock} unidades<br>
      <strong>Oferta:</strong> ${p.oferta}
    `;

    // Muestra el mensaje del bot con la información del producto.
    agregarMensaje('bot', respuesta);


    // Además, crea una lista con los otros productos (para sugerencias).
    const otros = Object.values(productos)
      .filter(prod => prod.id !== p.id)                // Excluye el producto actual.
      .map(prod => `<code>${prod.id}</code> (${prod.nombre})`) // Formato: ID (nombre)
      .join(', ');

    const sugerencia = `
      ¿Deseas ver otro producto? Puedes consultar alguno de estos: ${otros}
    `;

    // Muestra la sugerencia un poco después, para parecer natural.
    setTimeout(() => agregarMensaje('bot', sugerencia), 600);
    return;
  }



  // --------------------------------------------------------------------------
  // CASO 4: Si no coincide con nada → responder con texto genérico.
  // --------------------------------------------------------------------------
  agregarMensaje('bot', generarRespuestaSimulada(mensaje));
}



// ============================================================================
// FUNCIÓN: RESPUESTAS AUTOMÁTICAS DEL BOT
// ============================================================================
function generarRespuestaSimulada(mensaje) {
  // Se evalúan palabras clave dentro del mensaje recibido.
  if (mensaje.includes('hola') || mensaje.includes('buenas')) {
    // Si el usuario saluda
    return '¡Hola! Estoy aquí para ayudarte. Puedes escribir "/listar" para ver nuestros productos.';
  } 
  else if (mensaje.includes('precio') || mensaje.includes('costo')) {
    // Si pregunta por precio
    return 'Por favor, indica el nombre o ID del producto para darte su precio.';
  } 
  else if (mensaje.includes('gracias')) {
    // Si agradece
    return '¡Con gusto! Si tienes más dudas, estoy disponible.';
  } 
  else {
    // Respuesta por defecto si no se entiende el mensaje
    return 'Lo siento, aún estoy en entrenamiento. Puedes escribir "/listar" o preguntar por un producto específico.';
  }
}
