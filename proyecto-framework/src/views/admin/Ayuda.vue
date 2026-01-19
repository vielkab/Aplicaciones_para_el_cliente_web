<template>
  <h2>Ayuda</h2>
  <div class="ayuda">
    <h3>Bienvenido a la sección de ayuda de LibroULEAM.</h3>
    <p>Este sistema ha sido diseñado para facilitar la gestión y el préstamo de libros dentro de la comunidad universitaria.
      Aquí podrás encontrar información sobre cómo utilizar las principales funcionalidades de la plataforma, como el inicio de sesión, la solicitud de libros, la visualización de tu historial de préstamos y el seguimiento de calificaciones.
      Si presentas algún inconveniente con el uso del sistema, asegúrate de verificar que tus datos estén correctamente ingresados y que tu sesión esté activa.
      Para problemas técnicos, errores en la información o solicitudes especiales, comunícate con el administrador del sistema o utiliza los canales oficiales de soporte de la universidad.</p>
  </div>
</template>
<style scoped>
    h2 {
        margin: 20px 20px;
        font-size: 1.8em;
        color: #ba0707
    }
    h3 {
        padding: 10px 20px;
        text-align: center;
    }
    p {
        padding: 10px 60px;
        line-height: 30px;
        text-align: justify;
    }
    @media (max-width: 768px) {
    h2 {
        margin: 15px;
        font-size: 1.5em;
        text-align: center;
    }
    h3 {
        padding: 10px;
        font-size: 1.1em;
    }
    p {
        padding: 10px 20px;
        line-height: 24px;
        font-size: 0.95em;
    }
    }
</style>