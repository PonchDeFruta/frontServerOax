import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dispositivos',
  templateUrl: './dispositivos.component.html',
  styleUrls: ['./dispositivos.component.css'],
})
export class DispositivosComponent implements OnInit {
  dispositivos: any[] = []; // Lista completa de dispositivos
  filteredDispositivos: any[] = []; // Lista filtrada dinámicamente
  search: string = ''; // Término de búsqueda

  // Columnas de la tabla
  cols = [
    { field: 'nombreDispositivo', title: 'Nombre del Dispositivo' },
    { field: 'contadorRecepcionMensajes', title: 'Contador de Mensajes' },
    { field: 'idMensaje', title: 'ID del Mensaje' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getDispositivos(); // Obtener dispositivos
  }

  // Obtener dispositivos de la API
  getDispositivos(): void {
    const url = 'http://localhost:8080/api/dispositivos/obtenerTodosLosDispositivos';
    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.dispositivos = data.map((dispositivo: any) => ({
          idDispositivo: dispositivo.idDispositivo,
          nombreDispositivo: dispositivo.nombreDispositivo,
          contadorRecepcionMensajes: dispositivo.contadorRecepcionMensajes,
          idMensaje: dispositivo.idMensaje,
        }));
        this.filteredDispositivos = [...this.dispositivos]; // Inicializar la lista filtrada
      },
      (error) => {
        console.error('Error al obtener dispositivos:', error);
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
  }

  // Eliminar un dispositivo de la lista
  eliminarDispositivo(idDispositivo: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este dispositivo?')) {
      const url = `http://localhost:8080/api/dispositivos/${idDispositivo}`;
      this.http.delete(url).subscribe(
        (response) => {
          this.filteredDispositivos = this.filteredDispositivos.filter(
            (dispositivo) => dispositivo.idDispositivo !== idDispositivo
          );
          alert('Dispositivo eliminado con éxito.');
        },
        (error) => {
          console.error('Error al eliminar dispositivo:', error);
          alert('Ocurrió un error al eliminar el dispositivo.');
        }
      );
    }
  }
}
