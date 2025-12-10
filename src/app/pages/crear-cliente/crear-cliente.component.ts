import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importante para [(ngModel)]
import { Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/cliente.interface';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-crear-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule], // Agregar FormsModule
  templateUrl: './crear-cliente.component.html',
  styleUrl: './crear-cliente.component.css'
})
export class CrearClienteComponent {
  
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private notify = inject(NotificationService);
  // Inicializamos el objeto vacío
  cliente: Cliente = {
    idCliente: 0,
    nombre: '',
    apellidos: '',
    telefono: '',
    direccion: ''
  };

  guardar() {
    // Validamos campos básicos (opcional, el HTML ya tiene 'required')
    if (!this.cliente.nombre || !this.cliente.telefono) {
      this.notify.error("Por favor completa los campos obligatorios");
      return;
    }

    this.clienteService.createCliente(this.cliente).subscribe({
      
      next: (res) => {
        console.log('Cliente creado:', res);
        this.notify.success("¡Cliente registrado exitosamente!");
        this.router.navigate(['/clientes']);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        this.notify.error("Ocurrió un error al guardar el cliente.");
      }
    });
  }

  cancelar() {
    this.router.navigate(['/clientes']);
  }
}