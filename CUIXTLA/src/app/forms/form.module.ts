import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// shared module
import { SharedModule } from 'src/shared.module';

import { BasicComponent } from './basic';
import { InputGroupComponent } from './input-group';
import { LayoutsComponent } from './layouts';
import { ValidationComponent } from './validation';
import { InputMaskComponent } from './input-mask';
import { Select2Component } from './select2';
import { CheckboxRadioComponent } from './checkbox-radio';
import { SwitchesComponent } from './switches';
import { WizardsComponent } from './wizards';
import { FileUploadComponent } from './file-upload';
import { QuillEditorComponent } from './quill-editor';
import { DatePickerComponent } from './date-picker';
import { ClipboardComponent } from './clipboard';
import { ResidenteComponent } from './residente';
import { DomicilioComponent } from './domicilio';

const routes: Routes = [
    { path: 'forms/basic', component: BasicComponent, data: { title: 'Anuncio' } },
    { path: 'forms/residente', component: ResidenteComponent, data: { title: 'Residente' } },
    { path: 'forms/domicilio', component: DomicilioComponent, data: { title: 'Domicilio' } },
];
@NgModule({
    imports: [RouterModule.forChild(routes), CommonModule, SharedModule.forRoot()],
    declarations: [
        BasicComponent,
        InputGroupComponent,
        LayoutsComponent,
        ValidationComponent,
        InputMaskComponent,
        Select2Component,
        CheckboxRadioComponent,
        SwitchesComponent,
        WizardsComponent,
        FileUploadComponent,
        QuillEditorComponent,
        DatePickerComponent,
        ClipboardComponent,
    ],
    providers: [],
})
export class FormModule {}
