function operaciones() {
    const n1 = parseFloat(document.getElementById("ingreso1").value);
    const n2 = parseFloat(document.getElementById("ingreso2").value);
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = ""; 

    if (isNaN(n1) || isNaN(n2)) {
        alert('Debe ingresar valores numéricos.');
        return;
    }

    for (let i = 1; i <= 5; i++) {
        let resultado;

        switch (i) {
            case 1:
                resultado = `Suma = ${n1 + n2}`;
                break;
            case 2:
                resultado = `Resta = ${n1 - n2}`;
                break;
            case 3:
                resultado = `Multiplicación = ${n1 * n2}`;
                break;
            case 4:
                if (n2 === 0) {
                    resultado = `División = No se puede dividir entre 0`;
                } else {
                    resultado = `División = ${(n1 / n2).toFixed(2)}`;
                }
                break;
            case 5:
                if (n2 === 0) {
                    resultado = `Módulo = No se puede calcular con divisor 0`;
                } else {
                    resultado = `Módulo = ${n1 % n2}`;
                }
                break;
        }

        resultadoDiv.innerHTML += `<p>${resultado}</p>`;
    }
}
