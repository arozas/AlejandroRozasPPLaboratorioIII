import Terrestre from '../Entities/Terrestre.js';
import Aereo from '../Entities/Aereo.js';
import Vehiculo from '../Entities/Vehiculo.js';
/*
Archivo que simula dase de datos.
*/

const datosJSON =
'[{"id":14, "modelo":"Ferrari F100", "anoFab":1998, "velMax":400, "cantPue":2, "cantRue":4},{"id":51, "modelo":"DodgeViper", "anoFab":1991, "velMax":266, "cantPue":2, "cantRue":4},{"id":67, "modelo":"Boeing CH-47 Chinook","anoFab":1962, "velMax":302, "altMax":6, "autonomia":1200},{"id":666, "modelo":"Aprilia RSV 1000 R","anoFab":2004, "velMax":280, "cantPue":0, "cantRue":2},{"id":872, "modelo":"Boeing 747-400", "anoFab":1989,"velMax":988, "altMax":13, "autonomia":13450},{"id":742, "modelo":"Cessna CH-1 SkyhookR", "anoFab":1953,"velMax":174, "altMax":3, "autonomia":870}]'

//Función para verificar datos.
export function VerificarDataBase() {
  if (localStorage.getItem("misDatos") == null) {
    localStorage.setItem("misDatos", datosJSON);
    console.log("No hay datos es cargó base de datos.");
  }else{ 
    console.log("No se cargó base de datos, ya hay datos");
  };

}

export function MapearDatos() {
  const data = JSON.parse(localStorage.getItem("misDatos"));
  let resultados = [];

  if (data) {
    resultados = data.map((item) => {
      if ("cantPue" in item && "cantRue" in item) {
        return new Terrestre(
          item.id,
          item.modelo,
          item.anoFab,
          item.velMax,
          item.cantPue,
          item.cantRue
        );
      } else if ("altMax" in item && "autonomia" in item) {
        return new Aereo(
          item.id,
          item.modelo,
          item.anoFab,
          item.velMax,
          item.altMax,
          item.autonomia
        );
      } else {
        return new Vehiculo(item.id, item.nombre, item.apellido, item.edad);
      }
    });
  }
  console.log("Datos mapeados.");
  return resultados;
}
