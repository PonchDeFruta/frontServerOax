import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxCustomModalComponent } from 'ngx-custom-modal';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.html',
})
export class AnunciosComponent implements OnInit, AfterViewInit {
  anuncios: any[] = []; // Lista de anuncios obtenidos del servidor
  anunciosTodos: any[] = []; // Lista de anuncios obtenidos del servidor
  residentes: any[] = []; // Lista de residentes para el dropdown del modal
  selectedAnuncio: any = {}; // Anuncio seleccionado para editar
  input: string = ''; // Propiedad para el binding del ngModel
  loading: boolean = false; // Indicador de carga de datos
  isAudio: boolean = false; // Para controlar si es audio o texto
  fileToUpload: File | null = null; // Archivo seleccionado para subir

  @ViewChild('deleteModal') deleteModal!: NgxCustomModalComponent;  // Uso de "!" para evitar el error

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAnunciosHoy();
    this.getAnunciosTodos(); // Si necesitas cargar los anuncios de todos los días
    this.getResidentes(); // Obtener lista de residentes
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
  getResidentes(): void {
    const url = 'http://localhost:8080/residentes';
    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.residentes = data.map((residente) => ({
          id: residente.id,
          nombre: `${residente.nombre} ${residente.apellido}`,
        }));
      },
      (error) => {
        console.error('Error al obtener los residentes:', error);
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

  // Abrir el modal de edición
  openModal(modal: any): void {
    if (modal && typeof modal.open === 'function') {
      modal.open();
    } else {
      console.error('Modal no tiene un método open válido');
    }
  }

  // Abrir el modal de eliminación
  openDeleteModal(anuncio: any): void {
    this.selectedAnuncio = anuncio; // Setear el anuncio a eliminar
    if (this.deleteModal) {
      this.deleteModal.open();
    } else {
      console.error('deleteModal no está disponible');
    }
  }

  // Eliminar un anuncio
  deleteAnuncio(anuncio: any): void {
    const url = `http://localhost:8080/anuncios/${anuncio.idMensaje}`;
    this.http.delete(url).subscribe(
      (response) => {
        console.log('Anuncio eliminado:', response);
        this.deleteModal.close();
        this.getAnunciosHoy(); // Actualizar la lista de anuncios
      },
      (error) => {
        console.error('Error al eliminar el anuncio:', error);
      }
    );
  }

  // Actualizar el anuncio
  updateAnuncio(): void {
    const updatedAnuncio = {
      ...this.selectedAnuncio,
      esAudio: this.isAudio,
      contenidoDelMensaje: this.isAudio ? this.selectedAnuncio.contenidoDelMensaje : this.selectedAnuncio.contenidoDelMensaje,
    };

    const url = `http://localhost:8080/anuncios/${this.selectedAnuncio.idMensaje}`;
    this.http.put(url, updatedAnuncio).subscribe(
      (response) => {
        console.log('Anuncio actualizado:', response);
        this.getAnunciosHoy(); // Actualizar la lista de anuncios
      },
      (error) => {
        console.error('Error al actualizar el anuncio:', error);
      }
    );
  }
}
