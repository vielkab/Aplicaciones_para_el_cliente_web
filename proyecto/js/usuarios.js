document.addEventListener("DOMContentLoaded", () => {
    const nombre = localStorage.getItem("nombre");
    const titulo = document.getElementById("tituloUsuario");

    if (nombre) {
        titulo.textContent = nombre;
    } else {
        titulo.textContent = "Usuario";
    }
});
