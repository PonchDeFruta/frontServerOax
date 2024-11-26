import { Component, OnInit, ViewEncapsulation } from '@angular/core';

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
    rows = [
        { id: 1, nombre: 'Juan', apellido: 'Pérez', apodo: 'JP', comercio: 'Comercio 1' },
        { id: 2, nombre: 'María', apellido: 'González', apodo: 'MG', comercio: 'Comercio 2' },
        { id: 3, nombre: 'Carlos', apellido: 'Rodríguez', apodo: 'CR', comercio: 'Comercio 3' },
        { id: 4, nombre: 'Ana', apellido: 'López', apodo: 'AL', comercio: 'Comercio 4' },
        { id: 5, nombre: 'Luis', apellido: 'Martínez', apodo: 'LM', comercio: 'Comercio 5' },
    ];

    constructor() {}

    ngOnInit(): void {}
}
