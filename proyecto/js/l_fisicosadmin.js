document.addEventListener('DOMContentLoaded', () => {
    const listaLibros = document.getElementById('lista-libros');
    const solicitudesDiv = document.getElementById('solicitudes');

    function obtenerLibros() {
        return JSON.parse(localStorage.getItem('libros')) || [];
    }

    function obtenerSolicitudes() {
        return JSON.parse(localStorage.getItem('solicitudes')) || [];
    }

    // Mostrar libros físicos en admin
    function mostrarLibros() {
        const libros = obtenerLibros().filter(l => l.tipolibro === 'Fisico');
        if (libros.length === 0) {
            listaLibros.innerHTML = '<p>No hay libros físicos disponibles.</p>';
            return;
        }

        listaLibros.innerHTML = libros.map(libro => {
            const esPrestado = libro.estado === 'prestado';
            let botonAccion = '';

            // El botón de devolución solo aparece si el libro está prestado
            if (esPrestado) {
                botonAccion = `<button class="devolver-libro" data-isbn="${libro.isbn}">Marcar como Disponible</button>`;
            }

            return `
                <div class="tarjetas">
                    <div class="libro-fisico">
                        <img src="${libro.portada}" alt="${libro.titulo}">
                    </div>
                    <div class="info">
                        <h3>${libro.titulo}</h3>
                        <p><strong>Autor:</strong> ${libro.autor}</p>
                        <p><strong>ISBN:</strong> ${libro.isbn}</p>
                        <p><strong>Editorial:</strong> ${libro.editorial}</p>
                        <span class="estado ${libro.estado}">
                            ${esPrestado ? 'No Disponible' : 'Disponible'}
                        </span>
                        ${botonAccion} 
                    </div>
                </div>
            `;
        }).join('');

        // Agregar listener para el botón de devolución
        document.querySelectorAll('.devolver-libro').forEach(btn =>
            btn.addEventListener('click', () => marcarComoDisponible(btn.dataset.isbn))
        );
    }

    // Marcar libro como disponible (Devolución)
    function marcarComoDisponible(isbn) {
        if (!confirm('¿Confirma que el libro ha sido devuelto y desea marcarlo como Disponible?')) {
            return;
        }

        // Actualizar estado del libro a "disponible"
        const libros = obtenerLibros();
        const indexLibro = libros.findIndex(l => l.isbn === isbn);
        if (indexLibro !== -1) {
            libros[indexLibro].estado = 'disponible';
            localStorage.setItem('libros', JSON.stringify(libros));
        }

        // Actualizar la solicitud relacionada (marca la solicitud como completada)
        const solicitudes = obtenerSolicitudes();
        // Encuentra la solicitud que está APROBADA y corresponde a este libro
        const indexSolicitud = solicitudes.findIndex(s => s.isbn === isbn && s.estado === 'aprobada');
        if (indexSolicitud !== -1) {
             solicitudes[indexSolicitud].estado = 'completada';
             solicitudes[indexSolicitud].fechaDevolucion = new Date().toISOString(); 
             localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
        }

        alert(`Libro con ISBN ${isbn} marcado como Disponible.`);

        // Refrescar listas
        mostrarLibros();
        mostrarSolicitudes();
    }


    // Mostrar solicitudes pendientes
    function mostrarSolicitudes() {
        const solicitudes = obtenerSolicitudes();
        const pendientes = solicitudes.filter(s => s.estado === 'pendiente');

        if (pendientes.length === 0) {
            solicitudesDiv.innerHTML = '<p>No hay solicitudes pendientes.</p>';
            return;
        }

        solicitudesDiv.innerHTML = pendientes.map(s => {
            const fecha = new Date(s.fechaSolicitud).toLocaleString();
            return `
                <div class="solicitud-card" data-id="${s.id}">
                    <p><strong>Libro:</strong> ${s.titulo} (ISBN: ${s.isbn})</p>
                    <p><strong>Usuario:</strong> ${s.usuario}</p>
                    <p><strong>Solicitado:</strong> ${fecha}</p>
                    <p><strong>Plazo (días):</strong> ${s.plazoDias || 30}</p>
                    <div class="sol-acciones">
                        <button class="aprobar" data-id="${s.id}">Aprobar</button>
                        <button class="rechazar" data-id="${s.id}">Rechazar</button>
                    </div>
                </div>
            `;
        }).join('');

        // Agregar eventos a los botones
        document.querySelectorAll('.aprobar').forEach(btn =>
            btn.addEventListener('click', () => aprobarSolicitud(btn.dataset.id))
        );
        document.querySelectorAll('.rechazar').forEach(btn =>
            btn.addEventListener('click', () => rechazarSolicitud(btn.dataset.id))
        );
    }

    // Aprobar solicitud
    function aprobarSolicitud(id) {
        const solicitudes = obtenerSolicitudes();
        const indexSolicitud = solicitudes.findIndex(s => s.id === id);
        if (indexSolicitud === -1) return;

        const libroISBN = solicitudes[indexSolicitud].isbn;

        //Evitar aprobar si el libro ya está prestado 
        const libros = obtenerLibros();
        const libroEncontrado = libros.find(l => l.isbn === libroISBN);
        if (libroEncontrado && libroEncontrado.estado === 'prestado') {
             alert('No se puede aprobar. Este libro ya está prestado.');
             return; 
        }

        // Generar código de retiro
        const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();

        solicitudes[indexSolicitud].estado = 'aprobada';
        solicitudes[indexSolicitud].codigoRetiro = codigo;

        //Actualizar estado del libro a "prestado" (No Disponible)
        const indexLibro = libros.findIndex(l => l.isbn === libroISBN);
        if (indexLibro !== -1) {
            libros[indexLibro].estado = 'prestado';
            localStorage.setItem('libros', JSON.stringify(libros));
        }

        localStorage.setItem('solicitudes', JSON.stringify(solicitudes));

        alert(`Solicitud confirmada \nCódigo de retiro: ${codigo}`);

        // Refrescar listas
        mostrarLibros();
        mostrarSolicitudes();
    }

    // Rechazar solicitud
    function rechazarSolicitud(id) {
        const motivo = prompt('Ingrese el motivo del rechazo:');
        if (!motivo) return;

        const solicitudes = obtenerSolicitudes();
        const indexSolicitud = solicitudes.findIndex(s => s.id === id);
        if (indexSolicitud !== -1) {
            solicitudes[indexSolicitud].estado = 'rechazada';
            solicitudes[indexSolicitud].motivo = motivo;
            // Asegura que el mensaje de rechazo se muestre al user una vez
            solicitudes[indexSolicitud].mensajeVisto = false; 
            localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
        }

        mostrarSolicitudes();
    }

    // Inicializar
    mostrarLibros();
    mostrarSolicitudes();
});