function validarformulario() {
    console.log('Enviando formulario...');

    const nombre = document.getElementById("nombre");
    const cedula = document.getElementById("cedula");
    const telefono = document.getElementById("telefono");
    const direccion = document.getElementById("direccion");
    const correo = document.getElementById("correo");
    const fecha = document.getElementById("fecha");
    const usuario = document.getElementById("usuario");
    const contrasena = document.getElementById("contrasena");

    let esValido = true;

    // Validar campos llenos
    [nombre, cedula, telefono, correo, direccion, usuario, contrasena, fecha].forEach(input => {
        if (!input.value) {
            marcarCampo(input, false);
            esValido = false;
        } else {
            marcarCampo(input, null); 
        }
    });
    if (!esValido) {
        alert("Todos los campos son obligatorios.");
        return false;
    }

    // Validar nombre
    if (nombre.value.length < 4) {
        marcarCampo(nombre, false);
        alert("El nombre debe contener al menos 4 caracteres");
        return false;
    } else {
        marcarCampo(nombre, true);
    }

    // Validar cédula (solo números y 10 dígitos)
    if (!/^\d+$/.test(cedula.value)) {
        marcarCampo(cedula, false);
        alert("La cédula solo debe contener números.");
        return false;
    }
    if (cedula.value.length !== 10) {
        marcarCampo(cedula, false);
        alert("La cédula debe tener 10 dígitos.");
        return false;
    } else {
        marcarCampo(cedula, true);
    }

    // Validar teléfono (solo números y 10 dígitos)
    if (!/^\d+$/.test(telefono.value)) {
        marcarCampo(telefono, false);
        alert("El teléfono solo debe contener números.");
        return false;
    }
    if (telefono.value.length !== 10) {
        marcarCampo(telefono, false);
        alert("El teléfono debe tener 10 dígitos.");
        return false;
    } else {
        marcarCampo(telefono, true);
    }

    // Validar correo
    const patronCorreo = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!patronCorreo.test(correo.value)) {
        marcarCampo(correo, false);
        alert("Ingrese una dirección de correo válida.");
        return false;
    } else {
        marcarCampo(correo, true);
    }

    // Validar dirección
    marcarCampo(direccion, true);

    // Validar sexo
    const sexoSeleccionado = document.querySelector('input[name="sexo"]:checked');
    if (!sexoSeleccionado) {
        alert("Debe seleccionar un sexo.");
        return false;
    }

    // Validar fecha
    const fechaNacimiento = new Date(fecha.value);
    const hoy = new Date();
    if (fechaNacimiento > hoy) {
        marcarCampo(fecha, false);
        alert("La fecha de nacimiento no puede ser futura.");
        return false;
    } else {
        marcarCampo(fecha, true);
    }

    // Validar usuario
    if (usuario.value.length < 8) {
        marcarCampo(usuario, false);
        alert("El usuario debe tener al menos 8 caracteres.");
        return false;
    } else {
        marcarCampo(usuario, true);
    }

    // Validar contraseña
    const patronContrasena = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
    if (!patronContrasena.test(contrasena.value)) {
        marcarCampo(contrasena, false);
        alert("La contraseña debe tener al menos 6 caracteres, incluyendo mayúscula, minúscula y número.");
        return false;
    } else {
        marcarCampo(contrasena, true);
    }

    alert("Formulario enviado correctamente.");
    return true;
}

function marcarCampo(input, esValido) {
    if (esValido === true) {
        input.classList.remove("error");
        input.classList.add("correcto");
    } else if (esValido === false) {
        input.classList.remove("correcto");
        input.classList.add("error");
    } else {
        input.classList.remove("error");
        input.classList.remove("correcto");
    }
}

