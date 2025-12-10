import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Ajusta la ruta si es necesario
import { RouterLink, RouterLinkActive } from '@angular/router'; // Para la navegación

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive], // Importamos esto para usar routerLink en el HTML si queremos
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}