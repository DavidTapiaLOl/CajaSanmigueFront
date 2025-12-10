import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Pago } from '../interfaces/prestamo.interface';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5054/api/Pago'; // Ajusta el puerto

  // Obtener un pago por ID
  getPago(id: number): Observable<Pago> {
    return this.http.get<Pago>(`${this.apiUrl}/${id}`);
  }

  // Registrar Pago (PATCH)
  registrarPago(id: number, monto: number): Observable<any> {
    const body = { montoPagado: monto };
    return this.http.patch(`${this.apiUrl}/${id}`, body, { responseType: 'text' as 'json' });
  }
}