import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PrestamoService } from '../../services/prestamo.service';
import { Prestamo, Pago } from '../../interfaces/prestamo.interface';
import { PipeDate } from '../../pipes/pipeDate.pipe';
import { NotificationService } from '../../services/notification.service'; // <--- 1. Importar

@Component({
  selector: 'app-perfil-prestamo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PipeDate],
  templateUrl: './perfil-prestamo.component.html',
  styleUrl: './perfil-prestamo.component.css'
})
export class PerfilPrestamoComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private prestamoService = inject(PrestamoService);
  private notify = inject(NotificationService); // <--- 2. Inyectar

  prestamo: Prestamo | null = null;
  loading: boolean = true;

  // Objeto para edición
  prestamoEdicion: any = {};

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.cargarPrestamo(id);
      }
    });
  }

  cargarPrestamo(id: number) {
    this.loading = true;
    this.prestamoService.getPrestamo(id).subscribe({
      next: (data) => {
        this.prestamo = data;
        
        // Ordenamos los pagos por número de cuota
        if (this.prestamo.pagos) {
          this.prestamo.pagos.sort((a, b) => a.numeroCuota - b.numeroCuota);
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.notify.error("Error al cargar el préstamo"); // <--- Notificación
        this.router.navigate(['/prestamos']);
      }
    });
  }

  // --- ACCIONES ---

  abrirModalEdicion() {
    if (this.prestamo) {
      // Clonamos para no editar directamente
      this.prestamoEdicion = { ...this.prestamo };
    }
  }

  guardarEdicion() {
    if (!this.prestamo?.idPrestamo) return;

    // Convertimos a números para evitar error de string
    const datosActualizados = {
      ...this.prestamoEdicion,
      monto: Number(this.prestamoEdicion.monto),
      interes: Number(this.prestamoEdicion.interes),
      numeroCuotas: Number(this.prestamoEdicion.numeroCuotas),
      montoMulta: Number(this.prestamoEdicion.montoMulta),
      //Estado: String(this.prestamoEdicion.Estadi)
    };

    this.prestamoService.updatePrestamo(this.prestamo.idPrestamo, datosActualizados).subscribe({
      next: (res) => {
        this.notify.success("Préstamo actualizado correctamente"); // <--- Notificación
        if (this.prestamo?.idPrestamo) {
            this.cargarPrestamo(this.prestamo.idPrestamo); // Recargar datos
        }
      },
      error: (err) => {
        console.error(err);
        this.notify.error("Error al actualizar: " + (err.error?.message || err.message)); // <--- Notificación
      }
    });
  }

  eliminarPrestamo() {
    if (!this.prestamo?.idPrestamo) return;

    if (confirm(`¿Seguro que deseas eliminar el Préstamo #${this.prestamo.idPrestamo}?`)) {
      this.prestamoService.deletePrestamo(this.prestamo.idPrestamo).subscribe({
        next: () => {
          this.notify.success("Préstamo eliminado correctamente"); // <--- Notificación
          this.router.navigate(['/prestamos']);
        },
        error: (err) => {
          console.error(err);
          // Mensaje amigable si el backend rechaza por estar activo
          if (err.status === 400) {
            this.notify.error("No se puede eliminar: El préstamo está Activo o tiene pagos registrados."); // <--- Notificación
          } else {
            this.notify.error("Ocurrió un error al eliminar."); // <--- Notificación
          }
        }
      });
    }
  }

  registrarPago(pago: Pago) {
    // Aquí puedes redirigir a una pantalla de pago o abrir un modal
    console.log("Pagar cuota", pago.numeroCuota);
    // Ejemplo: this.router.navigate(['/pagos/registrar', pago.idPago]);
  }
}