import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrestamoService } from '../../services/prestamo.service'; // Ajusta la ruta si es necesario
import { Prestamo } from '../../interfaces/prestamo.interface';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './prestamos.component.html',
  styleUrl: './prestamos.component.css',
})
export class PrestamosComponent implements OnInit {
  private prestamoService = inject(PrestamoService);
  private authService = inject(AuthService); // Para el botón salir

  listaPrestamos: Prestamo[] = [];

  filtros = {
    cliente: '',
    monto: null,
    lapzo: 'Todos', // Valor por defecto del select
    cuotas: null,
    estado: 'Todos',
  };

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.prestamoService.getPrestamos().subscribe({
      next: (data) => {
        this.listaPrestamos = data;
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }

  buscar() {
    const parametros: any = {};

    if (this.filtros.cliente) parametros.cliente = this.filtros.cliente;
    if (this.filtros.monto) parametros.monto = this.filtros.monto;
    if (this.filtros.lapzo && this.filtros.lapzo !== 'Todos')
      parametros.lapzo = this.filtros.lapzo;
    if (this.filtros.cuotas) parametros.cuotas = this.filtros.cuotas;
    if (this.filtros.estado && this.filtros.estado !== 'Todos') {
      parametros.estado = this.filtros.estado;
    }

    console.log('🔍 Enviando filtros:', parametros);

    this.prestamoService.buscarPrestamos(parametros).subscribe({
      next: (data) => {
        this.listaPrestamos = data;
      },
      error: (err) => console.error('Error en búsqueda:', err),
    });
  }

  limpiarFiltros() {
    this.filtros = {
      cliente: '',
      monto: null,
      lapzo: 'Todos',
      cuotas: null,
      estado: 'Todos',
    };
    this.cargarDatos(); // Vuelve a cargar los últimos 5 o la lista inicial
  }

  salir() {
    this.authService.logout();
  }
}
