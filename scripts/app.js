 // Obtener referencias a elementos del DOM
    const input = document.getElementById('inputMensaje');      // Campo de texto del usuario
    const boton = document.getElementById('botonEnviar');       // Botón para enviar mensaje
    const cuerpo = document.getElementById('cuerpoChat');       // Contenedor de mensajes del chat

    // Base de datos local de productos simulados
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

    // Escucha cambios en el input para activar o desactivar el botón
    input.addEventListener('input', () => {
      const activo = input.value.trim() !== '';          // ¿Hay texto?
      boton.disabled = !activo;                          // Habilita o desactiva botón
      boton.style.opacity = activo ? '1' : '0.6';        // Cambia apariencia visual
      boton.style.cursor = activo ? 'pointer' : 'not-allowed';
    });

    // Envío de mensaje por clic
    boton.addEventListener('click', enviarMensaje);

    // Envío de mensaje con tecla Enter
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') enviarMensaje();
    });

    // Función principal para enviar un mensaje
    function enviarMensaje() {
      const texto = input.value.trim();
      if (texto === '') return;                          // No enviar si está vacío

      agregarMensaje('usuario', texto);       // Mostrar mensaje del usuario
      input.value = '';                                  // Limpiar input
      input.dispatchEvent(new Event('input')); // Forzar re-evaluación de botón

      setTimeout(() => {
        procesarRespuesta(texto);                        // Respuesta automática
      }, 500)    // Simula tiempo de respuesta del bot
    }

    // Inserta un mensaje en el cuerpo del chat
    function agregarMensaje(tipo, contenidoHTML) {
      const mensaje = document.createElement('div');     
      // Crea burbuja de mensaje
      mensaje.className = 'mensaje ' + tipo;             
      // Clase "usuario" o "bot"
      mensaje.innerHTML = contenidoHTML;                 
      // Inserta HTML o texto
      cuerpo.appendChild(mensaje);                      
       // Lo añade al contenedor de mensajes
      cuerpo.scrollTop = cuerpo.scrollHeight;            // Baja automáticamente al último mensaje
    }

    // Procesa el contenido del mensaje para generar la respuesta
    function procesarRespuesta(texto) {
      const mensaje = texto.toLowerCase();               // Convierte a minúsculas para comparar

      // Caso especial: comando "/listar"
      if (mensaje === "/listar") {
        let respuesta = "<strong>Productos disponibles:</strong><br>";
        for (const id in productos) {
          const p = productos[id];
          respuesta += `
          <br>
          <img src="producto.png" alt="img" style="width:40px;vertical-align:middle;margin-right:8px;">
          <strong>${p.nombre}</strong> (ID: ${p.id}) - $${p.precio.toFixed(2)}<br>
        `;
        }
        respuesta += `<br><em>Escribe el nombre o ID de un producto para ver más detalles.</em>`;
        agregarMensaje('bot', respuesta);
        return;
      }

      // Buscar un producto que coincida por nombre parcial o ID
      let encontrado = null;
      for (const id in productos) {
        const p = productos[id];
        if (
          mensaje.includes(p.nombre.toLowerCase()) ||   // Coincidencia por nombre
          mensaje.includes(p.id)                        // Coincidencia por ID
        ) {
          encontrado = p;
          break;
        }
      }

      // Si se encuentra un producto, mostrar sus datos completos
      if (encontrado) {
        const p = encontrado;
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
        agregarMensaje('bot', respuesta);

        // Mostrar sugerencias de otros productos
        const otros = Object.values(productos)
          .filter(prod => prod.id !== p.id)                // Excluir el producto actual
          .map(prod => `<code>${prod.id}</code> (${prod.nombre})`) // Formato: ID + nombre
          .join(', ');

        const sugerencia = `
        ¿Deseas ver otro producto? Puedes consultar alguno de estos: ${otros}
      `;
        setTimeout(() => agregarMensaje('bot', sugerencia), 600);
        return;
      }

      // Si no es comando ni producto: respuesta genérica simulada
      agregarMensaje('bot', generarRespuestaSimulada(mensaje));
    }

    // Respuestas básicas automáticas del bot
    function generarRespuestaSimulada(mensaje) {
      if (mensaje.includes('hola') || mensaje.includes('buenas')) {
        return '¡Hola! Estoy aquí para ayudarte. Puedes escribir "/listar" para ver nuestros productos.';
      } else if (mensaje.includes('precio') || mensaje.includes('costo')) {
        return 'Por favor, indica el nombre o ID del producto para darte su precio.';
      } else if (mensaje.includes('gracias')) {
        return '¡Con gusto! Si tienes más dudas, estoy disponible.';
      } else {
        return 'Lo siento, aún estoy en entrenamiento. Puedes escribir "/listar" o preguntar por un producto específico.';
      }
    }