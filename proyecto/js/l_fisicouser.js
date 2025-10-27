document.addEventListener('DOMContentLoaded', () => {
    const catalogoFisicos = document.getElementById('catalogo-fisicos');
    const catalogoVirtuales = document.getElementById('catalogo-virtuales');
    const usuarioActual = 'usuario123@live.uleam.edu.ec'; 

    function mostrarLibros() {
        const libros = JSON.parse(localStorage.getItem('libros')) || [];
        const solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];

        // ---- FÍSICOS ----
        const librosFisicos = libros.filter(l => l.tipolibro === 'Fisico');
        catalogoFisicos.innerHTML = librosFisicos.length === 0 ? '<p>No hay libros físicos</p>' :
            librosFisicos.map(libro => {
                // Buscamos la ÚLTIMA solicitud NO completada del usuario para este ISBN
                const solicitudesUsuario = solicitudes
                    .filter(s => s.isbn === libro.isbn && s.usuario === usuarioActual)
                    .sort((a, b) => new Date(b.fechaSolicitud) - new Date(a.fechaSolicitud));
                
                const ultimaSolicitud = solicitudesUsuario[0] || null;
                
                let mensaje = '';

                // Determinar si el botón debe estar deshabilitado y el texto a mostrar
                const disponible = libro.estado !== 'prestado';
                let botonDeshabilitado = !disponible;
                let botonTexto = 'Solicitar Préstamo';

                if (!disponible) {
                    botonTexto = 'No Disponible';
                }

                if (ultimaSolicitud) {
                    if (ultimaSolicitud.estado === 'aprobada') {
                        mensaje = `<p class="aprobada">Solicitud aprobada. Código: ${ultimaSolicitud.codigoRetiro}</p>`;
                        botonDeshabilitado = true; // Bloquea el botón si está aprobado
                        botonTexto = 'Préstamo Aprobado';
                    } else if (ultimaSolicitud.estado === 'pendiente') {
                        // NO SE BLOQUEA, solo se muestra el estado y se mantiene activo para que pueda solicitar de nuevo
                        mensaje = `<p class="pendiente">Solicitud en proceso...</p>`;
                        botonTexto = 'Solicitud en proceso';
                        // El botón sigue habilitado si el libro está disponible
                        botonDeshabilitado = !disponible; 
                    } else if (ultimaSolicitud.estado === 'rechazada') {
                         // Muestra el rechazo, luego limpia el mensaje y HABILITA el botón.
                        if (!ultimaSolicitud.mensajeVisto) {
                            mensaje = `<p class="rechazo">Motivo de rechazo: ${ultimaSolicitud.motivo}</p>`;
                            ultimaSolicitud.mensajeVisto = true; 
                            localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
                        }
                        // El botón queda habilitado si el libro está disponible
                        botonDeshabilitado = !disponible; 
                    }
                }
                
                return `
                    <div class="libro-fisico">
                        <img src="${libro.portada}" alt="${libro.titulo}">
                        <div class="info">
                            <h3>${libro.titulo}</h3>
                            <p><strong>Autor:</strong> ${libro.autor}</p>
                            <p><strong>ISBN:</strong> ${libro.isbn}</p>
                            <p><strong>Editorial:</strong> ${libro.editorial}</p>
                            <span class="estado ${disponible ? 'libre' : 'prestado'}">
                                ${disponible ? 'Disponible' : 'No Disponible'}
                            </span>
                            <button 
                                onclick="gestionarPrestamo('${libro.isbn}')"
                                ${botonDeshabilitado ? 'disabled' : ''}
                            >
                                ${botonTexto}
                            </button>
                            ${mensaje}
                        </div>
                    </div>
                `;
            }).join('');

        // ---- VIRTUALES ----
        // (El resto del código de libros virtuales se mantiene igual)
        const librosVirtuales = libros.filter(l => l.tipolibro === 'Virtual');
        catalogoVirtuales.innerHTML = librosVirtuales.length === 0 ? '<p>No hay libros virtuales</p>' :
            librosVirtuales.map(libro => `
                <div class="libro-virtual">
                    <img src="${libro.portada}" alt="${libro.titulo}">
                    <div class="info">
                        <h3>${libro.titulo}</h3>
                        <p><strong>Autor:</strong> ${libro.autor}</p>
                        <p><strong>Categoría:</strong> ${libro.categoria}</p>
                        <p><strong>ISBN:</strong> ${libro.isbn}</p>
                        <p><strong>Editorial:</strong> ${libro.editorial}</p>
                        <p><strong>Año:</strong> ${libro.anio}</p>
                        <p><strong>Tipo:</strong> ${libro.tipolibro}</p>
                        <div class="botones-virtual">
                            <button onclick="leerLibro('${libro.isbn}')">Leer</button>
                            <button onclick="descargarLibro('${libro.isbn}')">Descargar</button>
                        </div>
                    </div>
                </div>
            `).join('');
    }

    window.gestionarPrestamo = function(isbn) {
        const libros = JSON.parse(localStorage.getItem('libros')) || [];
        const libro = libros.find(l => l.isbn === isbn);
        if (!libro) return;

        if (confirm(`¿Desea solicitar el préstamo del libro "${libro.titulo}"?`)) {
            const solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];
            
            //BLOQUEO en la función: solo permite enviar la solicitud si no hay una PENDIENTE o APROBADA activa.
            const solicitudExistente = solicitudes.find(s => 
                s.isbn === isbn && 
                s.usuario === usuarioActual && 
                (s.estado === 'pendiente' || s.estado === 'aprobada')
            );

            if (solicitudExistente) {
                alert(`Ya tienes una solicitud ${solicitudExistente.estado} para este libro. Solo puedes tener una activa a la vez.`);
                return;
            }

            solicitudes.push({
                id: Date.now().toString(36),
                isbn: libro.isbn,
                titulo: libro.titulo,
                usuario: usuarioActual,
                fechaSolicitud: new Date().toISOString(),
                plazoDias: 14,
                estado: 'pendiente', 
                codigoRetiro: null,
                motivo: null,
                mensajeVisto: false 
            });
            localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
            alert('Solicitud enviada. Esperando aprobación del administrador.');
            mostrarLibros();
        }
    }

    window.leerLibro = function(isbn) { alert(`Iniciando lectura del libro virtual ${isbn}...`); }
    window.descargarLibro = function(isbn) { alert(`Iniciando descarga del libro virtual ${isbn}...`); }

    mostrarLibros();
});

