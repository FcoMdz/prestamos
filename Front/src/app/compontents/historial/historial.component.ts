import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PrestamosServiceService, Solicitud } from '../../services/prestamos-service.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss'
})
export class HistorialComponent implements OnInit{
  data:Solicitud[] = [];
  loadingHistorial:boolean = false;
  constructor(private prestamosServices:PrestamosServiceService, private alertService:AlertService){}

  ngOnInit(): void {
    this.obtenerHistorial();
  }

  obtenerHistorial(){
    let usrInfo = JSON.parse(sessionStorage.getItem('usuario')!);
    if(usrInfo && Object.hasOwn(usrInfo, 'correo')){
      this.loadingHistorial = true;
      this.prestamosServices.getHistorial(usrInfo.correo, usrInfo.contrasena).then((res) => {
        if(res){
          console.log(res);
          if(res.success){
            this.data = res.data;
          }else{
            this.alertService.danger(res.message);
          }
        }else{
          this.alertService.error("Error de conexión")
        }
      }).finally(() => {
        this.loadingHistorial = false;
      });
    }

  }

  /*mostrarDetalles(detalles: any[]) {
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
  }*/
}
