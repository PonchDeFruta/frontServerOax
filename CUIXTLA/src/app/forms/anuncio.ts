import { Component, OnInit } from '@angular/core';
import { AnuncioService } from '../service/anuncio.service'; // Ruta ajustada según tu proyecto+
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-anuncio',
  templateUrl: './anuncio.html',
})
export class AnuncioComponent implements OnInit {
  anuncio = {
    titulo: '',
    contenidoDelMensaje: '',
    fechaMensaje: '',
    esAudio: false,
    idResidente: null,
  };

  residentes: any[] = []; // Lista de residentes
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;

  dateTime = {
    enableTime: true,
    dateFormat: 'Y-m-d H:i',
    defaultDate: new Date().toISOString().slice(0, 16),
  };

  constructor(private anuncioService: AnuncioService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadResidentes();
  }

  // Cargar residentes usando el servicio
  loadResidentes() {
    this.anuncioService.getResidentes().subscribe(
      (data) => {
        this.residentes = data.filter((residente) => residente.nombre && residente.apellido);
        this.toastr.success('Residentes cargados correctamente.', 'Éxito');
      },
      (error) => {
        console.error('Error al cargar residentes:', error);
        this.toastr.error('Error al cargar residentes.', 'Error');
      }
    );
  }
  

  // Manejar selección de archivo
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.anuncio.contenidoDelMensaje = file.name; // Solo el nombre del archivo
      this.toastr.success(`Archivo "${file.name}" seleccionado correctamente.`, 'Archivo seleccionado');
    } else {
      this.toastr.warning('No se seleccionó ningún archivo.', 'Advertencia');
    }
  }
  

  // Validar si el formulario puede enviarse
  canSubmit() {
    return (
      this.anuncio.titulo &&
      this.anuncio.fechaMensaje &&
      (!this.anuncio.esAudio || this.anuncio.contenidoDelMensaje)
    );
  }

  // Crear un nuevo anuncio usando el servicio
  crearAnuncio() {
    if (!this.anuncio.titulo) {
      this.toastr.warning('El título es obligatorio.', 'Advertencia');
      return;
    }
  
    if (!this.anuncio.fechaMensaje) {
      this.toastr.warning('Debe especificar una fecha y hora.', 'Advertencia');
      return;
    }
  
    if (this.anuncio.esAudio && !this.anuncio.contenidoDelMensaje) {
      this.toastr.warning('Debe adjuntar un archivo de audio.', 'Advertencia');
      return;
    }
  
    const fechaISO = new Date(this.anuncio.fechaMensaje).toISOString();
    const payload = {
      titulo: this.anuncio.titulo,
      contenidoDelMensaje: this.anuncio.contenidoDelMensaje,
      fechaMensaje: fechaISO.substring(0, 19),
      esAudio: this.anuncio.esAudio,
      idResidente: this.anuncio.idResidente,
    };
  
    console.log('Payload enviado:', payload);
  
    this.anuncioService.crearAnuncio(payload).subscribe(
      (response) => {
        console.log('Anuncio creado:', response);
        this.toastr.success('Anuncio creado con éxito.', 'Éxito');
        this.resetFormulario();
      },
      (error) => {
        console.error('Error al crear anuncio:', error);
        this.toastr.error('Ocurrió un error al crear el anuncio.', 'Error');
      }
    );
  }
  

  // Mostrar mensajes de éxito o error
  private showMessage(message: string, type: 'success' | 'error' | null) {
    this.message = message;
    this.messageType = type;

    setTimeout(() => {
      this.message = null;
      this.messageType = null;
    }, 5000);
  }

  // Reiniciar formulario
  resetFormulario() {
    this.anuncio = {
      titulo: '',
      contenidoDelMensaje: '',
      fechaMensaje: '',
      esAudio: false,
      idResidente: null,
    };
    this.toastr.info('Formulario reiniciado.', 'Información');
  }
  
}
