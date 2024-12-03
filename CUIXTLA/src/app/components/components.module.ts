import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// Importación del SharedModule
import { SharedModule } from 'src/shared.module';

// Importar el componente CardsComponent
import { AnunciosComponent } from './cards';

const routes: Routes = [
  { 
    path: 'components/cards', 
    component: AnunciosComponent, 
    data: { title: 'Anuncios' } 
  }
];

@NgModule({
  declarations: [AnunciosComponent], // Declarar el componente
  imports: [
    CommonModule, 
    RouterModule.forChild(routes), // Importar rutas
    SharedModule // Eliminar .forRoot() si no es necesario
  ],
  exports: [RouterModule], // Exportar RouterModule si el módulo debe ser reutilizable
})
export class ComponentsModule {}
