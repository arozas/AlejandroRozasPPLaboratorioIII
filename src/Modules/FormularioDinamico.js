export default class FormularioDinamico {
    constructor(clases, buttonText, componenteOcultar) {
      this.clases = clases;
      this.buttonText = buttonText;
      this.componenteOcultar = componenteOcultar;
      this.formulario = this.crearFormulario();
      this.tipoSeleccionado = null;
      this.buttonContainer = this.crearButtonContainer();
      this.agregarEventListeners();
      this.renderizarEnMain();
      this.IdEditar = null;
    }
  
    crearFormulario() {
      const form = document.createElement("form");
      form.id = "agregar-form";
  
      const tipoLabel = document.createElement("label");
      tipoLabel.textContent = "Seleccionar tipo:";
      form.appendChild(tipoLabel);
  
      this.clases.forEach((clase) => {
        const inputTipo = document.createElement("input");
        inputTipo.type = "radio";
        inputTipo.id = clase.name.toLowerCase();
        inputTipo.name = "tipo";
        inputTipo.value = clase.name.toLowerCase();
  
        const labelTipo = document.createElement("label");
        labelTipo.setAttribute("for", clase.name.toLowerCase());
        labelTipo.textContent = clase.name.charAt(0).toUpperCase() + clase.name.slice(1);
  
        inputTipo.addEventListener("change", () => {
          this.tipoSeleccionado = clase;
          this.actualizarCamposFormulario();
        });
  
        form.appendChild(inputTipo);
        form.appendChild(labelTipo);
      });
  
      const datosContainer = document.createElement("div");
      datosContainer.classList.add("datos-modal-form");
  
      form.appendChild(datosContainer);
  
      const submitButton = document.createElement("input");
      submitButton.type = "submit";
      submitButton.value = "Agregar";
  
      const cancelButton = document.createElement("button");
      cancelButton.setAttribute("id", "boton-cancelar");
      cancelButton.type = "button";
      cancelButton.textContent = "Cancelar";
  
      cancelButton.addEventListener("click", () => {
        this.ocultarFormulario();
      });
  
      form.appendChild(submitButton);
      form.appendChild(cancelButton);
  
      return form;
    }
  
    crearButtonContainer() {
      const container = document.createElement("div");
  
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = this.buttonText;
  
      button.addEventListener("click", () => {
        this.IdEditar = null;
        this.mostrarFormulario();
      });
  
      container.appendChild(button);
      container.appendChild(this.formulario);
      this.formulario.style.display = "none";
  
      return container;
    }
  
    agregarEventListeners() {
        this.formulario.addEventListener("submit", (event) => {
            //event.preventDefault();
            this.procesarFormulario();
      });
    }
  
    mostrarFormulario() {
      this.formulario.style.display = "block";
      this.buttonContainer.querySelector("button").style.display = "none";
      if (this.componenteOcultar) {
        this.componenteOcultar.style.display = "none";
      }  
    }
  
    ocultarFormulario() {
      this.formulario.style.display = "none";
      this.buttonContainer.querySelector("button").style.display = "block";
      this.formulario.reset();
      this.tipoSeleccionado = null;
      if (this.componenteOcultar) {
        this.componenteOcultar.style.display = "block";
      }
    }
  
    actualizarCamposFormulario() {
      const datosContainer = this.formulario.querySelector(".datos-modal-form");
  
      // Eliminar campos anteriores
      while (datosContainer.firstChild) {
        datosContainer.removeChild(datosContainer.firstChild);
      }
  
      // Agregar campos según la clase seleccionada
      if (this.tipoSeleccionado) {
        const clase = this.tipoSeleccionado;
        const instance = new clase();
  
        for (const key in instance) {
          if (key !== "id") {
            const label = document.createElement("label");
            label.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ":";
            const input = document.createElement("input");
            input.type = typeof instance[key] === "number" ? "number" : "text";
            input.id = key;
            input.name = key;
            input.required = true;
  
            datosContainer.appendChild(label);
            datosContainer.appendChild(input);
          }
        }
      }
    }
  
    procesarFormulario() {
        if (this.tipoSeleccionado) {
          const datos = {};
          const datosDB = JSON.parse(localStorage.getItem("misDatos"));
      
          // Recopilar los datos del formulario
          const formData = new FormData(this.formulario);
          formData.forEach((value, key) => {
            datos[key] = value;
          });

          function objetosSonIguales(objeto1, objeto2) {
            // Compara los IDs de los objetos
            return objeto1.id === objeto2.id;
          }

          let objetoExistente = null;

          if(this.IdEditar != null && this.IdEditar > 0)
          {
            console.log("estoy obteniendo datos para mod")
            objetoExistente = datosDB.find((dato) => dato.id === this.IdEditar);
          }
      
          if (this.IdEditar != null && this.IdEditar > 0) {
            // Busca el índice del objeto en datosDB que tiene el mismo ID que el objeto datos
            const index = datosDB.findIndex((datos) => datos.id === this.IdEditar);
            if (index !== -1) {
                console.log(objetoExistente);
                // Si se encontró un objeto con el mismo ID, actualiza todos sus datos
                objetoExistente = datos;
                objetoExistente.id = this.IdEditar;
                datosDB[index] = objetoExistente;
                console.log("Se Modifico con exito")
            }            
            } else {
            // Si no existe un objeto igual, crea uno nuevo
            const id = datosDB.length + 1;
            datos["id"] = id;
            datosDB.push(datos);
            }
      
          // Actualizar la base de datos local
          localStorage.setItem("misDatos", JSON.stringify(datosDB));
      
          // Ocultar el formulario
          this.ocultarFormulario();
        }
      };
  
    renderizarEnMain() {
      const main = document.querySelector("main");
      if (main) {
        main.appendChild(this.buttonContainer);
      } else {
        const newMain = document.createElement("main");
        newMain.appendChild(this.buttonContainer);
        document.body.appendChild(newMain);
      }
    };

    abrirFormularioEditar(objeto) {
        this.mostrarFormulario();
        this.formulario.reset();
        this.tipoSeleccionado = objeto.constructor;
        this.actualizarCamposFormulario();
        this.IdEditar=objeto.id;
        console.log(this.IdEditar);
      
        // Rellena los campos del formulario con los valores del objeto
        for (const key in objeto) {
          if (key !== "id") {
            const input = this.formulario.querySelector(`[name="${key}"]`);
            if (input) {
              input.value = objeto[key];
            }
          }
        }
    }; 
  };
  