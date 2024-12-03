import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ResidenteService } from '../service/residente.service';

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
  cols = [
    { field: 'nombre', title: 'Nombre' },
    { field: 'apellido', title: 'Apellido' },
    { field: 'apodo', title: 'Apodo' },
    { field: 'comercio', title: 'Comercio' },
  ];

  constructor(private residentesService: ResidenteService) {}

  // Obtener la lista completa de residentes y procesarla
  getResidentes(): void {
    this.residentesService.getResidentes().subscribe(
      (data) => {
        // Extraer solo los campos necesarios
        this.residentes = data.map((residente: any) => ({
          idResidente: residente.idResidente,
          nombre: residente.nombre,
          apellido: residente.apellido,
          apodo: residente.apodo,
          comercio: residente.comercio,
        }));
        this.filteredRows = [...this.residentes]; // Inicializar la lista filtrada
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

  // Lógica para editar un residente
  editarResidente(residente: any): void {
    console.log('Editar residente:', residente);
    // Implementar la lógica de edición aquí (abrir modal, navegar, etc.)
  }

  // Lógica para eliminar un residente
  eliminarResidente(idResidente: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este residente?')) {
      this.residentesService.deleteResidente(idResidente).subscribe(
        (response) => {
          console.log('Residente eliminado:', response);
          // Actualizar la lista de residentes filtrados
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

  // Cargar la lista de residentes al iniciar el componente
  ngOnInit(): void {
    this.getResidentes();
  }
}
