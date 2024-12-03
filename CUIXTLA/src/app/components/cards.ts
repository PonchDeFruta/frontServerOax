import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.html',
})
export class AnunciosComponent implements OnInit {
  anuncios: any[] = []; // Lista de anuncios obtenidos del servidor
  residentes: any[] = []; // Lista de residentes para el dropdown del modal
  input: string = ''; // Propiedad para el binding del ngModel

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAnunciosHoy();
    this.getResidentes();
    this.getAnunciosTodos();
    this.generateYearOptions();
  }

  // Consumir el endpoint para obtener anuncios de hoy
  getAnunciosHoy(): void {
    const url = 'http://localhost:8080/anuncios/hoy';
    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.anuncios = data.map((anuncio) => ({
          idMensaje: anuncio.idMensaje,
          titulo: anuncio.titulo || 'Sin Título',
          descripcion: anuncio.contenidoDelMensaje || 'Sin Contenido',
          fechaHora: anuncio.fechaMensaje,
          esAudio: anuncio.esAudio,
          contenidoDelMensaje: anuncio.contenidoDelMensaje,
          residente: anuncio.residente
            ? `${anuncio.residente.nombre} ${anuncio.residente.apellido} (${anuncio.residente.comercio})`
            : 'No asociado a un residente',
          comercio: anuncio.residente?.comercio || 'Sin Comercio',
        }));
      },
      (error) => {
        console.error('Error al obtener los anuncios:', error);
      }
    );
  }

  // Obtener residentes (simulación)
  getResidentes(): void {
    this.residentes = [
      { id: 1, name: 'Residente A' },
      { id: 2, name: 'Residente B' },
    ];
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

  // Abrir modal (simulación)
  openModal(modal: any): void {
    if (modal && typeof modal.open === 'function') {
      modal.open();
    } else {
      console.error('Modal no tiene un método open válido');
    }
  }
    /*Filtros*/ 

    anunciosTodos: any[] = []; // Lista completa de anuncios obtenidos del servidor
    filteredAnuncios: any[] = []; // Lista de anuncios filtrados dinámicamente
    residentesTodos: any[] = []; // Lista de residentes para el dropdown del modal
  
    // Filtros
    selectedYear: string | null = null;
    selectedMonth: string | null = null;
    selectedDay: string | null = null;
    search2: string = ''; // Término de búsqueda
  
    // Dropdown data
    years: string[] = [];
    months: string[] = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    days: string[] = [];

    // Obtener todos los anuncios
    getAnunciosTodos(): void {
      const url = 'http://localhost:8080/anuncios/todos';
      this.http.get<any[]>(url).subscribe(
        (data) => {
          this.anunciosTodos = data.map((anuncio) => ({
            idMensaje: anuncio.idMensaje,
            titulo: anuncio.titulo || 'Sin Título',
            descripcion: anuncio.contenidoDelMensaje || 'Sin Contenido',
            fechaHora: anuncio.fechaMensaje,
            esAudio: anuncio.esAudio,
            contenidoDelMensaje: anuncio.contenidoDelMensaje,
            residente: anuncio.residente
              ? `${anuncio.residente.nombre} ${anuncio.residente.apellido} (${anuncio.residente.comercio})`
              : 'No asociado a un residente',
            comercio: anuncio.residente?.comercio || 'Sin Comercio',
          }));
          this.filteredAnuncios = [...this.anunciosTodos]; // Inicializar con todos los anuncios
        },
        (error) => {
          console.error('Error al obtener todos los anuncios:', error);
        }
      );
    }
  
    // Generar opciones de años
    generateYearOptions(): void {
      const currentYear = new Date().getFullYear();
      for (let year = currentYear; year >= currentYear - 20; year--) {
        this.years.push(year.toString());
      }
    }
  
    // Generar opciones de días
    generateDaysOptions(): void {
      if (this.selectedYear && this.selectedMonth) {
        const monthIndex = this.months.indexOf(this.selectedMonth); // Índice del mes (0 basado)
        const daysInMonth = new Date(
          parseInt(this.selectedYear),
          monthIndex + 1,
          0
        ).getDate();
        this.days = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
      } else {
        this.days = [];
      }
      this.filterAnuncios(); // Recalcular el filtro cuando los días cambien
    }
  
    // Método para filtrar los anuncios dinámicamente
    filterAnuncios(): void {
      const searchTerm = this.search2.toLowerCase();
  
      this.filteredAnuncios = this.anunciosTodos.filter((anuncio) => {
        const fecha = new Date(anuncio.fechaHora);
        const matchesYear =
          this.selectedYear ? fecha.getFullYear().toString() === this.selectedYear : true;
        const matchesMonth =
          this.selectedMonth
            ? fecha.toLocaleString('default', { month: 'long' }).toLowerCase() ===
              this.selectedMonth.toLowerCase()
            : true;
        const matchesDay =
          this.selectedDay ? fecha.getDate().toString() === this.selectedDay : true;
        const matchesSearch =
          this.search2.length > 0
            ? (
                anuncio.titulo +
                ' ' +
                anuncio.descripcion +
                ' ' +
                anuncio.residente
              )
                .toLowerCase()
                .includes(searchTerm)
            : true;
  
        return matchesYear && matchesMonth && matchesDay && matchesSearch;
      });
    }
    

    
  }
  
  
