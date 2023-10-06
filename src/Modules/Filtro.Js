import Tabla from "./Tabla.Js";
export default class Filtro {
    constructor(labelText, selectId, clases,) {
      this.labelText = labelText;
      this.selectId = selectId;
      this.clases = clases;
      this.datos = []; // Almacena los datos originales
      this.select = null; // Referencia al elemento <select>
      this.tabla = null;  // Referencia a la instancia de la tabla
  
      // Llama al método para crear el componente
      this.crearComponente();
    }

    setTabla(tabla) {
      this.tabla = tabla;
    }

    crearComponente() {
      // Crea el elemento <label>
      const label = document.createElement("label");
      label.setAttribute("for", this.selectId);
      label.textContent = this.labelText;
  
      // Crea el elemento <select>
      const select = document.createElement("select");
      select.setAttribute("id", this.selectId);

      this.select = select;
  
      // Agrega la opción "Todos" por defecto
      const optionTodos = document.createElement("option");
      optionTodos.setAttribute("value", "todos");
      optionTodos.textContent = "Todos";
      select.appendChild(optionTodos);
  
      // Crea y agrega las opciones basadas en las clases proporcionadas
      this.clases.forEach((clase) => {
        const option = document.createElement("option");
        const valor = clase.name.toLowerCase();
        option.setAttribute("value", valor);
        option.textContent = clase.name;
        select.appendChild(option);
    
      // Almacena una referencia al elemento <select>
      this.select = select;
      });
  
      // Agrega el label y el select al componente
      const contenedor = document.createElement("div");
      contenedor.setAttribute("id", "div-filtro");
      contenedor.appendChild(label);
      contenedor.appendChild(select);
  
      // Verifica si existe un elemento <main> en el documento
      const main = document.querySelector("main");
  
      if (main) {
        // Si existe un <main>, agrega el componente al <main>
        main.appendChild(contenedor);
      } else {
        // Si no existe un <main>, crea uno y agrega el componente al <main>
        const newMain = document.createElement("main");
        newMain.appendChild(contenedor);
        document.body.appendChild(newMain);
      };

      this.select.addEventListener("change", this.filtrarTabla.bind(this));
    };

    filtrarTabla() {
      const opcionSeleccionada = this.select.value;
      const datosFiltrados = this.tabla.filtrarDatosPorClase(opcionSeleccionada);
    };
}