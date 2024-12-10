import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  residentes: any[] = [];
  mapWidth = 352;  // Ancho real de la imagen del mapa
  mapHeight = 443;  // Alto real de la imagen del mapa
  urlServer = "http://192.1.1.253:8080";

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadResidentes();
  }

  // Cargar residentes con domicilios y coordenadas
  loadResidentes(): void {
    const url = `${this.urlServer}/residentes/obtenerResidenteDomicilio`;
    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.residentes = data.filter(
          (residente) => residente.domicilio && residente.domicilio.coordenadas
        );
        
        if (this.residentes.length > 0) {
          this.toastr.success(
            'Residentes cargados correctamente en el mapa.',
            'Éxito'
          );
        } else {
          this.toastr.warning(
            'No se encontraron residentes con domicilios registrados.',
            'Advertencia'
          );
        }
      },
      (error) => {
        console.error('Error al cargar los residentes:', error);
        this.toastr.error(
          'Error al cargar residentes. Intente nuevamente.',
          'Error'
        );
      }
    );
  }

  // Estilos dinámicos para pines en el mapa
  getPinStyle(coordenadas: string): { left: string; top: string } | {} {
    if (!coordenadas) {
      this.toastr.warning(
        'Algunos residentes no tienen coordenadas registradas.',
        'Advertencia'
      );
      return {};
    }

    const [x, y] = coordenadas.split(',').map(Number);

    // Validación de coordenadas fuera de rango
    if (x < 0 || y < 0 || x > this.mapWidth || y > this.mapHeight) {
      this.toastr.error(
        `Coordenadas fuera de rango: (${x}, ${y})`,
        'Error'
      );
      return {};
    }

    return {
      left: `${(x / this.mapWidth) * 100}%`,
      top: `${(y / this.mapHeight) * 100}%`,
    };
  }
}
