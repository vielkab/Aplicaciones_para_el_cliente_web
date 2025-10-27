// Función global para cargar libros
window.obtenerLibros = function() {
    return JSON.parse(localStorage.getItem("libros")) || [];
}

// Función global para cargar solicitudes
window.obtenerSolicitudes = function() {
    return JSON.parse(localStorage.getItem("solicitudes")) || [];
}

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

// inicialización
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('resumen-libros')) {
        generarEstadisticasResumen();
    }
});