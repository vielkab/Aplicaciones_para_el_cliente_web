document.addEventListener("DOMContentLoaded", () => {
    const catalogo = document.getElementById("catalogo");

    if (!catalogo) return; // Evita errores si la página no tiene un contenedor con id="catalogo"

    // Recuperar los libros guardados
    const libros = JSON.parse(localStorage.getItem("libros")) || [];

    // Si no hay libros, mostrar mensaje amigable
    if (libros.length === 0) {
        catalogo.innerHTML = "<p style='font-size:18px;'>No hay libros registrados aún </p>";
        return;
    }

    // Mostrar los libros en tarjetas
    catalogo.innerHTML = libros.map(libro => `
        <div class="libro">
            <div class="imagen">
                <img src="${libro.portada}" alt="${libro.titulo}">
            </div>
            <div class="infoimagen">
                <h3>${libro.titulo}</h3>
                <p><strong>Autor:</strong> ${libro.autor}</p>
                <p><strong>Categoría:</strong> ${libro.categoria}</p>
                <p><strong>ISBN:</strong> ${libro.isbn}</p>
                <p><strong>Editorial:</strong> ${libro.editorial}</p>
                <p><strong>Año:</strong> ${libro.anio}</p>
                <p><strong>Tipo de Libro:</strong> ${libro.tipolibro}</p>
            </div>
        </div>
    `).join("");
});
