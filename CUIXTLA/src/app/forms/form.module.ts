import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// shared module
import { SharedModule } from 'src/shared.module';
import { DomicilioComponent } from './domicilio';
import { AnuncioComponent } from './anuncio';
import { ResidenteComponent } from './residente';

const routes: Routes = [
    { path: 'forms/anuncio', component: AnuncioComponent, data: { title: 'Anuncio' } },
    { path: 'forms/residente', component: ResidenteComponent, data: { title: 'Residente' } },
    { path: 'forms/domicilio', component: DomicilioComponent, data: { title: 'Domicilio' } },
];
@NgModule({
    imports: [RouterModule.forChild(routes), CommonModule, SharedModule.forRoot()],
    declarations: [AnuncioComponent, ResidenteComponent],
    providers: [],
})
export class FormModule {}
