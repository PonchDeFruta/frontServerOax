import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ResidenteService } from '../service/residente.service';
import { HttpClient } from '@angular/common/http';

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

  constructor(private residentesService: ResidenteService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getResidentes();
  }

  // Obtener la lista completa de residentes y procesarla
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
      },
      (error) => {
        console.error('Error al obtener residentes:', error);
      }
    );
  }

  // Filtrar la lista de residentes según el término de búsqueda
  applyFilter(): void {
    const searchTerm = this.search.toLowerCase();
    this.filteredRows = this.residentes.filter((residente) =>
      Object.values(residente)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm)
    );
  }

  // Lógica para activar el modo de edición
  editarResidente(residente: any): void {
    this.isEditing = true;
    this.editResidente = { ...residente }; // Crear una copia para edición
  }

  // Guardar los cambios del residente editado
  guardarEdicion(): void {
    this.residentesService
      .actualizarResidente(this.editResidente.idResidente, this.editResidente)
      .subscribe(
        (response: any) => {
          alert(response.message || 'Residente actualizado con éxito');
          this.isEditing = false;
          this.editResidente = null;
          this.getResidentes(); // Refrescar la lista
        },
        (error: any) => { // Define el tipo de error explícitamente
          console.error('Error al actualizar residente:', error);
          alert('Error al actualizar el residente.');
        }
      );
  }
  
  
  // Cancelar la edición
  cancelarEdicion(): void {
    this.isEditing = false;
    this.editResidente = null;
  }

  // Lógica para eliminar un residente
  eliminarResidente(idResidente: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este residente?')) {
      this.residentesService.deleteResidente(idResidente).subscribe(
        (response) => {
          console.log('Residente eliminado:', response);
          this.filteredRows = this.filteredRows.filter(
            (residente) => residente.idResidente !== idResidente
          );
          alert('Residente eliminado con éxito.');
        },
        (error) => {
          console.error('Error al eliminar residente:', error);
          alert('Ocurrió un error al eliminar el residente.');
        }
      );
    }
  }
}
