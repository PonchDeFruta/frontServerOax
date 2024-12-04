import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-domicilios',
  templateUrl: './domicilios.component.html',
  styleUrls: ['./domicilios.component.css'],
})
export class DomiciliosComponent implements OnInit {
  domicilios: any[] = []; // Lista completa de domicilios
  filteredRows: any[] = []; // Lista filtrada dinámicamente
  search: string = ''; // Término de búsqueda
  isEditing: boolean = false; // Modo de edición
  editDomicilio: any = null; // Domicilio que se está editando

  // Columnas de la tabla
  cols = [
    { field: 'direccion', title: 'Dirección' },
    { field: 'referencia', title: 'Referencia' },
    { field: 'coordenadas', title: 'Coordenadas' },
    { field: 'residente', title: 'Residente' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getDomicilios(); // Obtener domicilios
  }

  // Obtener domicilios junto con la información del residente
  getDomicilios(): void {
    const url = 'http://localhost:8080/residentes/obtenerResidenteDomicilio';
    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.domicilios = data.map((residente: any) => ({
          idDomicilio: residente.domicilio.idDomicilio,
          direccion: residente.domicilio.direccion,
          referencia: residente.domicilio.referencia,
          coordenadas: residente.domicilio.coordenadas,
          residente: `${residente.nombre} ${residente.apellido}`, // Solo mostrar nombre y apellido
          idResidente: residente.idResidente,
        }));
        this.filteredRows = [...this.domicilios]; // Inicializar la lista filtrada
      },
      (error) => {
        console.error('Error al obtener domicilios:', error);
      }
    );
  }

  // Filtrar la lista de domicilios según el término de búsqueda
  applyFilter(): void {
    const searchTerm = this.search.toLowerCase();
    this.filteredRows = this.domicilios.filter((domicilio) =>
      Object.values(domicilio)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm)
    );
  }

  // Activar modo de edición
  editarDomicilio(domicilio: any): void {
    this.isEditing = true;
    this.editDomicilio = { ...domicilio }; // Crear una copia para editar
  }

  // Función para capturar las coordenadas del clic en el mapa
  setCoordinates(event: MouseEvent): void {
    const mapElement = event.target as HTMLElement;

    // Obtener el tamaño de la imagen
    const rect = mapElement.getBoundingClientRect();
    const x = event.clientX - rect.left; // Coordenada X dentro de la imagen
    const y = event.clientY - rect.top;  // Coordenada Y dentro de la imagen

    // Aseguramos que las coordenadas estén dentro del rango permitido (352x443)
    const maxX = 352;
    const maxY = 443;

    const validX = Math.min(Math.max(x, 0), maxX);
    const validY = Math.min(Math.max(y, 0), maxY);

    // Asignamos las coordenadas al campo
    this.editDomicilio.coordenadas = `${Math.round(validX)},${Math.round(validY)}`;
  }

  // Guardar los cambios del domicilio editado
  guardarEdicion(): void {
    const url = `http://localhost:8080/domicilios/${this.editDomicilio.idDomicilio}`;
    this.http.put(url, this.editDomicilio).subscribe(
      (response: any) => {
        alert(response.message || 'Domicilio actualizado con éxito');
        this.isEditing = false;
        this.editDomicilio = null;
        this.getDomicilios(); // Refrescar la lista
      },
      (error) => {
        console.error('Error al actualizar domicilio:', error);
        alert('Error al actualizar el domicilio.');
      }
    );
  }

  // Cancelar la edición
  cancelarEdicion(): void {
    this.isEditing = false;
    this.editDomicilio = null;
  }

  // Eliminar domicilio
  eliminarDomicilio(idDomicilio: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este domicilio?')) {
      const url = `http://localhost:8080/domicilios/${idDomicilio}`;
      this.http.delete(url).subscribe(
        (response) => {
          this.filteredRows = this.filteredRows.filter(
            (domicilio) => domicilio.idDomicilio !== idDomicilio
          );
          alert('Domicilio eliminado con éxito.');
        },
        (error) => {
          alert('Error al eliminar el domicilio.');
        }
      );
    }
  }
}
