import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResidenteService {
  private apiUrl = '/api/residentes'; // Cambia esta URL según tu servidor

  constructor(private http: HttpClient) {}

  // Método para obtener la lista de residentes
  getResidentes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Método para crear un residente
  addResidente(residente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crearResidente`, residente);
  }
}
