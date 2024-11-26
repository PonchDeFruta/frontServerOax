import { Component, ViewEncapsulation } from '@angular/core';

interface Anuncio {
    residente: string;
    fechaHora: string;
    titulo: string;
    comercio: string;
    descripcion: string;
}

@Component({
    selector: 'app-cards',
    templateUrl: './cards.html',
})
export class CardsComponent {
    anuncios: Anuncio[] = [];
    search2 = '';

    ngOnInit() {
        this.anuncios = this.getAnuncios();
    }

    getAnuncios(): Anuncio[] {
        return [
            {
                residente: 'Residente 1',
                fechaHora: '2023-10-01 10:00',
                titulo: 'Título 1',
                comercio: 'Comercio 1',
                descripcion: 'Descripción del anuncio 1',
            },
            {
                residente: 'Residente 2',
                fechaHora: '2023-10-02 11:00',
                titulo: 'Título 2',
                comercio: 'Comercio 2',
                descripcion: 'Descripción del anuncio 2',
            },
        ];
    }

    residentes = [
        { id: 1, name: 'Arturo' },
        { id: 2, name: 'Juan' },
        { id: 3, name: 'Maria' },
        { id: 4, name: 'Mixiotin' },
    ];
    input = 'Seleccione Residente';

    years = [
        { year: 2021 },
        { year: 2022 },
        { year: 2023 },
        // Agrega más años según sea necesario
    ];
    months = [
        { month: 'Enero' },
        { month: 'Febrero' },
        { month: 'Marzo' },
        { month: 'Abril' },
        { month: 'Mayo' },
        { month: 'Junio' },
        { month: 'Julio' },
        { month: 'Agosto' },
        { month: 'Septiembre' },
        { month: 'Octubre' },
        { month: 'Noviembre' },
        { month: 'Diciembre' },
    ];
    days = Array.from({ length: 31 }, (_, i) => ({ day: i + 1 }));

    selectedYear: number = 0;
    selectedMonth: string = '';
    selectedDay: number = 0;
    constructor() {}
}
