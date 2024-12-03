import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Permite que Angular lo registre automáticamente
})
export class DomicilioService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // Obtener residentes con domicilio nulo
  getResidentes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/residentes/obtenerTodosResidentes`);
  }

  // Crear un domicilio
  crearDomicilio(domicilio: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/domicilios/crearDomicilio`, domicilio);
  }

  // Asociar domicilio a residente
  asociarDomicilio(idResidente: number, idDomicilio: number): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/residentes/${idResidente}/domicilio/${idDomicilio}`,
      {}
    );
  }
}
