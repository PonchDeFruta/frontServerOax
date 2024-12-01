import { Component } from '@angular/core';
import { Residente } from '../models/residente.model';

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

  // Manejar el cambio del checkbox
  onCheckboxChange() {
    if (this.showDomicilio) {
      // Inicializar el objeto `domicilio`
      this.newResidente.domicilio = {
        direccion: '',
        referencia: '',
        coordenadas: '',
      };
    } else {
      // Asignar `null` cuando el checkbox está desactivado
      this.newResidente.domicilio = null;
    }
  }

  // Manejar clic en el mapa
  setCoordinates(event: MouseEvent) {
    if (this.newResidente.domicilio) {
      const x = event.offsetX;
      const y = event.offsetY;
      this.newResidente.domicilio.coordenadas = `${x}, ${y}`;
    }
  }

  // Enviar residente
  addResidente(): void {
    console.log('Residente enviado:', this.newResidente);
    // Aquí llamas al servicio para enviar el residente al backend
  }
}
