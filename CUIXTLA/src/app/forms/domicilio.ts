import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-domicilio',
    templateUrl: './domicilio.html',
})
export class DomicilioComponent {
    coorX: number;
    coorY: number;

    constructor() {
        this.coorX = 0;
        this.coorY = 0;
    }
}
