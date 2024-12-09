import { Component, OnInit } from '@angular/core';
import { DomicilioService } from '../service/domicilio.service';
import { ToastrService } from 'ngx-toastr'; // Importar ToastrService

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

  constructor(private domicilioService: DomicilioService, private toastr: ToastrService) {} // Inyectar ToastrService

  ngOnInit() {
    this.cargarResidentes();
  }

  // Cargar residentes
  cargarResidentes() {
    this.domicilioService.getResidentes().subscribe(
      (data: any[]) => {
        this.residentes = data.filter((residente) => residente.domicilio === null);
        this.toastr.info('Residentes cargados correctamente.', 'Información');
      },
      (error: any) => {
        console.error('Error al cargar residentes:', error);
        this.toastr.error('Error al cargar residentes. Intente nuevamente.', 'Error');
      }
    );
  }

  // Capturar coordenadas desde el clic en el mapa
  setCoordinates(event: MouseEvent) {
    this.coorX = event.offsetX;
    this.coorY = event.offsetY;
    this.domicilio.coordenadas = `${this.coorX},${this.coorY}`;
    this.toastr.info(`Coordenadas seleccionadas: ${this.domicilio.coordenadas}`, 'Información');
  }

  // Crear domicilio y asociarlo
  guardarDomicilio() {
    if (!this.selectedResidenteId) {
      this.toastr.warning('Selecciona un residente antes de guardar.', 'Advertencia');
      return;
    }

    this.domicilioService.crearDomicilio(this.domicilio).subscribe(
      (response: any) => {
        const idDomicilio = response.data.idDomicilio;

        this.domicilioService.asociarDomicilio(this.selectedResidenteId!, idDomicilio).subscribe(
          () => {
            this.toastr.success('Domicilio asociado con éxito.', 'Éxito');
            this.resetFormulario();
          },
          (error: any) => {
            console.error('Error al asociar el domicilio:', error);
            this.toastr.error('Error al asociar el domicilio. Intente nuevamente.', 'Error');
          }
        );
      },
      (error: any) => {
        console.error('Error al crear el domicilio:', error);
        this.toastr.error('Error al crear el domicilio. Intente nuevamente.', 'Error');
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
    this.toastr.info('Formulario reiniciado.', 'Información');
  }
}
