import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Residente {
    nombre: string;
    apellido: string;
    apodo: string;
    comercio: string;
    domicilio: {
        direccion: string;
        referencia: string;
        coordenadas: string;
    } | null;
}

@Injectable({
    providedIn: 'root',
})
export class ResidenteService {
    private apiUrl = 'http://localhost:8080/residentes/obtenerResidenteDomicilio';
    private newResidenteUrl = 'http://localhost:8080/residentes/crearResidente';

    constructor(private http: HttpClient) {}

    // Método para obtener los residentes
    getResidentes(): Observable<Residente[]> {
        return this.http.get<Residente[]>(this.apiUrl);
    }

    addResidente(residente: Residente): Observable<Residente> {
        return this.http.post<Residente>(this.newResidenteUrl, residente);
    }
}
