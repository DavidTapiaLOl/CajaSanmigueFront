import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Para leer la URL
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { PrestamoService } from '../../services/prestamo.service';
import { Cliente } from '../../interfaces/cliente.interface';
import { Prestamo } from '../../interfaces/prestamo.interface';
import { PipeDate } from '../../pipes/pipeDate.pipe';

@Component({
  selector: 'app-perfil-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule,PipeDate,RouterLink],
  templateUrl: './perfil-cliente.component.html',
  styleUrl: './perfil-cliente.component.css',
})
export class PerfilClienteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private clienteService = inject(ClienteService);
  private prestamoService = inject(PrestamoService);
  private router = inject(Router);

  cliente: Cliente | null = null;
  loading: boolean = true;
  historial: Prestamo[] = [];

  clienteEdicion: Cliente = {
    idCliente: 0,
    nombre: '', apellidos: '', telefono: '', direccion: ''
  };

  // Objeto para el formulario del Modal
  nuevoPrestamo: any = {
    monto: 0,
    interes: 0.4, // 40% por defecto
    numeroCuotas: 12,
    lapzo: 'Semanal',
    montoMulta: 0.04, // 4% por defecto
    estado: 'Activo',
  };

  ngOnInit() {
    // 1. Obtener el ID de la URL
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.cargarDatosCliente(id);
        this.cargarHistorial(id);
      }
    });
  }

  cargarHistorial(id: number) {
    this.prestamoService.getPrestamosPorCliente(id).subscribe({
      next: (data) => {
        this.historial = data;
      },
      error: (err) => console.error('Error cargando historial', err),
    });
  }

  // --- LÓGICA DE EDICIÓN ---
  abrirModalEdicion() {
    if (this.cliente) {
      // Copiamos los datos para no editar el original directamente hasta guardar
      this.clienteEdicion = { ...this.cliente };
    }
  }

  guardarEdicion() {
    if (!this.clienteEdicion.idCliente) return;

    this.clienteService.updateCliente(this.clienteEdicion.idCliente, this.clienteEdicion).subscribe({
      next: (res) => {
        alert("Cliente actualizado correctamente");
        this.cliente = { ...this.clienteEdicion }; // Actualizamos la vista
      },
      error: (err) => {
        console.error(err);
        alert("Error al actualizar cliente");
      }
    });
  }

  // --- LÓGICA DE ELIMINACIÓN ---
  eliminarCliente() {
    if (!this.cliente || !this.cliente.idCliente) return;

    if (confirm(`¿Estás seguro de eliminar a ${this.cliente.nombre}? Esta acción no se puede deshacer.`)) {
      this.clienteService.deleteCliente(this.cliente.idCliente).subscribe({
        next: () => {
          alert("Cliente eliminado");
          this.router.navigate(['/clientes']);
        },
        error: (err) => {
          console.error(err);
          alert("No se pudo eliminar (verifica que no tenga préstamos activos)");
        }
      });
    }
  }

  cargarDatosCliente(id: number) {
    this.clienteService.getCliente(id).subscribe({
      next: (data) => {
        this.cliente = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  crearPrestamo() {
    if (!this.cliente || !this.cliente.idCliente) return;

    // 2. Armar el objeto final (DTO)
    const prestamoDTO = {
      idCliente: this.cliente.idCliente,
      monto: Number(this.nuevoPrestamo.monto),
      interes: Number(this.nuevoPrestamo.interes),
      numeroCuotas: Number(this.nuevoPrestamo.numeroCuotas),
      lapzo: this.nuevoPrestamo.lapzo,
      montoMulta: Number(this.nuevoPrestamo.montoMulta),
      estado: 'Activo',
    };

    // 3. Enviar al Backend
    this.prestamoService.createPrestamo(prestamoDTO as Prestamo).subscribe({
      next: (res) => {
        alert('¡Préstamo creado exitosamente!');
        // Cerrar modal (manualmente o recargar)
        // Redirigir a la lista de préstamos para verlo
        this.router.navigate(['/prestamos']);
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear el préstamo.');
      },
    });
  }
}
