import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResidenteService {

  private urlServer = 'http://192.1.1.253:8080/residentes'; // Cambia esta URL según tu servidor

  constructor(private http: HttpClient) {}

  // Método para obtener la lista de residentes
  getResidentes(): Observable<any> {
    return this.http.get(`${this.urlServer}/obtenerTodosResidentes`);
  }

  // Método para crear un residente
  addResidente(residente: any): Observable<any> {
    return this.http.post(`${this.urlServer}/crearResidente`, residente);
  }
  
  deleteResidente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlServer}/${id}`);
  }

  actualizarResidente(idResidente: number, residente: any): Observable<any> {
    const url = `${this.urlServer}/${idResidente}`;
    return this.http.put<any>(url, residente);
  }
  

}
