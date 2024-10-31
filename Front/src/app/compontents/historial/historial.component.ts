import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss'
})
export class HistorialComponent {
  data = [
    {
      fechaPeticion: '2024-10-20',
      montoPedido: 5000,
      aprobado: true,
      detalles: [
        { concepto: 'Producto A', cantidad: 2, precio: 2500 },
        { concepto: 'Producto B', cantidad: 1, precio: 2500 }
      ]
    },
    {
      fechaPeticion: '2024-10-21',
      montoPedido: 7500,
      aprobado: false,
      detalles: [
        { concepto: 'Producto C', cantidad: 3, precio: 2500 }
      ]
    },
    // Agrega más datos según sea necesario
  ];

  mostrarDetalles(detalles: any[]) {
    const detallesHtml = `
      <table class="table">
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Cantidad</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          ${detalles
            .map(
              (detalle) => `
            <tr>
              <td>${detalle.concepto}</td>
              <td>${detalle.cantidad}</td>
              <td>$${detalle.precio.toFixed(2)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;

    Swal.fire({
      title: 'Detalles de la petición',
      html: detallesHtml,
      confirmButtonText: 'Cerrar',
      width: '600px'
    });
  }
}
