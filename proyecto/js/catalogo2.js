window.obtenerLibros = function() {
    return JSON.parse(localStorage.getItem("libros")) || [];
}

// Función para marcar/desmarcar Favorito 
window.marcarFavorito = function(isbn) {
    let libros = obtenerLibros();
    const index = libros.findIndex(l => l.isbn === isbn);

    if (index !== -1) {
        // se alterna  el estado de favorito
        const esFav = libros[index].favorito;
        libros[index].favorito = !esFav;
        localStorage.setItem("libros", JSON.stringify(libros));
        
        alert(`Libro ${libros[index].titulo} ${esFav ? 'eliminado de' : 'añadido a'} Favoritos.`);
        
        // Refrescar la vista del catálogo
        document.getElementById("catalogo") && mostrarCatalogo(); 
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const catalogo = document.getElementById("catalogo");
    // se define el usuario actual
    const usuarioActual = 'usuario123@live.uleam.edu.ec'; 

    if (!catalogo) return; 

    // Función principal para mostrar libros
    function mostrarCatalogo() {
        const libros = JSON.parse(localStorage.getItem("libros")) || [];
        
        if (libros.length === 0) {
            catalogo.innerHTML = "<p style='font-size:20px; font-weight: bolder;'>No hay libros registrados aún</p>";
            return;
        }

        catalogo.innerHTML = ""; // Limpiar antes de mostrar
        const categorias = {};

        libros.forEach(libro => {
            if (!categorias[libro.categoria]) {
                categorias[libro.categoria] = [];
            }
            categorias[libro.categoria].push(libro);
        });

        for (const categoria in categorias) {
            catalogo.innerHTML += `<h2 style="text-align:left;">${categoria.toUpperCase()}</h2>`;
            
            const contenedorLibros = document.createElement('div');
            contenedorLibros.style.display = 'flex';
            contenedorLibros.style.flexWrap = 'wrap';
            contenedorLibros.style.justifyContent = 'left';

            // si el libro es virtual se van a mostrar los botones de favorito, descargar y leer
            categorias[categoria].forEach(libro => {
                contenedorLibros.innerHTML += `
                    <div class="libro">
                        <div class="imagen">
                            <img src="${libro.portada}" alt="${libro.titulo}">
                        </div>
                        <div class="infoimagen">
                            <h3>${libro.titulo}</h3>
                            <p><strong>Autor:</strong> ${libro.autor}</p>
                            <p><strong>Tipo de Libro:</strong> ${libro.tipolibro}</p>
                            <p class="estado-lectura"><strong>Estado:</strong> <span>${obtenerEstadoLectura(libro.isbn)}</span></p> 
                        </div>
                        <div class="botonlibro">
                            ${libro.tipolibro === 'Virtual' ? `
                                <button 
                                    onclick="marcarFavorito('${libro.isbn}')"
                                    style="background-color: ${libro.favorito ? '#dceeaeff' : '#ffffffff'}; border: none;">
                                    ⭐
                                </button>
                                <button onclick="marcarLeido('${libro.isbn}')">Leer</button>
                                <button onclick="descargarLibro('${libro.titulo}')">Descargar</button>
                            ` : `
                                `}
                        </div>
                    </div>
                `;
            });

            catalogo.appendChild(contenedorLibros);
        }
    }

    function obtenerEstadoLectura(isbn) {
        const libros = JSON.parse(localStorage.getItem("libros")) || [];
        const libroEncontrado = libros.find(l => l.isbn === isbn);
        return libroEncontrado ? libroEncontrado.lectura : 'no-leido';
    }

    // Marcar libro como leyendo
    window.marcarLeido = function (isbn) { 
        let libros = JSON.parse(localStorage.getItem("libros")) || [];

        // Encontrar el libro por ISBN
        const index = libros.findIndex(l => l.isbn === isbn);

        if (index !== -1) {
            // Cambiar el estado de lectura del libro
            libros[index].lectura = 'leyendo';

            // Guardar en localStorage
            localStorage.setItem("libros", JSON.stringify(libros));
            
            alert(`El libro ${libros[index].titulo} ha sido marcado como 'leyendo'.`);

            // Refrescar la vista del catálogo para que se actualice el estado
            mostrarCatalogo();
        } else {
            console.error('Libro no encontrado para marcar como leído.');
        }
    }
    
    // Funciones para simular la descarga de un libro
    window.descargarLibro = function(titulo) {
        alert(`Simulando descarga del libro: ${titulo}`);
    }

    // Inicializar el catálogo al cargar
    mostrarCatalogo();
});
