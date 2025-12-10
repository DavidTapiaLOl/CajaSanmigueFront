import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../interfaces/auth.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importar FormsModule
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Objeto para el formulario
  loginData: LoginRequest = {
    correo: '',
    password: ''
  };

  errorMessage: string = '';

  onLogin() {
    this.authService.login(this.loginData).subscribe({
      
      next: (res) => {
        // Si el login es exitoso, nos vamos a la pagina de prestamos
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Correo o contraseña incorrectos';
      }
    });
  }
}