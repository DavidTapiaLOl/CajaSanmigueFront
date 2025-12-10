import { CrearClienteComponent } from './pages/crear-cliente/crear-cliente.component';
import { Routes } from '@angular/router';
import { PrestamosComponent } from './pages/prestamos/prestamos.component';
import { LoginComponent } from './autorizacion/login/login.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { CrearPrestamoComponent } from './pages/crear-prestamo/crear-prestamo.component';
import { PerfilClienteComponent } from './pages/perfil-cliente/perfil-cliente.component';
import { PerfilPrestamoComponent } from './pages/perfil-prestamo/perfil-prestamo.component';
import { RegistrarPagoComponent } from './pages/registrar-pago/registrar-pago.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'prestamos',
    component: PrestamosComponent,
    canActivate: [authGuard],
  },
  {
    path: 'clientes',
    component: ClientesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'crear-prestamo',
    component: CrearPrestamoComponent,
    canActivate: [authGuard],
  },
  {
    path: 'Nuevocliente',
    component: CrearClienteComponent,
    canActivate: [authGuard],
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'cliente/:id',
    component: PerfilClienteComponent,
    canActivate: [authGuard],
  },
  {
    path: 'prestamo/:id',
    component: PerfilPrestamoComponent,
    canActivate: [authGuard],
  },
  {
    path: 'pagos/registrar/:id',
    component: RegistrarPagoComponent,
    canActivate: [authGuard],
  },
];
