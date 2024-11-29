import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// shared module
import { SharedModule } from 'src/shared.module';

import { CardsComponent } from './cards';

const routes: Routes = [{ path: 'components/cards', component: CardsComponent, data: { title: 'Anuncios' } }];
@NgModule({
    imports: [RouterModule.forChild(routes), CommonModule, SharedModule.forRoot()],
    declarations: [CardsComponent],
    providers: [],
})
export class ComponentsModule {}
