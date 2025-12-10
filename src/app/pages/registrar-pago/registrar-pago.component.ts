import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';   
import { ActivatedRoute, Router } from '@angular/router';
import { PagoService } from '../../services/pago.service';
import { Pago } from '../../interfaces/prestamo.interface';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-registrar-pago',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-pago.component.html',
  styleUrl: './registrar-pago.component.css'
})
export class RegistrarPagoComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pagoService = inject(PagoService);
  private notify = inject(NotificationService);

  pago: Pago | null = null;
  montoIngresado: number | null = null;
  loading: boolean = true;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.cargarPago(id);
      }
    });
  }

  cargarPago(id: number) {
    this.pagoService.getPago(id).subscribe({
      next: (data) => {
        this.pago = data;
        this.montoIngresado = data.montoProgramado; 
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.notify.error("Error al cargar la información del pago");
        this.cancelar();
      }
    });
  }

  // Este método se llama DESDE EL MODAL (Botón "Sí, Registrar")
  ejecutarPago() {
    if (!this.pago?.idPago || !this.montoIngresado) return;

    this.pagoService.registrarPago(this.pago.idPago, this.montoIngresado).subscribe({
      next: (res) => {
        this.notify.success("¡Pago registrado correctamente!");
        this.router.navigate(['/prestamo', this.pago?.idPrestamo]);
      },
      error: (err) => {
        console.error(err);
        const msg = err.error?.message || "Ocurrió un error al registrar el pago.";
        this.notify.error(msg);
      }
    });
  }

  cancelar() {
    if (this.pago?.idPrestamo) {
      this.router.navigate(['/prestamo', this.pago.idPrestamo]);
    } else {
      this.router.navigate(['/prestamos']);
    }
  }
}