import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-domicilios',
  templateUrl: './domicilios.component.html',
  styleUrls: ['./domicilios.component.css'],
})
export class DomiciliosComponent implements OnInit {
  domicilios: any[] = [];  // Lista completa de domicilios
  filteredRows: any[] = [];  // Lista filtrada dinámicamente
  search: string = '';  // Término de búsqueda
  isEditing: boolean = false;  // Modo de edición
  editDomicilio: any = null;  // Domicilio que se está editando
  urlServer = "http://192.1.1.253:8080";
  cols = [
    { field: 'direccion', title: 'Dirección' },
    { field: 'referencia', title: 'Referencia' },
    { field: 'coordenadas', title: 'Coordenadas' },
    { field: 'residente', title: 'Residente' },
  ];

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getDomicilios();  // Obtener domicilios
  }

  // Obtener domicilios junto con la información del residente
  getDomicilios(): void {
    const url = `${this.urlServer}/residentes/obtenerResidenteDomicilio`;
    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.domicilios = data.map((residente: any) => ({
          idDomicilio: residente.domicilio.idDomicilio,
          direccion: residente.domicilio.direccion,
          referencia: residente.domicilio.referencia,
          coordenadas: residente.domicilio.coordenadas,
          residente: `${residente.nombre} ${residente.apellido}`,
          idResidente: residente.idResidente,
        }));
        this.filteredRows = [...this.domicilios];  // Inicializar la lista filtrada
        this.toastr.success('Domicilios cargados correctamente.', 'Éxito');
      },
      (error) => {
        console.error('Error al obtener domicilios:', error);
        this.toastr.error('Error al cargar los domicilios.', 'Error');
      }
    );
  }

  // Filtrar la lista de domicilios
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
    this.editDomicilio = { ...domicilio };  // Crear una copia para editar
  }

  // Capturar coordenadas del clic en el mapa
  setCoordinates(event: MouseEvent): void {
    const mapElement = event.target as HTMLElement;
    const rect = mapElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // Aseguramos que las coordenadas estén dentro del rango permitido (352x443)
    const maxX = 352;
    const maxY = 443;

    const validX = Math.min(Math.max(x, 0), maxX);
    const validY = Math.min(Math.max(y, 0), maxY);
	
	
	this.editDomicilio.coordenadas = `${Math.round(x)},${Math.round(y)}`;
    this.toastr.info(`Coordenadas seleccionadas: ${this.editDomicilio.coordenadas}`, 'Información');
  }

  // Guardar cambios del domicilio editado
  guardarEdicion(): void {
    if (!this.validarCampos()) {
      this.toastr.warning('Todos los campos son obligatorios.', 'Advertencia');
      return;
    }

    const url = `${this.urlServer}/domicilios/${this.editDomicilio.idDomicilio}`;
    this.http.put(url, this.editDomicilio).subscribe(
      (response: any) => {
        this.toastr.success('Domicilio actualizado con éxito.', 'Éxito');
        this.isEditing = false;
        this.editDomicilio = null;
        this.getDomicilios();  // Refrescar lista
      },
      (error) => {
        console.error('Error al actualizar domicilio:', error);
        this.toastr.error('Error al actualizar el domicilio.', 'Error');
      }
    );
  }

  // Cancelar edición
  cancelarEdicion(): void {
    this.isEditing = false;
    this.editDomicilio = null;
    this.toastr.info('Edición cancelada.', 'Información');
  }

  // Eliminar domicilio
  eliminarDomicilio(idDomicilio: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este domicilio?')) {
      const url = `${this.urlServer}/domicilios/${idDomicilio}`;
      this.http.delete(url).subscribe(
        () => {
          this.toastr.success('Domicilio eliminado correctamente.', 'Éxito');
          this.filteredRows = this.filteredRows.filter(
            (domicilio) => domicilio.idDomicilio !== idDomicilio
          );
        },
        (error) => {
          console.error('Error al eliminar el domicilio:', error);
          this.toastr.error('Error al eliminar el domicilio.', 'Error');
        }
      );
    }
  }

  // Validar campos obligatorios
  validarCampos(): boolean {
    if (
      !this.editDomicilio.direccion?.trim() ||
      !this.editDomicilio.referencia?.trim() ||
      !this.editDomicilio.coordenadas?.trim()
    ) {
      return false;  // Campos inválidos
    }
    return true;  // Campos válidos
  }
}
