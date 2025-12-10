import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../interfaces/cliente.interface';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  // Inyección de dependencia moderna
  private http = inject(HttpClient);
  
  // URL + ENDPOINT DE CLIENTES
  // (Asegúrate que tu puerto sea el correcto, a veces es 5054 o 7001)
  private apiUrl = 'http://localhost:5054/api/Cliente'; 

  constructor() { }

  // 1. Obtener todos los clientes
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  // 2. Obtener un cliente por ID
  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  // 3. Crear un nuevo cliente
  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  // 4. Actualizar cliente (PATCH para cambios parciales o PUT si actualizas todo)
  // Usamos Partial<Cliente> para permitir enviar solo nombre o solo teléfono
  updateCliente(id: number, data: Partial<Cliente>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  // 5. Eliminar cliente
  deleteCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  buscarClientes(filtros: any): Observable<Cliente[]> {
  return this.http.get<Cliente[]>(`${this.apiUrl}/buscar`, { params: filtros });
}
}