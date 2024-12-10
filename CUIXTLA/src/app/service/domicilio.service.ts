import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Permite que Angular lo registre automáticamente
})
export class DomicilioService {
  private urlServer = 'http://192.1.1.253:8080';

  constructor(private http: HttpClient) {}

  // Obtener residentes con domicilio nulo
  getResidentes(): Observable<any> {
    return this.http.get(`${this.urlServer}/residentes/obtenerTodosResidentes`);
  }

  // Crear un domicilio
  crearDomicilio(domicilio: any): Observable<any> {
    return this.http.post(`${this.urlServer}/domicilios/crearDomicilio`, domicilio);
  }

  // Asociar domicilio a residente
  asociarDomicilio(idResidente: number, idDomicilio: number): Observable<any> {
    return this.http.put(
      `${this.urlServer}/residentes/${idResidente}/domicilio/${idDomicilio}`,
      {}
    );
  }
}
