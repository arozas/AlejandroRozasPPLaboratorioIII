export default class InputConLabelYBoton {
  constructor(labelText, inputId, buttonId, buttonText) {
    this.labelText = labelText;
    this.inputId = inputId;
    this.buttonId = buttonId;
    this.buttonText = buttonText;

    // Llama al método para crear el componente
    this.crearComponente();
  }

  crearComponente() {
    // Crea el elemento <label>
    const label = document.createElement("label");
    label.setAttribute("for", this.inputId);
    label.textContent = this.labelText;

    // Crea el elemento <input>
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", this.inputId);
    input.setAttribute("readonly", true);

    // Crea el elemento <button>
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("id", this.buttonId);
    button.textContent = this.buttonText;

    // Agrega el label, el input y el botón al componente
    const componente = document.createElement("div");
    componente.setAttribute("id", "div-boton-funcion");
    componente.appendChild(label);
    componente.appendChild(input);
    componente.appendChild(button);

    const main = document.querySelector("main");

    if (main) {
      // Si existe un <main>, agrega el componente al <main>
      main.appendChild(componente);
    } else {
      // Si no existe un <main>, crea uno y agrega el componente al <main>
      const newMain = document.createElement("main");
      newMain.appendChild(componente);
      document.body.appendChild(newMain);
    }
  }

  calcularPromedio(tabla, columna) {
    const button = document.getElementById(this.buttonId);
    const input = document.getElementById(this.inputId);

    if (!button || !input) {
      console.error("No se encontró el botón o el input");
      return;
    }

    button.addEventListener("click", () => {
      // Obtener todas las celdas de la columna especificada
      const cells = tabla.querySelectorAll(`td:nth-child(${columna})`);

      if (cells.length === 0) {
        console.error("No se encontraron celdas en la columna especificada");
        return;
      }

      // Calcular el promedio de los valores en las celdas
      let suma = 0;
      cells.forEach((cell) => {
        const valor = parseFloat(cell.textContent);
        if (!isNaN(valor)) {
          suma += valor;
        }
      });

      // Calcular el promedio y mostrarlo en el input
      const promedio = suma / cells.length;
      input.value = promedio.toFixed(2); // Redondear a 2 decimales
    });
  }
}
