import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { Cliente, Prestamo } from '../../interfaces/prestamo.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {
private clienteService = inject(ClienteService);

  
  listaClientes: Cliente[] = [];

  filtros = {
    nombre: '',
    telefono: '',
    direccion: ''
  };

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.listaClientes = data;
      },
      error: (err) => console.error('Error cargando clientes:', err)
    });
  }

  buscar() {
    // Creamos un objeto limpio solo con los filtros que tengan texto
    const parametros: any = {};
    
    if (this.filtros.nombre) parametros.nombre = this.filtros.nombre;
    if (this.filtros.telefono) parametros.telefono = this.filtros.telefono;
    if (this.filtros.direccion) parametros.direccion = this.filtros.direccion;

    this.clienteService.buscarClientes(parametros).subscribe({
      next: (data) => {
        this.listaClientes = data; // Actualizamos la tabla con los resultados
      },
      error: (err) => console.error("Error en búsqueda:", err)
    });
  }
  
  // Opcional: Para limpiar filtros
  limpiarFiltros() {
    this.filtros = { nombre: '', telefono: '', direccion: '' };
    this.cargarClientes();
  }

}
