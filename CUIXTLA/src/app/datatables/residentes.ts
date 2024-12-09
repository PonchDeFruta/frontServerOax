import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ResidenteService } from '../service/residente.service';
import { ToastrService } from 'ngx-toastr'; // Importar ToastrService

@Component({
  selector: 'app-residentes',
  templateUrl: './residentes.html',
  styleUrls: ['./residentes.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ResidentesComponent implements OnInit {
  residentes: any[] = []; // Lista completa de residentes
  filteredRows: any[] = []; // Lista filtrada dinámicamente
  search: string = ''; // Término de búsqueda
  isEditing: boolean = false; // Modo de edición
  editResidente: any = null; // Residente que se está editando

  cols = [
    { field: 'nombre', title: 'Nombre' },
    { field: 'apellido', title: 'Apellido' },
    { field: 'apodo', title: 'Apodo' },
    { field: 'comercio', title: 'Comercio' },
  ];

  constructor(
    private residentesService: ResidenteService,
    private toastr: ToastrService // Inyectar ToastrService
  ) {}

  ngOnInit(): void {
    this.getResidentes();
  }

  // Obtener la lista completa de residentes
  getResidentes(): void {
    this.residentesService.getResidentes().subscribe(
      (data) => {
        this.residentes = data.map((residente: any) => ({
          idResidente: residente.idResidente,
          nombre: residente.nombre,
          apellido: residente.apellido,
          apodo: residente.apodo,
          comercio: residente.comercio,
        }));
        this.filteredRows = [...this.residentes];
        this.toastr.success('Residentes cargados correctamente.', 'Éxito');
      },
      (error) => {
        console.error('Error al obtener residentes:', error);
        this.toastr.error('Error al cargar residentes. Intente nuevamente.', 'Error');
      }
    );
  }

  // Filtrar la lista de residentes
  applyFilter(): void {
    const searchTerm = this.search.toLowerCase();
    this.filteredRows = this.residentes.filter((residente) =>
      Object.values(residente)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm)
    );
  }

  // Editar residente
  editarResidente(residente: any): void {
    this.isEditing = true;
    this.editResidente = { ...residente }; // Crear una copia para edición
  }

  // Guardar cambios del residente editado
  guardarEdicion(): void {
    if (!this.editResidente.nombre.trim() || !this.editResidente.apellido.trim()) {
      this.toastr.warning('Nombre y apellido son obligatorios.', 'Advertencia');
      return;
    }

    this.residentesService
      .actualizarResidente(this.editResidente.idResidente, this.editResidente)
      .subscribe(
        () => {
          this.toastr.success('Residente actualizado con éxito.', 'Éxito');
          this.isEditing = false;
          this.editResidente = null;
          this.getResidentes(); // Refrescar lista
        },
        (error) => {
          console.error('Error al actualizar residente:', error);
          this.toastr.error('Error al actualizar el residente.', 'Error');
        }
      );
  }

  // Cancelar la edición
  cancelarEdicion(): void {
    this.isEditing = false;
    this.editResidente = null;
    this.toastr.info('Edición cancelada.', 'Información');
  }

  // Eliminar un residente
  eliminarResidente(idResidente: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este residente?')) {
      this.residentesService.deleteResidente(idResidente).subscribe(
        () => {
          this.toastr.success('Residente eliminado correctamente.', 'Éxito');
          this.filteredRows = this.filteredRows.filter(
            (residente) => residente.idResidente !== idResidente
          );
        },
        (error) => {
          console.error('Error al eliminar residente:', error);
          this.toastr.error('Error al eliminar el residente.', 'Error');
        }
      );
    }
  }
}
