import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FlatpickrDefaultsInterface } from 'angularx-flatpickr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-basic',
    templateUrl: './basic.html',
})
export class BasicComponent {
    codeArr: any = [];
    toggleCode = (name: string) => {
        if (this.codeArr.includes(name)) {
            this.codeArr = this.codeArr.filter((d: string) => d != name);
        } else {
            this.codeArr.push(name);
        }
    };

    input5: string | undefined;

    options2 = [
        { name: 'Orange', group_name: 'Group 1' },
        { name: 'White', group_name: 'Group 1' },
        { name: 'Purple', group_name: 'Group 1' },
        { name: 'Yellow', group_name: 'Group 2' },
        { name: 'Red', group_name: 'Group 2' },
        { name: 'Green', group_name: 'Group 2' },
        { name: 'Aqua', group_name: 'Group 3' },
        { name: 'Black', group_name: 'Group 3' },
        { name: 'Blue', group_name: 'Group 3' },
    ];
    input2 = 'Orange';

    dateTime: FlatpickrDefaultsInterface;
    form2!: FormGroup;

    constructor(
        public storeData: Store<any>,
        public fb: FormBuilder,
    ) {
        this.form2 = this.fb.group({
            date2: ['2022-07-05 12:00'],
        });

        this.dateTime = {
            enableTime: true,
            dateFormat: 'Y-m-d H:i',
            monthSelectorType: 'dropdown',
        };
    }
}
