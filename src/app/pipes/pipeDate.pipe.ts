import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'PipeDate',
  standalone: true
})
export class PipeDate implements PipeTransform {
transform(value: string | Date | undefined): string {
  if (!value) return ''; // <-- aquí ya manejas undefined

  const fecha = new Date(value);

  if (isNaN(fecha.getTime())) return value.toString();

  const anio = fecha.getFullYear();
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const dia = fecha.getDate().toString().padStart(2, '0');

  const hora = fecha.getHours().toString().padStart(2, '0');
  const min = fecha.getMinutes().toString().padStart(2, '0');

  return `${anio}-${mes}-${dia} ${hora}:${min}`;
}
}