// document.addEventListener('DOMContentLoaded', () => {
//     const catalogoFisicos = document.getElementById('catalogo-fisicos');
//     const usuarioActual = 'usuario1@example.com'; 

//     function mostrar() {
//         const libros = JSON.parse(localStorage.getItem('libros')) || [];
//         const solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];
//         const librosFisicos = libros.filter(l => l.tipolibro === 'Fisico');

//         catalogoFisicos.innerHTML = librosFisicos.map(libro => {
//             const solicitud = solicitudes.find(s => s.isbn === libro.isbn && s.usuario === usuarioActual);
//             let mensaje = '';

//             if (solicitud) {
//                 if (solicitud.estado === 'rechazada' && !solicitud.mensajeVisto) {
//                     mensaje = `<p class="rechazo">Motivo de rechazo: ${solicitud.motivo}</p>`;
//                     solicitud.mensajeVisto = true;
//                     localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
//                 } else if (solicitud.estado === 'aprobada') {
//                     mensaje = `<p class="aprobada">Solicitud aprobada. Código de retiro: ${solicitud.id.slice(-6)}</p>`;
//                 }
//             }

//             const botonDeshabilitado = libro.estado === 'prestado' || (solicitud && solicitud.estado === 'pendiente');
//             const textoBoton = libro.estado === 'prestado'
//                 ? 'No Disponible'
//                 : (solicitud && solicitud.estado === 'pendiente')
//                     ? 'Solicitud en proceso'
//                     : 'Solicitar Préstamo';

//             return `
//                 <div class="libro-fisico">
//                     <img src="${libro.portada}" alt="${libro.titulo}">
//                     <div class="info">
//                         <h3>${libro.titulo}</h3>
//                         <p><strong>Autor:</strong> ${libro.autor}</p>
//                         <p><strong>ISBN:</strong> ${libro.isbn}</p>
//                         <p><strong>Editorial:</strong> ${libro.editorial}</p>
//                         <span class="estado ${libro.estado || 'libre'}">
//                             ${libro.estado === 'prestado' ? 'No Disponible' : 'Disponible'}
//                         </span>
//                         <button onclick="gestionarPrestamo('${libro.isbn}')" ${botonDeshabilitado ? 'disabled' : ''}>
//                             ${textoBoton}
//                         </button>
//                         ${mensaje}
//                     </div>
//                 </div>
//             `;
//         }).join('');
//     }

//     window.gestionarPrestamo = function(isbn) {
//         const libros = JSON.parse(localStorage.getItem('libros')) || [];
//         const libroIndex = libros.findIndex(l => l.isbn === isbn);
//         if (libroIndex === -1) return;
//         const libro = libros[libroIndex];

//         const solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];
//         const solicitudExistente = solicitudes.find(s => s.isbn === isbn && s.usuario === usuarioActual && s.estado === 'pendiente');
//         if (solicitudExistente) return alert('Ya tienes una solicitud pendiente para este libro.');

//         if (confirm('¿Desea solicitar el préstamo de este libro?')) {
//             const nuevaSolicitud = {
//                 id: Date.now().toString(36),
//                 isbn: libro.isbn,
//                 titulo: libro.titulo,
//                 usuario: usuarioActual,
//                 fechaSolicitud: new Date().toISOString(),
//                 plazoDias: 14,
//                 estado: 'pendiente',
//                 mensajeVisto: false
//             };
//             solicitudes.push(nuevaSolicitud);
//             localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
//             alert('Solicitud enviada. El administrador la revisará.');
//             mostrarLibrosFisicos();
//         }
//     }

//     mostrar();
// });
