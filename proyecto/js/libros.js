let libros = JSON.parse(localStorage.getItem("libros")) || [];

const form = document.getElementById("formLibro");
const catalogo = document.getElementById("catalogo");
const btnAñadir = document.getElementById("btnAñadir");

// Mostrar u ocultar formulario
btnAñadir.addEventListener("click", () => {
    form.classList.toggle("oculto");
    catalogo.style.display = form.classList.contains("oculto") ? "flex" : "none";
});

function mostrarLibros() {
    catalogo.innerHTML = "";
    libros.forEach((libro, index) => {
        catalogo.innerHTML += `
            <div class="libro">
                <img src="${libro.portada}" alt="${libro.titulo}">
                <h3>${libro.titulo}</h3>
                <p>Autor: ${libro.autor}</p>
                <p>Categoría: ${libro.categoria}</p>
                <p>ISBN: ${libro.isbn}</p>
                <p>Editorial: ${libro.editorial}</p>
                <p>Año: ${libro.anio}</p>
                <p>Tipo Libro: ${libro.tipolibro}</p>
                <button onclick="editarLibro(${index})">Editar</button>
                <button onclick="eliminarLibro(${index})">Eliminar</button>
            </div>
        `;
    });
}

function eliminarLibro(index) {
    libros.splice(index, 1);
    localStorage.setItem("libros", JSON.stringify(libros));
    mostrarLibros();
}

// Editar libro
function editarLibro(index) {
    const libro = libros[index];
    form.classList.remove("oculto");
    catalogo.style.display = "none";

    document.getElementById("titulo").value = libro.titulo;
    document.getElementById("autor").value = libro.autor;
    document.getElementById("isbn").value = libro.isbn;
    document.getElementById("editorial").value = libro.editorial;
    document.getElementById("anio").value = libro.anio;
    document.getElementById("categoria").value = libro.categoria;
    document.getElementById("portada").value = libro.portada;
    document.getElementById("tipolibro").value = libro.tipo;

    form.onsubmit = function(e) {
        e.preventDefault();
        libros[index] = {
            titulo: document.getElementById("titulo").value,
            autor: document.getElementById("autor").value,
            isbn: document.getElementById("isbn").value,
            editorial: document.getElementById("editorial").value,
            anio: document.getElementById("anio").value,
            categoria: document.getElementById("categoria").value,
            portada: document.getElementById("portada").value,
            tipolibro: document.getElementById("tipolibro").value,
        };
        localStorage.setItem("libros", JSON.stringify(libros));
        form.reset();
        form.classList.add("oculto");
        catalogo.style.display = "flex";
        form.onsubmit = agregarLibro;
        mostrarLibros();
    }
}


// Función para agregar libro
function agregarLibro(e) {
    e.preventDefault();

    const isbnValue = document.getElementById("isbn").value.trim();

    if (isbnValue.length !== 13 || !/^\d+$/.test(isbnValue)) {
        console.log("Longitud del ISBN:", isbnValue.length); 
        alert("El ISBN debe ser numérico y tener exactamente 13 caracteres.");
        return;
    }

    if (libros.some(libro => libro.isbn === isbnValue)) {
        alert("Error: El ISBN ya existe en el catálogo. No puede repetirse.");
        return;
    }

    const nuevoLibro = {
        titulo: document.getElementById("titulo").value,
        autor: document.getElementById("autor").value,
        isbn: isbnValue,
        editorial: document.getElementById("editorial").value,
        anio: document.getElementById("anio").value,
        categoria: document.getElementById("categoria").value,
        portada: document.getElementById("portada").value,
        tipolibro: document.getElementById("tipolibro").value,
        favorito: false,
        lectura: 'no-leido'
    };

    if (nuevoLibro.tipolibro === "Fisico") {
        nuevoLibro.estado = 'libre';
        nuevoLibro.usuarioPrestamo = null;
        nuevoLibro.fechaPrestamo = null;
        nuevoLibro.fechaExpiracion = null;
    }

    libros.push(nuevoLibro);
    localStorage.setItem("libros", JSON.stringify(libros));

    form.reset();
    form.classList.add("oculto");
    catalogo.style.display = "flex";
    mostrarLibros();
}



// Inicializamos el submit del formulario
form.onsubmit = agregarLibro;

// Mostrar libros al cargar la página
mostrarLibros();

