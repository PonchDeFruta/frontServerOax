import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ResidenteService } from '../service/residente.service';

interface Residente {
    nombre: string;
    apellido: string;
    apodo: string;
    comercio: string;
    domicilio: { direccion: string; referencia: string; coordenadas: string } | null;
}

@Component({
    selector: 'app-residentes',
    templateUrl: './residentes.html',
    styleUrls: ['./residentes.css'],
    encapsulation: ViewEncapsulation.None,
})
export class ResidentesComponent implements OnInit {
    residentes: any[] = [];
    search: string = '';
    cols = [
        { field: 'nombre', title: 'Nombre' },
        { field: 'apellido', title: 'Apellido' },
        { field: 'apodo', title: 'Apodo' },
        { field: 'comercio', title: 'Comercio' },
        { field: 'accion', title: 'Editar' },
    ];

    rows: any[] = [];
    constructor(private residentesService: ResidenteService) {}

    // Método para obtener la lista de residentes
    getResidentes(): void {
        this.residentesService.getResidentes().subscribe(
            (data) => {
                this.residentes = data; // Asignar la lista de residentes
                console.log(this.residentes);
                this.rows = this.residentes;
            },
            (error) => {
                console.error('Error al obtener residentes', error);
            },
        );
    }
    ngOnInit(): void {
        this.getResidentes();
    }
}
