import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para pipes y ngIf
import { FormsModule } from '@angular/forms';   // Importante para ngModel
import { ActivatedRoute, Router } from '@angular/router';
import { PagoService } from '../../services/pago.service';
import { Pago } from '../../interfaces/prestamo.interface';

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
        // Pre-llenamos el monto con lo que se debe pagar
        this.montoIngresado = data.montoProgramado; 
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert("Error cargando el pago");
        this.cancelar();
      }
    });
  }

  guardarPago() {
    if (!this.pago?.idPago || !this.montoIngresado) return;

    if (confirm(`¿Confirmas recibir el pago de $${this.montoIngresado}?`)) {
      
      this.pagoService.registrarPago(this.pago.idPago, this.montoIngresado).subscribe({
        next: (res) => {
          alert("¡Pago registrado con éxito!");
          // Redirigir de vuelta al detalle del préstamo
          this.router.navigate(['/prestamo', this.pago?.idPrestamo]);
        },
        error: (err) => {
          console.error(err);
          // Si el backend devuelve mensaje de error (ej: monto incompleto)
          const msg = err.error?.message || "Ocurrió un error al registrar el pago.";
          alert(msg);
        }
      });

    }
  }

  cancelar() {
    // Si tenemos el ID del préstamo, volvemos ahí. Si no, a préstamos general.
    if (this.pago?.idPrestamo) {
      this.router.navigate(['/prestamo', this.pago.idPrestamo]);
    } else {
      this.router.navigate(['/prestamos']);
    }
  }
}