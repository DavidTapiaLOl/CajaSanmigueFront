import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo } from '../interfaces/prestamo.interface';

@Injectable({
  providedIn: 'root',
})
export class PrestamoService {
  // Inyección de dependencia moderna
  private http = inject(HttpClient);

  // URL + EL EDNPOINT
  private apiUrl = 'http://localhost:5054/api/Prestamo';

  constructor() {}

  // 1. Obtener todos
  getPrestamos(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.apiUrl);
  }

  // 2. Obtener uno por ID
  getPrestamo(id: number): Observable<Prestamo> {
    return this.http.get<Prestamo>(`${this.apiUrl}/${id}`);
  }

  // 3. Crear
  createPrestamo(prestamo: Prestamo): Observable<Prestamo> {
    return this.http.post<Prestamo>(this.apiUrl, prestamo);
  }

  // 4. Actualizar (PATCH)
  updatePrestamo(id: number, data: Partial<Prestamo>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }
  getPrestamosPorCliente(idCliente: number): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.apiUrl}/cliente/${idCliente}`);
  }

  // ... imports

  // 6. Eliminar Préstamo
  deletePrestamo(id: number): Observable<any> {
    // Usamos responseType: 'text' por si el backend devuelve mensaje plano
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text' as 'json',
    });
  }
  buscarPrestamos(filtros: any): Observable<Prestamo[]> {
    // Angular se encarga de convertir el objeto { cliente: 'Juan' } a ?cliente=Juan
    return this.http.get<Prestamo[]>(`${this.apiUrl}/buscar`, {
      params: filtros,
    });
  }
}
