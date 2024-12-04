import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { ToastrService } from 'ngx-toastr'; // Importamos el servicio de toastr
import { AnuncioService } from '../service/anuncio.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.html',
})
export class AnunciosComponent implements OnInit, AfterViewInit {
  anuncios: any[] = []; // Lista de anuncios obtenidos del servidor
  anunciosTodos: any[] = []; // Lista de anuncios obtenidos del servidor
  residentes: any[] = []; // Lista de residentes para el dropdown del modal
  selectedAnuncio: any = {}; // Anuncio seleccionado para editar o eliminar
  input: string = ''; // Propiedad para el binding del ngModel
  loading: boolean = false; // Indicador de carga de datos
  isAudio: boolean = false; // Para controlar si es audio o texto
  fileToUpload: File | null = null; // Archivo seleccionado para subir
  selectedResidenteId: number | null = null;

  @ViewChild('deleteModal') deleteModal!: NgxCustomModalComponent;  // Uso de "!" para evitar el error

  constructor(private http: HttpClient, private toastr: ToastrService, private anuncioService: AnuncioService) {}

  ngOnInit(): void {
    this.getAnunciosHoy();
    this.getAnunciosTodos(); // Si necesitas cargar los anuncios de todos los días
    this.loadResidentes(); // Obtener lista de residentes
    console.log('ngOnInit() ejecutado');
  }

  ngAfterViewInit(): void {
    // Esto asegura que 'deleteModal' esté disponible después de la inicialización de la vista
    if (!this.deleteModal) {
      console.error('deleteModal no está disponible');
    }
  }

  // Obtener anuncios genéricos desde la API
  private getAnunciosData(url: string, targetArray: any[]): void {
    this.loading = true;
    this.http.get<any[]>(url).subscribe(
      (data) => {
        targetArray.length = 0;  // Limpiar el array antes de añadir los nuevos datos
        data.forEach((anuncio) => {
          targetArray.push({
            idMensaje: anuncio.idMensaje,
            titulo: anuncio.titulo || 'Sin Título',
            descripcion: anuncio.contenidoDelMensaje || 'Sin Contenido',
            fechaHora: anuncio.fechaMensaje,
            esAudio: anuncio.esAudio,
            contenidoDelMensaje: anuncio.contenidoDelMensaje,
            residente: anuncio.residente
              ? `${anuncio.residente.nombre} ${anuncio.residente.apellido} (${anuncio.residente.comercio})`
              : 'No asociado a un residente',
          });
        });
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los anuncios:', error);
        this.loading = false;
      }
    );
  }

  // Obtener lista de residentes
  loadResidentes() {
    this.anuncioService.getResidentes().subscribe(
      (data) => {
        this.residentes = data.filter((residente) => residente.nombre && residente.apellido);
      },
      (error) => {
        console.error('Error al cargar residentes:', error);
      }
    );
  }

  // Obtener anuncios de hoy
  getAnunciosHoy(): void {
    const url = 'http://localhost:8080/anuncios/hoy';
    this.getAnunciosData(url, this.anuncios);
  }

  // Obtener todos los anuncios
  getAnunciosTodos(): void {
    const url = 'http://localhost:8080/anuncios/todos';
    this.getAnunciosData(url, this.anunciosTodos);
  }

  // Método que se activa cuando se cambia la opción de audio
  onAudioChange(): void {
    if (this.isAudio) {
      this.selectedAnuncio.contenidoDelMensaje = ''; // Limpiar el campo de contenido si es audio
    }
  }

