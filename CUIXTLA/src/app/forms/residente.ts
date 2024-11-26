import { Component } from '@angular/core';

@Component({
    selector: 'app-residente',
    templateUrl: './residente.html',
})
export class ResidenteComponent {
    isDivEnabled: boolean = true;
    coorX: number;
    coorY: number;

    constructor() {
        this.coorX = 0;
        this.coorY = 0;
    }

    ngOnInit() {
        this.calculateCoordinates();
    }

    calculateCoordinates() {
        // Lógica para calcular las coordenadas
        this.coorX = this.calculateCoorX();
        this.coorY = this.calculateCoorY();
    }

    calculateCoorX(): number {
        // Lógica para calcular la coordenada X
        return 9834894; // Ejemplo de valor calculado
    }

    calculateCoorY(): number {
        // Lógica para calcular la coordenada Y
        return 9834894; // Ejemplo de valor calculado
    }
}
