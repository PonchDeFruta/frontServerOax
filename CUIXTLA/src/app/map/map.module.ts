import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared.module';
import { MapComponent } from './map.component';

const routes: Routes = [{ path: 'map', component: MapComponent, data: { title: 'Anuncio' } }];

@NgModule({
    imports: [RouterModule.forChild(routes), CommonModule, SharedModule.forRoot()],
    declarations: [],
})
export class MapModule {}