  // Método que maneja la selección de un archivo de audio
  onFileSelected(event: any): void {
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload) {
      this.selectedAnuncio.contenidoDelMensaje = this.fileToUpload.name;
    }
  }

  // Generar URL del audio
  getAudioUrl(content: string): string {
    return `http://localhost:8080/${content}`;
  }

  // Descargar audio
  downloadAudio(content: string): void {
    const url = this.getAudioUrl(content);
    window.open(url, '_blank');
  }

  onResidenteSelected(): void {
    if (this.selectedResidenteId) {
      // Encontrar el residente seleccionado usando el ID
      const selectedResidente = this.residentes.find(residente => residente.idResidente === this.selectedResidenteId);
  
      if (selectedResidente) {
        // Si se encuentra el residente, asignamos el nombre completo al campo 'residente' del anuncio
        this.selectedAnuncio.residente = `${selectedResidente.nombre} ${selectedResidente.apellido}`;
        console.log('Residente seleccionado:', this.selectedAnuncio.residente);
      }
    }
  }

  // Abrir el modal de edición
  openModal(modal: NgxCustomModalComponent, anuncio: any): void {
    if (modal && typeof modal.open === 'function') {
      modal.open();  // Abre el modal de edición

      // Clonamos el anuncio para asegurarnos de que tiene el idMensaje y demás propiedades
      this.selectedAnuncio = { ...anuncio };

      // Asignamos el id del residente seleccionado
      if (this.selectedAnuncio.residente) {
        // Asignar el idResidente y su nombre completo
        this.selectedResidenteId = this.selectedAnuncio.residente.idResidente || null;
      } else {
        this.selectedResidenteId = null;
      }

      // Log para depurar si estamos recibiendo los datos correctamente
      console.log('Anuncio seleccionado para editar:', this.selectedAnuncio);
      console.log('ID Residente seleccionado:', this.selectedResidenteId);
    } else {
      console.error('Modal no tiene un método open válido');
    }
  }

  // Abrir el modal de eliminación
  openDeleteModal(anuncio: any): void {
    this.selectedAnuncio = anuncio; // Asignar el anuncio a eliminar
    if (this.deleteModal) {
      this.deleteModal.open();
    } else {
      console.error('deleteModal no está disponible');
    }
  }

  // Eliminar un anuncio
  deleteAnuncio(): void {
    const id = this.selectedAnuncio.idMensaje;  // Usamos el idMensaje del anuncio seleccionado
    const url = `http://localhost:8080/anuncios/${id}`;

    this.http.delete(url).subscribe(
      (response) => {
        console.log('Anuncio eliminado:', response);
        // Actualizamos la lista de anuncios después de eliminar
        this.anuncios = this.anuncios.filter(a => a.idMensaje !== id);
        this.deleteModal.close(); // Cerrar el modal después de eliminar
        this.toastr.success(`Anuncio ID ${id} eliminado correctamente`, 'Operación exitosa');
      },
      (error) => {
        console.error('Error al eliminar el anuncio:', error);
        this.toastr.error('No se pudo eliminar el anuncio. Intente nuevamente.', 'Error');
      }
    );
  }

  // Método para actualizar el anuncio
  updateAnuncio(anuncioId: number, updatedData: any): void {
    // Depuración para verificar que estamos pasando el idMensaje y los datos
    console.log('ID del anuncio a actualizar:', anuncioId);
    console.log('Datos enviados para actualización:', updatedData);

    // Verifica que el idMensaje no es undefined
    if (!anuncioId) {
      console.error('El ID del anuncio es undefined. No se puede actualizar el anuncio.');
      return;
    }

    const url = `http://localhost:8080/anuncios/${anuncioId}`;

    // Añadimos el idResidente a los datos a actualizar
    updatedData.idResidente = this.selectedResidenteId;

    // Realizamos la solicitud HTTP PUT
    this.http.put(url, updatedData).subscribe(
      (response) => {
        console.log('Anuncio actualizado con éxito', response);

        // Después de la actualización, obtener nuevamente los anuncios para reflejar los cambios
        this.getAnunciosHoy();  // O puedes usar getAnunciosTodos(), dependiendo de cuál lista quieras actualizar.

        // Cerrar el modal de edición
        if (this.deleteModal) {
          this.deleteModal.close();  // Si usas otro modal, ajusta la referencia correctamente
        }

        // Mostrar el mensaje de éxito con toastr
        this.toastr.success('Anuncio actualizado correctamente', 'Operación exitosa');
      },
      (error) => {
        console.error('Error al actualizar el anuncio', error);

        // Mostrar mensaje de error con toastr
        this.toastr.error('No se pudo actualizar el anuncio. Intente nuevamente.', 'Error');
      }
    );
  }

  onAudioToggle(): void { if (!this.selectedAnuncio.esAudio) { this.selectedAnuncio.contenidoDelMensaje = ''; // Limpiar contenido si no es audio
     } 
  }
}

  // Cambiar la opción de audio
