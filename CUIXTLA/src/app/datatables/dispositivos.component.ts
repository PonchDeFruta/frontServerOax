import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dispositivos',
  templateUrl: './dispositivos.component.html',
  styleUrls: ['./dispositivos.component.css'],
})
export class DispositivosComponent implements OnInit {
  dispositivos: any[] = []; // Lista completa de dispositivos
  filteredDispositivos: any[] = []; // Lista filtrada dinámicamente
  search: string = ''; // Término de búsqueda
  urlServer = "http://192.1.1.253:8080";

  cols = [
    { field: 'nombreDispositivo', title: 'Nombre del Dispositivo' },
    { field: 'contadorRecepcionMensajes', title: 'Contador de Mensajes' },
    { field: 'idMensaje', title: 'ID del Mensaje' },
  ];

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getDispositivos();  // Obtener dispositivos
  }

  // Obtener dispositivos desde la API
  getDispositivos(): void {
    const url = `${this.urlServer}/api/dispositivos/obtenerTodosLosDispositivos`;
    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.dispositivos = data.map((dispositivo: any) => ({
          idDispositivo: dispositivo.idDispositivo,
          nombreDispositivo: dispositivo.nombreDispositivo,
          contadorRecepcionMensajes: dispositivo.contadorRecepcionMensajes,
          idMensaje: dispositivo.idMensaje,
        }));
        this.filteredDispositivos = [...this.dispositivos];  // Inicializar lista filtrada
        this.toastr.success('Dispositivos cargados correctamente.', 'Éxito');
      },
      (error) => {
        console.error('Error al obtener dispositivos:', error);
        this.toastr.error('Error al cargar los dispositivos.', 'Error');
      }
    );
  }

  // Filtrar dispositivos según el término de búsqueda
  applyFilter(): void {
    const searchTerm = this.search.toLowerCase();
    this.filteredDispositivos = this.dispositivos.filter((dispositivo) =>
      Object.values(dispositivo)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm)
    );

    if (this.filteredDispositivos.length === 0) {
      this.toastr.warning('No se encontraron dispositivos con el término ingresado.', 'Advertencia');
    }
  }

  // Eliminar un dispositivo de la lista
  eliminarDispositivo(idDispositivo: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este dispositivo?')) {
      const url = `${this.urlServer}/api/dispositivos/${idDispositivo}`;
      this.http.delete(url).subscribe(
        () => {
          this.filteredDispositivos = this.filteredDispositivos.filter(
            (dispositivo) => dispositivo.idDispositivo !== idDispositivo
          );
          this.toastr.success('Dispositivo eliminado correctamente.', 'Éxito');
        },
        (error) => {
          console.error('Error al eliminar dispositivo:', error);
          this.toastr.error('Ocurrió un error al eliminar el dispositivo.', 'Error');
        }
      );
    }
  }
}
