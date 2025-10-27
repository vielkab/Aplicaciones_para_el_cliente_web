// document.addEventListener('DOMContentLoaded', () => {
//     const inicioEl = document.getElementById('fecha-inicio');
//     const finEl = document.getElementById('fecha-fin');
//     const btnGenerar = document.getElementById('btn-generar');
//     const btnDescargar = document.getElementById('btn-descargar');
//     const tbody = document.getElementById('tabla-reporte-body');
//     const topEl = document.getElementById('top-leidos');

//     // default: últimos 30 días
//     const hoy = new Date();
//     const hace30 = new Date(hoy); hace30.setDate(hoy.getDate() - 30);
//     inicioEl.value = hace30.toISOString().slice(0,10);
//     finEl.value = hoy.toISOString().slice(0,10);

//     // leer historial (si no existe, crear datos de muestra)
//     function seedSampleDataIfEmpty() {
//         const libros = 'historialLecturas';
//         let data = JSON.parse(localStorage.getItem(key) || 'null');
//         if (!Array.isArray(data) || data.length === 0) {
//             const sample = [];
//             const libros = [
//                 {isbn:'111', titulo:'Introducción a JS', autor:'A. Pérez'},
//                 {isbn:'222', titulo:'HTML y CSS', autor:'B. Gómez'},
//                 {isbn:'333', titulo:'Algoritmos', autor:'C. Ruiz'},
//                 {isbn:'444', titulo:'Bases de Datos', autor:'D. Lima'},
//                 {isbn:'555', titulo:'Redes y Sistemas', autor:'E. Soto'}
//             ];
//             const acciones = ['lectura','descarga'];
//             const hoy = new Date();
//             for (let i=0;i<120;i++) {
//                 const libro = libros[Math.floor(Math.random()*libros.length)];
//                 const dias = Math.floor(Math.random()*60); // últimos 60 días
//                 const fecha = new Date(hoy); fecha.setDate(hoy.getDate() - dias);
//                 sample.push({
//                     isbn: libro.isbn,
//                     titulo: libro.titulo,
//                     autor: libro.autor,
//                     fecha: fecha.toISOString(),
//                     accion: Math.random() < 0.75 ? 'lectura' : 'descarga'
//                 });
//             }
//             localStorage.setItem(key, JSON.stringify(sample));
//             data = sample;
//         }
//         return JSON.parse(localStorage.getItem('historialLecturas'));
//     }

//     function cargarDatos() {
//         const all = seedSampleDataIfEmpty();
//         return all || [];
//     }

//     function generarReporte() {
//         const inicio = new Date(inicioEl.value + 'T00:00:00');
//         const fin = new Date(finEl.value + 'T23:59:59');
//         const datos = cargarDatos();

//         // map por libro
//         const mapa = new Map();
//         datos.forEach(r => {
//             const fechaR = new Date(r.fecha);
//             if (isNaN(fechaR)) return;
//             if (fechaR < inicio || fechaR > fin) return;

//             const key = r.isbn || (r.titulo + '|' + r.autor);
//             if (!mapa.has(key)) mapa.set(key, {isbn:r.isbn, titulo:r.titulo, autor:r.autor, lecturas:0, descargas:0});
//             const obj = mapa.get(key);
//             if (r.accion === 'lectura') obj.lecturas++;
//             if (r.accion === 'descarga') obj.descargas++;
//         });

//         // convertir a array y ordenar por lecturas desc
//         const arr = Array.from(mapa.values()).sort((a,b) => b.lecturas - a.lecturas);

//         // rellenar tabla
//         tbody.innerHTML = arr.map(row => `
//             <tr>
//                 <td>${escapeHtml(row.titulo)}</td>
//                 <td>${escapeHtml(row.autor)}</td>
//                 <td style="text-align:center">${row.lecturas}</td>
//                 <td style="text-align:center">${row.descargas}</td>
//             </tr>
//         `).join('') || '<tr><td colspan="4">No hay datos en este rango.</td></tr>';

//         // top leidos (5)
//         topEl.innerHTML = arr.slice(0,5).map(r => `<li>${escapeHtml(r.titulo)} — ${r.lecturas} lecturas</li>`).join('') || '<li>No hay datos</li>';
//     }

//     function escapeHtml(s){ return String(s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

//     btnGenerar.addEventListener('click', generarReporte);
//     btnDescargar.addEventListener('click', () => alert('Descargando PDF....'));

//     // generar al inicio
//     generarReporte();
// });


// ==========================================================
// 🔑 FUNCIONES AUXILIARES (Asegúrate que existen en admin.js)
// ==========================================================

