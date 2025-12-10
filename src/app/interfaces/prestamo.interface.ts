export interface Cliente {
  idCliente: number;
  nombre: string;
  apellidos: string;
  telefono: string,
  direccion: string;
}

export interface Prestamo {
  idPrestamo?: number; 
  idCliente: number;
  monto: number;
  interes: number;
  numeroCuotas: number;
  lapzo: string;
  montoMulta: number;
  totalAPagar?: number;
  fechaInicio?: string; 
  estado?: string;
  cliente?: Cliente;
  pagos?: Pago[]; 
}

export interface Pago {
  idPago?: number;
  idPrestamo: number;
  numeroCuota: number;
  fechaProgramada: string;
  montoProgramado: number;
  fechaPagoReal?: string;
  montoPagado?: number;
  estado: string;
}

