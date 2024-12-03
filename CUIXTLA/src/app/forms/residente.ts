import { Component } from '@angular/core';
import { Residente } from '../models/residente.model';
import { ResidenteService } from '../service/residente.service';

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

  message: string | null = null; // Mensaje de éxito o error
  messageType: 'success' | 'error' | null = null; // Tipo de mensaje (para estilos)

  constructor(private residentesService: ResidenteService) {}

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
      this.showMessage('Todos los campos obligatorios deben estar llenos.', 'error');
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
        this.showMessage('Residente creado con éxito.', 'success');
      },
      (error) => {
        console.error('Error al crear residente', error);
        this.showMessage('Error al crear residente. Intente nuevamente.', 'error');
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


  // Mostrar mensaje
  private showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      this.message = null;
      this.messageType = null;
    }, 5000);
  }
}
