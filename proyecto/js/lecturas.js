document.addEventListener('DOMContentLoaded', () => {
    // ⚠️ Define el usuario actual aquí o recupéralo de donde lo almacenes
    const usuarioActual = 'usuario123@live.uleam.edu.ec'; 

    // Referencias a los contenedores
    const contenedorLeyendo = document.getElementById('leyendo');
    const contenedorLeidos = document.getElementById('leidos');
    const contenedorFavoritos = document.getElementById('favoritos');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const btnRefrescar = document.getElementById('btn-refrescar');

    // ----------------------------------------------------
    // Funciones Auxiliares
    // ----------------------------------------------------

    window.obtenerLibros = function() {
        // Carga los libros del almacenamiento local
        return JSON.parse(localStorage.getItem("libros")) || [];
    }
    
    // Función para generar las opciones del filtro de categoría
    function generarFiltroCategorias(libros) {
        const categorias = new Set(libros.map(l => l.categoria));
        filtroCategoria.innerHTML = '<option value="todas">Todas</option>';
        categorias.forEach(cat => {
            if (cat) {
                filtroCategoria.innerHTML += `<option value="${cat}">${cat}</option>`;
            }
        });
    }

    // Función que genera el HTML de la tarjeta de un libro
    // CÓDIGO CORREGIDO PARA LA FUNCIÓN generarTarjetaLibro EN lecturas.js

const generarTarjetaLibro = (libro) => {
    const esFavorito = libro.favorito;

    
    let botonAccion = '';

    if (libro.lectura === 'leyendo') {
        botonAccion = `<button onclick="marcarComoLeido('${libro.isbn}')" class="btn-accion">Marcar Leído</button>`;
    } else if (libro.lectura === 'no-leido' || !libro.lectura) {
         botonAccion = `<button onclick="iniciarLectura('${libro.isbn}')" class="btn-accion">Iniciar Lectura</button>`;
    }
    
    return `
        <div class="libro-tarjeta">
            <div class="portada-contenedor">
                <img src="${libro.portada}" alt="Portada de ${libro.titulo}" class="portada-miniatura">
            </div>
            
            <div class="info-tarjeta">
                <h4>${libro.titulo}</h4>
                <p><b>Autor:</b> ${libro.autor}</p>
                <p><b>Categoría:</b> ${libro.categoria}</p>
                <p class="estado-lectura"><b>Estado:</b> <span style="font-weight: bold;">${libro.lectura ? libro.lectura : 'NO LEÍDO'}</span></p>
                
                <div class="acciones-lectura">
                    ${botonAccion}
                    <button onclick="marcarFavorito('${libro.isbn}')" class="btn-accion"">
                        ${esFavorito ? 'Favorito' : 'Marcar Favorito'}
                    </button>
                    <button onclick="descargarLibro('${libro.isbn}')" class="btn-descarga">Descargar</button>
                </div>
            </div>
        </div>
    `;
};

    window.mostrarMisLecturas = function() {
        const todosLibros = obtenerLibros().filter(l => l.tipolibro === 'Virtual');
        const categoriaSeleccionada = filtroCategoria.value;

        // 1. Aplicar filtro de categoría
        let librosFiltrados = todosLibros.filter(libro => 
            categoriaSeleccionada === 'todas' || libro.categoria === categoriaSeleccionada
        );

        // 2. Filtrar por estado de lectura y favorito
        const leyendo = librosFiltrados.filter(l => l.lectura === 'leyendo');
        const leidos = librosFiltrados.filter(l => l.lectura === 'leido');
        // Para Favoritos, mostramos cualquier libro marcado como favorito, sin importar el estado de lectura
        const favoritos = librosFiltrados.filter(l => l.favorito === true); 

        // 3. Renderizar Leyendo
        contenedorLeyendo.innerHTML = leyendo.length > 0
            ? leyendo.map(generarTarjetaLibro).join('')
            : '<p>Actualmente no tienes libros marcados como "Leyendo".</p>';

        // 4. Renderizar Leídos
        contenedorLeidos.innerHTML = leidos.length > 0
            ? leidos.map(generarTarjetaLibro).join('')
            : '<p>Aún no has marcado libros como "Leídos".</p>';

        // 5. Renderizar Favoritos
        contenedorFavoritos.innerHTML = favoritos.length > 0
            ? favoritos.map(generarTarjetaLibro).join('')
            : '<p>Aún no tienes libros marcados como "Favoritos".</p>';

        // 6. Generar las opciones del filtro al inicio (si no se han generado)
        if (filtroCategoria.options.length <= 1) {
            generarFiltroCategorias(todosLibros);
        }
    }

    window.iniciarLectura = function(isbn) {
        let libros = obtenerLibros();
        const index = libros.findIndex(l => l.isbn === isbn);
        if (index !== -1) {
            libros[index].lectura = 'leyendo';
            localStorage.setItem("libros", JSON.stringify(libros));
            alert(`Iniciaste la lectura de: ${libros[index].titulo}.`);
            mostrarMisLecturas(); // Refrescar la vista de Mis Lecturas
        }
    }
    
    // 2. Marcar como Leído (Terminado)
    window.marcarComoLeido = function(isbn) {
        let libros = obtenerLibros();
        const index = libros.findIndex(l => l.isbn === isbn);

        if (index !== -1) {
            libros[index].lectura = 'leido'; // Estado 'leido'
            localStorage.setItem("libros", JSON.stringify(libros));
            alert(`¡Felicidades! Terminaste de leer el libro: ${libros[index].titulo}.`);
            mostrarMisLecturas();
        }
    }
    
    // 3. Marcar/Desmarcar Favorito
    window.marcarFavorito = function(isbn) {
        let libros = obtenerLibros();
        const index = libros.findIndex(l => l.isbn === isbn);

        if (index !== -1) {
            const esFav = libros[index].favorito;
            libros[index].favorito = !esFav;
            localStorage.setItem("libros", JSON.stringify(libros));
            alert(`Libro ${libros[index].titulo} ${esFav ? 'eliminado de' : 'añadido a'} Favoritos.`);
            mostrarMisLecturas(); // Refrescar la vista
        }
    }
    
    // 4. Descargar (Simulada)
    window.descargarLibro = function(isbn) {
        alert(`Simulando descarga del libro con ISBN: ${isbn}`);
    }

    // Aplicar filtro al cambiar la selección
    filtroCategoria.addEventListener('change', mostrarMisLecturas);
    
    // Botón de refrescar (útil si hay cambios externos)
    btnRefrescar.addEventListener('click', mostrarMisLecturas);

    // Cargar la interfaz al inicio
    mostrarMisLecturas();
});