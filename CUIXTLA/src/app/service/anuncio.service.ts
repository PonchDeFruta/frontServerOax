import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnuncioService {
  
  private urlServer = "http://192.1.1.253:8080"; // Cambiar según tu configuración

  constructor(private http: HttpClient) {}

  // Obtener todos los residentes
  getResidentes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlServer}/residentes/obtenerTodosResidentes`);
  }

  // Crear un nuevo anuncio
  crearAnuncio(payload: any): Observable<any> {
    return this.http.post(`${this.urlServer}/anuncios/crearAnuncio`, payload);
  }
}
