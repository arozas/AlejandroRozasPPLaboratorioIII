import Vehiculo from './Vehiculo.js';

export default class Terrestre extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, cantPue, cantRue) {
        super(id, modelo, anoFab, velMax);
        this.cantPue = cantPue;
        this.cantRue = cantRue;
    }

    toString() {
        return `${super.toString()} (Terrestre)`;
    }

    toJson() {
        return JSON.stringify(this);
    }

    static filtrar(datos) {
        return Vehiculo.filtrar(datos, Terrestre);
    }
}