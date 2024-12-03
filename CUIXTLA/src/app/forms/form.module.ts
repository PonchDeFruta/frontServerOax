import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

// Módulos externos (si son necesarios)
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

// Componentes
import { DomicilioComponent } from './domicilio';
import { AnuncioComponent } from './anuncio';
import { ResidenteComponent } from './residente';

// Rutas del módulo
const routes: Routes = [
  { path: 'forms/anuncio', component: AnuncioComponent, data: { title: 'Anuncio' } },
  { path: 'forms/residente', component: ResidenteComponent, data: { title: 'Residente' } },
  { path: 'forms/domicilio', component: DomicilioComponent, data: { title: 'Domicilio' } },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule, // Para [(ngModel)]
    ReactiveFormsModule, // Para FormGroup y FormControl
    HttpClientModule, // Para llamadas HTTP
    NgSelectModule, // Si usas ng-select
    FlatpickrModule.forRoot(), // Si usas flatpickr para fechas
    HighlightModule, // Para el resaltado de código, si es necesario
  ],
  declarations: [DomicilioComponent, AnuncioComponent, ResidenteComponent],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
        },
      },
    },
  ],
})
export class FormModule {}
