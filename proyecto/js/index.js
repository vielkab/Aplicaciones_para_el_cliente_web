// usuarios simulados
const usuarios = [
    { correo: "e1234567890@live.uleam.edu.ec", password: "12345", rol: "usuario" },
    { correo: "mariaquiroz@uleam.edu.ec", password: "admin123", rol: "admin" }
];

function validarformulario() {
    console.log('Enviando formulario...');
    const usuario = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    if (!usuario || !password) {
        alert('Debe llenar todos los campos.')
        return false
    } 

    const usuarioValidado = usuarios.find(u => u.correo === usuario && u.password === password);

    if (usuarioValidado) {
        if (usuarioValidado.rol === "usuario") {
            alert("Bienvenido usuario");
            window.location.href = "principal.html";
            return false;
        } else {
            alert("Bienvenido administrador");
            window.location.href = "principaladmin.html";
            return false;
        }
    } else {
        alert("Usuario o contraseña incorrectos");
        return false;
    }
}
