document.addEventListener("DOMContentLoaded", () => {
    const contenedorBotonesCategorias = document.getElementById("botones-categorias");
    const seccionPalabras = document.getElementById("seccion-palabras");
    const tituloCategoria = document.getElementById("titulo-categoria");
    const cuerpoTablaPalabras = document.querySelector("#tabla-palabras tbody");
    const formularioTraductor = document.getElementById("formulario-traductor");
    const resultadoTraduccion = document.getElementById("resultado-traduccion");
    const formularioAnadirPalabra = document.getElementById("formulario-anadir-palabra");
    const mensajeAnadirPalabra = document.getElementById("mensaje-anadir-palabra");
    const selectCategoriaNueva = document.getElementById("categoria-nueva");
    const ordenarBoton = document.getElementById("ordenar-boton");
  
    let ordenAlfabetico = false;
  
    contenedorBotonesCategorias.innerHTML = "";
    selectCategoriaNueva.innerHTML = "";
  
    Object.keys(dictionary.categories).forEach((categoria, indice) => {
  
      const etiqueta = document.createElement("label");
      etiqueta.innerHTML = `
        <input 
          type="radio" 
          name="categoria" 
          value="${categoria}" 
          ${indice === 0 ? "checked" : ""} 
        />
        ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}
      `;
      contenedorBotonesCategorias.appendChild(etiqueta);
  
      const opcion = document.createElement("option");
      opcion.value = categoria;
      opcion.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
      selectCategoriaNueva.appendChild(opcion);
    });

    function ordenarPalabras(palabras, porAlfabeto) {
      return palabras.sort((a, b) => {
        if (porAlfabeto) {
          const claveA = document.querySelector('input[name="direccion-traduccion"]:checked').value === "en-a-es" ? a.english : a.spanish;
          const claveB = document.querySelector('input[name="direccion-traduccion"]:checked').value === "en-a-es" ? b.english : b.spanish;
          return claveA.localeCompare(claveB);
        } else {
          return a.id - b.id;
        }
      });
    }
  
    function renderizarPalabras() {
      const categoriaSeleccionada = document.querySelector('input[name="categoria"]:checked').value;
      const direccion = document.querySelector('input[name="direccion-traduccion"]:checked').value;
  
      seccionPalabras.style.display = "block";
      tituloCategoria.textContent = categoriaSeleccionada.charAt(0).toUpperCase() + categoriaSeleccionada.slice(1);
  
      let palabras = dictionary.categories[categoriaSeleccionada];
      palabras = ordenarPalabras(palabras, ordenAlfabetico);
  
      cuerpoTablaPalabras.innerHTML = "";
  
      palabras.forEach(palabra => {
        const fila = document.createElement("tr");
  
        if (direccion === "en-a-es") {
          fila.innerHTML = `
            <td>${palabra.id}</td>
            <td>${palabra.english}</td>
            <td>${palabra.spanish}</td>
            <td>${palabra.example}</td>
          `;
        } else {
          fila.innerHTML = `
            <td>${palabra.id}</td>
            <td>${palabra.spanish}</td>
            <td>${palabra.english}</td>
            <td>${palabra.example}</td>
          `;
        }
  
        cuerpoTablaPalabras.appendChild(fila);
      });
    }
  
    ordenarBoton.addEventListener("click", () => {
      ordenAlfabetico = !ordenAlfabetico;
      ordenarBoton.textContent = ordenAlfabetico ? "Ordenar por ID" : "Ordenar Alfabéticamente";
      renderizarPalabras();
    });
  
    contenedorBotonesCategorias.addEventListener("change", renderizarPalabras);
  
    const radiosDireccion = document.querySelectorAll('input[name="direccion-traduccion"]');
    radiosDireccion.forEach(radio => {
      radio.addEventListener("change", renderizarPalabras);
    });
  
    formularioTraductor.addEventListener("submit", evento => {
      evento.preventDefault();
      const palabraIngresada = document.getElementById("palabra-ingresada").value.trim();
      const categoriaSeleccionada = document.querySelector('input[name="categoria"]:checked').value;
      const direccion = document.querySelector('input[name="direccion-traduccion"]:checked').value;
  
      const palabras = dictionary.categories[categoriaSeleccionada];
      const traduccion = palabras.find(palabra => 
        (direccion === "en-a-es" && palabra.english.toLowerCase() === palabraIngresada.toLowerCase()) ||
        (direccion === "es-a-en" && palabra.spanish.toLowerCase() === palabraIngresada.toLowerCase())
      );
  
      resultadoTraduccion.textContent = traduccion
        ? `${direccion === "en-a-es" ? "Traducción:" : "Traducción:"} ${direccion === "en-a-es" ? traduccion.spanish : traduccion.english}`
        : "La palabra no se encuentra en esta categoría.";
    });
  
    formularioAnadirPalabra.addEventListener("submit", evento => {
      evento.preventDefault();
  
      const categoria = selectCategoriaNueva.value;
      const palabraIngles = document.getElementById("nueva-palabra-ingles").value.trim();
      const palabraEspanol = document.getElementById("nueva-palabra-espanol").value.trim();
      const ejemplo = document.getElementById("nuevo-ejemplo").value.trim();
  
      if (!palabraIngles || !palabraEspanol || !ejemplo) {
        mensajeAnadirPalabra.textContent = "Por favor, completa todos los campos.";
        return;
      }
  
      const nuevaPalabra = {
        id: dictionary.categories[categoria].length + 1,
        english: palabraIngles,
        spanish: palabraEspanol,
        example: ejemplo
      };
  
      dictionary.categories[categoria].push(nuevaPalabra);
  
      mensajeAnadirPalabra.textContent = "Palabra añadida exitosamente.";
      formularioAnadirPalabra.reset();
      renderizarPalabras();
    });
  
    renderizarPalabras();
  });  