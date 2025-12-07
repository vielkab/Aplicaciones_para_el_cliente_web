document.addEventListener("DOMContentLoaded", () => {

    // Solo cargar JSON la primera vez
    if (!localStorage.getItem("libros")) {

        fetch("../json/libros.json")
            .then(resp => resp.json())
            .then(data => {
                localStorage.setItem("libros", JSON.stringify(data));
                console.log("Libros cargados desde el archivo JSON.");
            })
            .catch(err => console.error("Error cargando JSON:", err));
    }
});
