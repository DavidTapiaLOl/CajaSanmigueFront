import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importante para [(ngModel)]
import { Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/cliente.interface';

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
      alert("Por favor completa los campos obligatorios");
      return;
    }

    this.clienteService.createCliente(this.cliente).subscribe({
      
      next: (res) => {
        console.log('Cliente creado:', res);
        // Redirigir a la tabla de clientes
        this.router.navigate(['/clientes']);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert("Ocurrió un error al guardar el cliente.");
      }
    });
  }

  cancelar() {
    this.router.navigate(['/clientes']);
  }
}