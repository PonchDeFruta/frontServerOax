import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ResidenteService } from '../service/residente.service';

interface Residente {
    nombre: string;
    apellido: string;
    apodo: string;
    comercio: string;
    domicilio: { direccion: string; referencia: string; coordenadas: string } | null;
}

@Component({
    selector: 'app-residente',
    templateUrl: './residente.html',
})
export class ResidenteComponent {
    coorX: number;
    coorY: number;
    showDomicilio: boolean = false;

    constructor(
        private cdr: ChangeDetectorRef,
        private residentesService: ResidenteService,
    ) {
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

    onCheckboxChange() {
        this.cdr.detectChanges();
        console.log(this.showDomicilio);
    }

    residentes: Residente[] = []; // Array para almacenar la lista de residentes
    newResidente: Residente = {
        // Objeto para almacenar un nuevo residente
        nombre: '',
        apellido: '',
        apodo: '',
        comercio: '',
        domicilio: null,
    };

    // Método para crear un nuevo residente
    addResidente(): void {
        this.residentesService.addResidente(this.newResidente).subscribe(
            (data) => {
                this.residentes.push(data); // Añadir el nuevo residente a la lista
                this.newResidente = {
                    // Limpiar el formulario
                    nombre: '',
                    apellido: '',
                    apodo: '',
                    comercio: '',
                    domicilio: null,
                };
            },
            (error) => {
                console.error('Error al crear residente', error);
            },
        );
    }
}
