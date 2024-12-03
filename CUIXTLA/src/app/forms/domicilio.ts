// Importa los tipos adecuados si es posible
import { Component, OnInit } from '@angular/core';
import { DomicilioService } from '../service/domicilio.service';

@Component({
  selector: 'app-domicilio',
  templateUrl: './domicilio.html',
})
export class DomicilioComponent implements OnInit {
  coorX: number = 0;
  coorY: number = 0;
  residentes: any[] = []; // Lista de residentes
  selectedResidenteId: number | null = null; // ID del residente seleccionado

  domicilio = {
    direccion: '',
    referencia: '',
    coordenadas: '',
  };

  constructor(private domicilioService: DomicilioService) {}

  ngOnInit() {
    this.cargarResidentes();
  }

  // Cargar residentes
  cargarResidentes() {
    this.domicilioService.getResidentes().subscribe(
      (data: any[]) => {
        this.residentes = data.filter((residente) => residente.domicilio === null);
      },
      (error: any) => {
        console.error('Error al cargar residentes:', error);
      }
    );
  }

  // Capturar coordenadas desde el clic en el mapa
  setCoordinates(event: MouseEvent) {
    this.coorX = event.offsetX;
    this.coorY = event.offsetY;
    this.domicilio.coordenadas = `${this.coorX},${this.coorY}`;
  }

  // Crear domicilio y asociarlo
  guardarDomicilio() {
    if (!this.selectedResidenteId) {
      alert('Selecciona un residente antes de guardar.');
      return;
    }

    this.domicilioService.crearDomicilio(this.domicilio).subscribe(
      (response: any) => {
        const idDomicilio = response.data.idDomicilio;

        this.domicilioService.asociarDomicilio(this.selectedResidenteId!, idDomicilio).subscribe(
          () => {
            alert('Domicilio asociado con éxito.');
            this.resetFormulario();
          },
          (error: any) => {
            console.error('Error al asociar el domicilio:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error al crear el domicilio:', error);
      }
    );
  }
  // Verifica si todos los campos requeridos están completos
camposValidos(): boolean {
  return (
    !!this.selectedResidenteId && // Verifica que se seleccionó un residente
    !!this.domicilio.direccion && // Verifica que la dirección no está vacía
    !!this.domicilio.referencia && // Verifica que la referencia no está vacía
    !!this.domicilio.coordenadas // Verifica que las coordenadas están seleccionadas
  );
}


  // Reiniciar el formulario
  resetFormulario() {
    this.selectedResidenteId = null;
    this.domicilio = { direccion: '', referencia: '', coordenadas: '' };
    this.coorX = 0;
    this.coorY = 0;
    this.cargarResidentes(); // Recargar la lista
  }
}
