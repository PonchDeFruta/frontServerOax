import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
})
export class TablesComponent {
  constructor(private toastr: ToastrService) {}

  // Métodos para mostrar popups
  showSuccess() {
    this.toastr.success('Acción realizada con éxito!', 'Éxito');
  }

  showError() {
    this.toastr.error('Ocurrió un error', 'Error');
  }

  showWarning() {
    this.toastr.warning('Esto es una advertencia', 'Advertencia');
  }

  showInfo() {
    this.toastr.info('Información importante', 'Info');
  }
}
