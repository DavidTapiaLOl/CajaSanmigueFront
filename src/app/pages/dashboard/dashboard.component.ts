import { Prestamo } from './../../interfaces/prestamo.interface';
import { Component, inject,PLATFORM_ID} from '@angular/core';
import { PrestamoService } from '../../services/prestamo.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PipeDate } from '../../pipes/pipeDate.pipe';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/cliente.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,PipeDate,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private prestamoService = inject(PrestamoService);
  private authService = inject(AuthService); // Para el botón salir
  private clienteService = inject(ClienteService);
  
  listaPrestamos: Prestamo[] = [];
  listaClientes: Cliente[] = [];

prestamosActivos: number = 0;
  montoPendiente: number = 0;
  gananciasEsperadas: number = 0;
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {

    this.cargarDatos();
    if (isPlatformBrowser(this.platformId)) {
      this.calcularMetricas();
    }
  }

  

cargarDatos() {
  this.prestamoService.getPrestamos().subscribe({
    next: (data) => {
      // Ose ordena por id desenciente
      const ordenados = data.sort((a, b) => (b.idPrestamo || 0) - (a.idPrestamo || 0));
      
      // solo muestra los ultimos 20
      this.listaPrestamos = ordenados.slice(0, 20);
    },
    error: (err) => console.error(err)
  });

  this.clienteService.getClientes().subscribe({
      next: (data) => {
        // Ordenar por ID descendente para ver los nuevos primero (opcional)
        // Y tomar solo los últimos 5
        this.listaClientes = data.sort((a, b) => (b.idCliente || 0) - (a.idCliente || 0)).slice(0, 10);
      },
      error: (err) => console.error(err)
    });
}

calcularMetricas() {
    this.prestamoService.getPrestamos().subscribe({
      next: (listaPrestamos: Prestamo[]) => {
        
        // 1. ACTIVOS
        this.prestamosActivos = listaPrestamos.filter(p => 
          p.estado === 'Activo' || p.estado === 'Atrasado' || p.estado === 'Retrasado'
        ).length;

        // 2. GANANCIAS
        this.gananciasEsperadas = listaPrestamos.reduce((acumulado, p) => {
          const total = Number(p.totalAPagar) || 0;
          const prestado = Number(p.monto) || 0;
          if (p.estado === 'Cancelado') return acumulado;
          return acumulado + (total - prestado);
        }, 0);

        // 3. PENDIENTE
        this.montoPendiente = listaPrestamos.reduce((totalGeneral, p) => {
          if (!p.pagos) return totalGeneral;
          const deuda = p.pagos
            .filter(pago => pago.estado !== 'Pagado')
            .reduce((sum, pago) => sum + (Number(pago.montoProgramado) || 0), 0);
          return totalGeneral + deuda;
        }, 0);
        
        console.log("Calculos terminados. Activos:", this.prestamosActivos);
      },
      error: (err) => console.error('Error en el navegador:', err)
    });
  }

  salir() {
    this.authService.logout();
  }
}
