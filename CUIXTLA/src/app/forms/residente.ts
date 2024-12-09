import { Component } from '@angular/core';
import { Residente } from '../models/residente.model';
import { ResidenteService } from '../service/residente.service';
import { ToastrService } from 'ngx-toastr'; // Importar ToastrService

@Component({
  selector: 'app-residente',
  templateUrl: './residente.html',
})
export class ResidenteComponent {
  showDomicilio: boolean = false;

  // Inicialización del objeto residente
  newResidente: Residente = {
    nombre: '',
    apellido: '',
    apodo: '',
    comercio: '',
    domicilio: null, // Inicialmente null
  };

  residentes: Residente[] = []; // Lista para mostrar los residentes existentes

  constructor(
    private residentesService: ResidenteService,
    private toastr: ToastrService // Inyectar ToastrService
  ) {}

  // Manejar el cambio del checkbox
  onCheckboxChange() {
    if (this.showDomicilio) {
      this.newResidente.domicilio = {
        direccion: '',
        referencia: '',
        coordenadas: '',
      };
    } else {
      this.newResidente.domicilio = null;
    }
  }

  // Manejar clic en el mapa para establecer coordenadas
  setCoordinates(event: MouseEvent) {
    if (this.newResidente.domicilio) {
      const x = event.offsetX;
      const y = event.offsetY;
      this.newResidente.domicilio.coordenadas = `${x}, ${y}`;
      this.toastr.info(`Coordenadas seleccionadas: ${x}, ${y}`, 'Información');
    }
  }

  // Validar campos obligatorios
  validateFields(): boolean {
    return !!(
      this.newResidente.nombre.trim() &&
      this.newResidente.apellido.trim() &&
      this.newResidente.apodo.trim() &&
      this.newResidente.comercio.trim()
    );
  }

  // Agregar un nuevo residente
  addResidente(): void {
    if (!this.validateFields()) {
      this.toastr.warning('Todos los campos obligatorios deben estar llenos.', 'Advertencia');
      return;
    }

    this.residentesService.addResidente(this.newResidente).subscribe(
      (data: Residente) => {
        this.residentes.push(data);
        this.newResidente = {
          nombre: '',
          apellido: '',
          apodo: '',
          comercio: '',
          domicilio: null,
        };
        this.showDomicilio = false; // Resetear el checkbox
        this.toastr.success('Residente creado con éxito.', 'Éxito');
      },
      (error) => {
        console.error('Error al crear residente', error);
        this.toastr.error('Error al crear residente. Intente nuevamente.', 'Error');
      }
    );
  }

  updateDomicilioField(field: keyof NonNullable<Residente['domicilio']>, value: string): void {
    if (!this.newResidente.domicilio) {
      this.newResidente.domicilio = {
        direccion: '',
        referencia: '',
        coordenadas: '',
      };
    }
    this.newResidente.domicilio[field] = value;
  }
}
