import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  residentes: any[] = [];
  mapWidth = 352; // Ancho real de la imagen del mapa
  mapHeight = 443; // Alto real de la imagen del mapa

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadResidentes();
  }

  loadResidentes() {
    const url = 'http://localhost:8080/residentes/obtenerResidenteDomicilio';
    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.residentes = data.filter(
          (residente) => residente.domicilio && residente.domicilio.coordenadas
        );
      },
      (error) => {
        console.error('Error al cargar los residentes:', error);
      }
    );
  }

  getPinStyle(coordenadas: string) {
    if (!coordenadas) return {};
    const [x, y] = coordenadas.split(',').map(Number);

    return {
      left: `${(x / this.mapWidth) * 100}%`,
      top: `${(y / this.mapHeight) * 100}%`
    };
  }
}
