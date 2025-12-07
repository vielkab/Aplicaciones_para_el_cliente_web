function validarformulario() {

    // Obtener valores del formulario
    const usuario = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();

    console.log("Validando formulario...");

    // Validar campos vacíos
    if (!usuario || !password) {
        alert("Debe llenar todos los campos.");
        return false;
    }

    // Leer usuarios desde el JSON
    fetch("../json/usuarios.json")
        .then(res => res.json())
        .then(lista => {

            // Buscar usuario en el JSON
            const usuarioValidado = lista.find(u =>
                u.usuario === usuario && u.password === password
            );

            if (usuarioValidado) {

                // Guardar datos en localStorage
                localStorage.setItem("usuario", usuarioValidado.usuario);
                localStorage.setItem("rol", usuarioValidado.rol);
                localStorage.setItem("nombre", usuarioValidado.nombre);

                // Redirección por rol
                if (usuarioValidado.rol === "administrador") {
                    alert("Bienvenido administrador");
                    window.location.href = "principaladmin.html";
                } else {
                    alert(`Bienvenido/a ${usuarioValidado.nombre}`);
                    window.location.href = "principal.html";
                }

            } else {
                alert("Usuario o contraseña incorrectos");
            }
        })
        .catch(err => {
            console.error("Error cargando usuarios.json:", err);
            alert("Error cargando usuarios. Verifica la ruta del JSON.");
        });

    return false;
}
