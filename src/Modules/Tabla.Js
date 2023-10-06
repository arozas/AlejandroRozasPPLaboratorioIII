import { MapearDatos } from "../Data/DataBase.Js";
import FormularioDinamico from "./FormularioDinamico.js";

export default class Tabla {
  constructor(columnas) {
    this.columnas = columnas;
    this.datosOriginales = [...MapearDatos()]; // Copia original de los datos
    this.datos = [...MapearDatos()]; // Copia actual de los datos
    this.ordenAscendente = true;
    this.columnasOcultas = []; // Para rastrear las columnas ocultas
    this._formularioDinamico = null;

    // Llama al método para crear la tabla
    this.crearTabla();
    this.agregarEventosDobleClic();
  }

  set formularioDinamico(form) {
    this._formularioDinamico = form;
  }

  crearTabla() {
    // Crear el contenedor de la tabla
    const tablaContainer = document.createElement("div");
    tablaContainer.setAttribute("id", "tabla");

    // Crear el formulario para mostrar/ocultar columnas
    const columnasContainer = document.createElement("div");
    columnasContainer.setAttribute("id", "columnas");
    const labelMostrarColumnas = document.createElement("label");
    labelMostrarColumnas.textContent = "Mostrar columnas:";
    columnasContainer.appendChild(labelMostrarColumnas);

    // Crear las columnas visibles/ocultas
    this.columnas.forEach((columna) => {
      const checkboxLabel = document.createElement("label");
      checkboxLabel.innerHTML = `<input type="checkbox" name="mostrar" value="${columna.value}" checked> ${columna.label}`;
      columnasContainer.appendChild(checkboxLabel);
    });

    // Agregar el formulario al contenedor de la tabla
    tablaContainer.appendChild(columnasContainer);

    // Crear la tabla de datos
    const tablaDatos = document.createElement("table");
    tablaDatos.setAttribute("id", "tabla-datos");

    // Crear el encabezado de la tabla
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    this.columnas.forEach((columna) => {
      const th = document.createElement("th");
      th.setAttribute("data-columna", columna.value);
      th.textContent = columna.label;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    tablaDatos.appendChild(thead);

    // Crear el cuerpo de la tabla con los datos
    const tbody = document.createElement("tbody");
    this.datos.forEach((dato) => {
      const tr = document.createElement("tr");
      tr.setAttribute("data-id", dato.id);
      this.columnas.forEach((col) => {
        const td = document.createElement("td");
        td.setAttribute("data-columna", col.value);
        td.textContent = dato[col.value];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    tablaDatos.appendChild(tbody);

    // Guardar una referencia a la tabla y al tbody
    this.tabla = tablaDatos;
    this.tbody = tbody;

    // Agrega la tabla de datos al contenedor de la tabla
    tablaContainer.appendChild(tablaDatos);

    const main = document.querySelector("main");

    if (main) {
      // Si existe un <main>, agrega el componente al <main>
      main.appendChild(tablaContainer);
    } else {
      // Si no existe un <main>, crea uno y agrega el componente al <main>
      const newMain = document.createElement("main");
      newMain.appendChild(tablaContainer);
      document.body.appendChild(newMain);
    }

    // Añade un controlador de clic a los encabezados
    this.columnas.forEach((columna) => {
      const th = thead.querySelector(`[data-columna="${columna.value}"]`);
      th.addEventListener("click", () => {
        this.ordenarTabla(columna.value);
      });
    });

    // Agrega un controlador de cambio a las casillas de verificación
    const checkboxes = document.querySelectorAll('input[name="mostrar"]');
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const columna = checkbox.value;
        this.ocultarMostrarColumna(columna);
      });
    });
  }

  agregarEventosDobleClic() {
    this.tbody.addEventListener("dblclick", (event) => {
      const fila = event.target.closest("tr");
      if (fila) {
        const id = fila.getAttribute("data-id");
        if (id) {
          // Busca el objeto en localStorage por ID
          const objeto = this.datosOriginales.find(
            (dato) => dato.id === parseInt(id)
          );
          if (objeto) {
            // Abre el formulario dinámico con los valores del objeto
            this._formularioDinamico.abrirFormularioEditar(objeto);
            
          } else {
            console.log("No se encontró objeto");
          }
        }
      }
    });
  }

  ordenarTabla(columna) {
    // Invierte el orden si es el mismo encabezado
    if (this.columnaOrdenada === columna) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.ordenAscendente = true;
    }

    // Ordena los datos en función de la columna y el orden
    let datosOrdenados = this.datos.sort((a, b) => {
      const valorA = a[columna];
      const valorB = b[columna];
      if (valorA < valorB) {
        return this.ordenAscendente ? -1 : 1;
      }
      if (valorA > valorB) {
        return this.ordenAscendente ? 1 : -1;
      }
      return 0;
    });
    this.actualizarTabla(datosOrdenados);
  }

  ocultarMostrarColumna(columna) {
    const th = document.querySelector(`[data-columna="${columna}"]`);
    const columnIndex = this.columnas.findIndex((col) => col.value === columna);

    if (th && columnIndex >= 0) {
      // Oculta/muestra la columna y su encabezado
      const isHidden = this.columnasOcultas.includes(columna);
      if (isHidden) {
        th.style.display = "";
        this.columnasOcultas = this.columnasOcultas.filter(
          (col) => col !== columna
        );
      } else {
        th.style.display = "none";
        this.columnasOcultas.push(columna);
      }

      // Oculta/muestra las celdas de datos correspondientes
      const cells = document.querySelectorAll(`td[data-columna="${columna}"]`);
      cells.forEach((cell) => {
        cell.style.display = isHidden ? "" : "none";
      });
    }
  }

  actualizarTabla(datos) {
    if (this.tbody && datos.length === this.datos.length) {
      // Iterar sobre las filas existentes y actualizar el contenido de las celdas
      const filas = this.tbody.querySelectorAll("tr");
      datos.forEach((dato, indice) => {
        const celdas = filas[indice].querySelectorAll("td");
        this.columnas.forEach((col, colIndex) => {
          celdas[colIndex].textContent = dato[col.value];
        });
      });
    }
  }

  filtrarDatosPorClase(clase) {
    const ths = document.querySelectorAll("th[data-columna]");
    ths.forEach((th) => {
      th.style.display = "";
    });

    const checkboxes = document.querySelectorAll('input[name="mostrar"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
    });

    if (clase === "todos") {
      // Si se selecciona "todos", muestra todos los datos originales
      this.datos = [...this.datosOriginales];
    } else {
      // Filtra los datos según la clase seleccionada
      this.datos = this.datosOriginales.filter((dato) => {
        // Verifica si el objeto tiene una propiedad que coincide con el nombre de la clase
        return dato.constructor.name.toLowerCase() === clase.toLowerCase();
      });
    }

    // Limpia el cuerpo de la tabla
    this.tbody.innerHTML = "";

    // Crea las filas para los datos filtrados y agrégalas al tbody
    this.datos.forEach((dato) => {
      const tr = document.createElement("tr");
      this.columnas.forEach((col) => {
        const td = document.createElement("td");
        td.setAttribute("data-columna", col.value);
        td.textContent = dato[col.value];
        tr.appendChild(td);
      });
      this.tbody.appendChild(tr);
    });
  }
}
