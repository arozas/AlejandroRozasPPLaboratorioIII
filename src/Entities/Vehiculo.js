export default class Vehiculo {
    constructor(id, modelo, anoFab, velMax) {
        this.id = id;
        this.modelo = modelo;
        this.anoFab = anoFab;
        this.velMax = velMax;
    }

    toString() {
        return `${this.nombre} ${this.apellido}`;
    }

    toJson() {
        return JSON.stringify(this);
    }

    static filtrar(datos, clase) {
        return datos.filter((dato) => dato instanceof clase);
    }
}