// Función global para cargar libros
window.obtenerLibros = function() {
    return JSON.parse(localStorage.getItem("libros")) || [];
}

// Función global para cargar solicitudes
window.obtenerSolicitudes = function() {
    // Si no manejas solicitudes, puedes dejar un array vacío: return [];
    return JSON.parse(localStorage.getItem("solicitudes")) || [];
}

// ==========================================================
// 🔑 FUNCIÓN PRINCIPAL DE ESTADÍSTICAS
// ==========================================================

window.generarEstadisticasResumen = function() {
    const libros = obtenerLibros();
    const solicitudes = obtenerSolicitudes();
    const contenedor = document.getElementById('resumen-libros');

    if (!contenedor) return;

    // --- 1. Cálculo de Métricas ---
    const totalLibros = libros.length;
    const librosVirtuales = libros.filter(l => l.tipolibro === 'Virtual');
    const totalVirtuales = librosVirtuales.length;
    const librosFisicos = libros.filter(l => l.tipolibro === 'Fisico');
    const totalFisicos = librosFisicos.length;

    // Estado de Libros Físicos (asumiendo estado: 'disponible', 'prestado', 'libre')
    const fisicosDisponibles = librosFisicos.filter(l => l.estado === 'disponible' || l.estado === 'libre').length;
    const fisicosPrestados = librosFisicos.filter(l => l.estado === 'prestado').length;
    
    // Estado de Lectura (Usando solo libros virtuales)
    const librosLeidos = librosVirtuales.filter(l => l.lectura === 'leido');
    const totalLeidos = librosLeidos.length;
    const porcentajeLeidos = totalVirtuales > 0 ? ((totalLeidos / totalVirtuales) * 100).toFixed(1) : 0;
    
    // Conteo de Solicitudes
    const solicitudesPendientes = solicitudes.filter(s => s.estado === 'pendiente').length;

    // --- 2. Simulación de Datos para la Tabla ---
    const librosParaTabla = librosLeidos.map(libro => {
        // Simular conteos basándose en el ISBN (solo para el reporte)
        const seed = parseInt(libro.isbn.slice(-3)) || 1; 
        const numLecturas = 1 + (seed % 5); // Simulación: 1 a 5 lecturas
        const numDescargas = seed % 4;      // Simulación: 0 a 3 descargas

        return {
            titulo: libro.titulo,
            autor: libro.autor,
            lecturas: numLecturas,
            descargas: numDescargas
        };
    });

    // --- 3. Generar el HTML Final ---
    let html = `
        <div class="stats-grid">
            
            <div class="stat-card total-general">
                <h3>Total de Libros (Físicos + Virtuales)</h3>
                <p>${totalLibros}</p>
            </div>
            
            <div class="stat-card virtuales">
                <h3>Libros Virtuales</h3>
                <p>${totalVirtuales}</p>
            </div>
            
            <div class="stat-card fisicos">
                <h3>Libros Físicos</h3>
                <p>${totalFisicos}</p>
            </div>
            
            <div class="stat-card disponible">
                <h3>Físicos Disponibles</h3>
                <p>${fisicosDisponibles}</p>
            </div>
            
            <div class="stat-card prestado">
                <h3>Físicos Prestados</h3>
                <p>${fisicosPrestados}</p>
            </div>
            
            <div class="stat-card solicitudes">
                <h3>Solicitudes Pendientes</h3>
                <p>${solicitudesPendientes}</p>
            </div>
        </div>
        
        <h4>Progreso de Lectura (Virtuales Leídos)</h4>
        <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${porcentajeLeidos}%">
                ${porcentajeLeidos}% (${totalLeidos} de ${totalVirtuales})
            </div>
        </div>

        <h4 style="margin-top: 30px;">Libros Leídos con Conteo (Simulado)</h4>
        <table class="reporte-tabla">
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Nro. Lecturas (Sim.)</th>
                    <th>Nro. Descargas (Sim.)</th>
                </tr>
            </thead>
            <tbody>
                ${librosParaTabla.length > 0 ? librosParaTabla.map(libro => `
                    <tr>
                        <td>${libro.titulo}</td>
                        <td>${libro.autor}</td>
                        <td>${libro.lecturas}</td>
                        <td>${libro.descargas}</td>
                    </tr>
                `).join('') : `
                    <tr><td colspan="4">Aún no hay libros virtuales marcados como 'leídos'.</td></tr>
                `}
            </tbody>
        </table>
    `;
    
    contenedor.innerHTML = html;
}

// 🔑 Inicialización: Llama a la función al cargar la página si el contenedor está presente.
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('resumen-libros')) {
        generarEstadisticasResumen();
    }
});