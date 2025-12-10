import { Injectable } from '@angular/core';
import { Notyf } from 'notyf';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  // Instanciamos Notyf con configuración global
  private notyf = new Notyf({
    duration: 4000,       // Duración en milisegundos
    position: {
      x: 'right',         // 'left' | 'center' | 'right'
      y: 'top',           // 'top' | 'center' | 'bottom'
    },
    ripple: true,         // Efecto de onda al hacer click
    dismissible: true,    // Permitir cerrar manualmente
    types: [
      {
        type: 'success',
        background: '#28a745', // Verde éxito (puedes usar tus colores de bootstrap)
        icon: {
          className: 'bi bi-check-circle-fill', // Usamos iconos de Bootstrap si quieres
          tagName: 'i',
          color: 'white'
        }
      },
      {
        type: 'error',
        background: '#dc3545', // Rojo error
        icon: {
          className: 'bi bi-x-circle-fill',
          tagName: 'i',
          color: 'white'
        }
      }
    ]
  });

  constructor() { }

  success(mensaje: string) {
    this.notyf.success(mensaje);
  }

  error(mensaje: string) {
    this.notyf.error(mensaje);
  }
  
  // Puedes crear métodos personalizados extra si lo deseas
  warning(mensaje: string) {
    this.notyf.open({
      type: 'warning', // Tendrías que definir este tipo arriba si quieres color específico
      message: mensaje,
      background: '#ffc107',
      icon: {
        className: 'bi bi-exclamation-triangle-fill',
        tagName: 'i',
        color: 'white'
      }
    });
  }
}