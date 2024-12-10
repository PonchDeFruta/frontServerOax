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
  isAnunciosHoy: boolean = true; // Modo por defecto: mostrar anuncios de hoy
  urlServer = "http://192.1.1.253:8080";


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

  private getAnunciosData(url: string, targetArray: any[], successMessage: string, errorMessage: string): void {
    this.loading = true; // Activar indicador de carga
  
    this.http.get<any[]>(url).subscribe(
      (data) => {
        targetArray.length = 0; // Limpiar el array antes de añadir los nuevos datos
  
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
  
        this.loading = false; // Desactivar indicador de carga
        this.toastr.success(successMessage, 'Éxito'); // Mostrar mensaje de éxito
      },
      (error) => {
        console.error(errorMessage, error); // Registrar error en la consola
        this.loading = false; // Desactivar indicador de carga
        this.toastr.error(errorMessage, 'Error'); // Mostrar mensaje de error
      }
    );
  }
  
    // Cambiar entre "Hoy" y "Todos" los anuncios
  toggleAnunciosMode() {
    this.isAnunciosHoy = !this.isAnunciosHoy; // Alternar el modo
    if (this.isAnunciosHoy) {
      this.getAnunciosHoy(); // Cargar anuncios de hoy
    } else {
      this.getAnunciosTodos(); // Cargar todos los anuncios
    }
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
// Obtener anuncios de hoy con mensajes
getAnunciosHoy(): void {
  const url = `${this.urlServer}/anuncios/hoy`;
  const successMessage = 'Anuncios de hoy cargados correctamente.';
  const errorMessage = 'Error al cargar los anuncios de hoy.';
  this.getAnunciosData(url, this.anuncios, successMessage, errorMessage);
}

// Obtener todos los anuncios con mensajes
getAnunciosTodos(): void {
  const url = `${this.urlServer}/anuncios/todos`;
  const successMessage = 'Todos los anuncios cargados correctamente.';
  const errorMessage = 'Error al cargar todos los anuncios.';
  this.getAnunciosData(url, this.anunciosTodos, successMessage, errorMessage);
}


  // Método que se activa cuando se cambia la opción de audio

  onAudioChange(): void {
    if (this.isAudio) {
      this.selectedAnuncio.esAudio = true; // Cambiar la bandera a true
      this.selectedAnuncio.contenidoDelMensaje = ''; // Limpiar contenido para adjuntar archivo
    } else {
      this.selectedAnuncio.esAudio = false; // Cambiar la bandera a false
    }
  }

  // Método que maneja la selección de un archivo de audio
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input?.files?.length) {
      const file = input.files[0];
  
      this.selectedAnuncio.contenidoDelMensaje = file.name;
      this.selectedAnuncio.esAudio = true;
  
      this.toastr.success(`Archivo "${file.name}" seleccionado.`, 'Éxito');
    } else {
      this.toastr.warning('No se seleccionó ningún archivo.', 'Advertencia');
    }
  }
  

  // Generar URL del audio
  getAudioUrl(content: string): string {
    return `${this.urlServer}/${content}`;
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

  deleteAnuncio(): void {
    if (!confirm(`¿Estás seguro de que deseas eliminar el anuncio "${this.selectedAnuncio.titulo}"?`)) {
      return;
    }
  
    const id = this.selectedAnuncio.idMensaje;
    const url = `${this.urlServer}/anuncios/${id}`;
  
    this.http.delete(url).subscribe(
      () => {
        this.toastr.success(`Anuncio eliminado correctamente.`, 'Éxito');
        this.anuncios = this.anuncios.filter(a => a.idMensaje !== id);
        this.deleteModal.close();
        window.location.reload();
      },
      (error) => {
        console.error('Error al eliminar el anuncio:', error);
        this.toastr.error('No se pudo eliminar el anuncio.', 'Error');
        window.location.reload();
      }
    );
  }
  
  
  updateAnuncio(anuncioId: number, updatedData: any): void {
    // Depuración para verificar que estamos pasando el idMensaje y los datos
    console.log('ID del anuncio a actualizar:', anuncioId);
    console.log('Datos enviados para actualización:', updatedData);

    if (updatedData.esAudio && !updatedData.contenidoDelMensaje) {
      this.toastr.error('Debe adjuntar un archivo de audio antes de guardar.', 'Error');
      return;
    }

    console.log('Datos enviados:', updatedData);
  
    // Verifica que el idMensaje no es undefined
    if (!anuncioId) {
      console.error('El ID del anuncio es undefined. No se puede actualizar el anuncio.');
      return;
    }
  
    const url = `${this.urlServer}/anuncios/${anuncioId}`;
  
    // Añadimos el idResidente a los datos a actualizar
    updatedData.idResidente = this.selectedResidenteId;
  
    // Realizamos la solicitud HTTP PUT
    this.http.put(url, updatedData).subscribe(
      (response: any) => {
        console.log('Anuncio actualizado con éxito', response);
        this.toastr.success('Anuncio actualizado correctamente.', 'Éxito');
  
        // Obtener el anuncio actualizado
        const updatedAnuncio = response; // Suponemos que la respuesta contiene el anuncio actualizado
  
        // Actualizar el anuncio en la lista local de anuncios
        let index;
        if (this.isAnunciosHoy) {
          // Buscar y actualizar en la lista de anuncios de hoy
          index = this.anuncios.findIndex(anuncio => anuncio.idMensaje === anuncioId);
          if (index !== -1) {
            this.anuncios[index] = updatedAnuncio; // Reemplazar el anuncio antiguo con el actualizado
          } else {
            this.anuncios.push(updatedAnuncio); // Si no se encuentra, añadirlo
          }
        } else {
          // Buscar y actualizar en la lista de todos los anuncios
          index = this.anunciosTodos.findIndex(anuncio => anuncio.idMensaje === anuncioId);
          if (index !== -1) {
            this.anunciosTodos[index] = updatedAnuncio; // Reemplazar el anuncio antiguo con el actualizado
          } else {
            this.anunciosTodos.push(updatedAnuncio); // Si no se encuentra, añadirlo
          }
        }
  
        // Volver a cargar la lista después de la actualización
        if (this.isAnunciosHoy) {
          this.getAnunciosHoy(); // Cargar los anuncios de hoy
        } else {
          this.getAnunciosTodos(); // Cargar todos los anuncios
        }
  
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
  
  onAudioToggle(): void {
    if (this.selectedAnuncio.esAudio) {
      this.selectedAnuncio.esAudio = false; // Cambiar a texto
      this.selectedAnuncio.contenidoDelMensaje = ''; // Limpiar el contenido
      this.fileToUpload = null; // Limpiar archivo seleccionado
    } else {
      this.selectedAnuncio.esAudio = true; // Cambiar a audio
      this.selectedAnuncio.contenidoDelMensaje = ''; // Preparar para archivo
    }
  }
  



}
