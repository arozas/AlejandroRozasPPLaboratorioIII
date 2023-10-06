import Vehiculo from './Vehiculo.js';

export default class Aereo extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, altMax, autonomia) {
        super(id, modelo, anoFab, velMax);
        this.altMax = altMax;
        this.autonomia = autonomia;
    }

    toString() {
        return `${super.toString()} (Aereo)`;
    }

    toJson() {
        return JSON.stringify(this);
    }

    static filtrar(datos) {
        return Vehiculo.filtrar(datos, Aereo);
    }
}
