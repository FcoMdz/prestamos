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

  resultados: Array<any> = [];
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

  mostrarDetalles(detalles: Solicitud) {

    this.resultados = [];
    const monto = detalles.monto;
    const porcentaje = detalles.interes/100;
    const mes = detalles.meses
    let intereses = monto*porcentaje;
    let subtotal = monto + intereses;
    const pagoMes = subtotal / mes; 
    const subtotalMes = monto/mes;
    const interesMes = pagoMes - subtotalMes;
    var saldo = subtotal;
      for(let i=0; i<mes;i++){
        var saldo = saldo-pagoMes;
        var calculo = { cuota: pagoMes, interes: interesMes, capital:subtotalMes, saldo: saldo};
        this.resultados.push(calculo);
      }
    Swal.fire({
      title: `Detalles de la petición`,
      html: this.modalAmortizacion(),
      customClass: {
        popup: 'fullscreen-swal-popup', // Clase para ajustar el tamaño máximo del modal
        htmlContainer: 'scrollable-swal-html' // Clase para el contenedor desplazable de la tabla
      },
      confirmButtonText: 'Cerrar'
    });
  }


  modalAmortizacion(){
    return `
    <style>
    .fullscreen-swal-popup {
      width: 70vw; /* Ocupa el ancho completo de la pantalla */
      max-width: 90vw !important;
      height: 90vh; /* Ocupa la altura completa de la pantalla */
      max-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Contenedor de HTML que hace que el contenido de la tabla sea desplazable */
    .scrollable-swal-html {
      flex-grow: 1; }
      overflow-y: auto;}
    }

    /* Contenedor de la tabla con desplazamiento */
    .table-container {
      max-height: 80vh; /* Controla la altura del contenedor de la tabla */
      overflow-y: auto; /* Habilita el desplazamiento en la tabla */
      width: 100%; /* Asegura que la tabla ocupe el ancho completo */
    }

    </style>
      <div class="table-container">
        <table table class="table table-bordered">
            <thead>
              <tr>
                <th style="width: 10%;">Mes de Cuota</th>
                <th>Cuota</th>
                <th>Interes</th>
                <th>Capital</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              ${this.resultados.map((resultado, index) => `
                <tr>
                  <td style="width: 10%;">${index + 1}</td>
                  <td>${resultado.cuota.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                  <td>${resultado.interes.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                  <td>${resultado.capital.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                  <td>${resultado.saldo.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                </tr>`).join('')}
            </tbody>
          </table>      
        </div>`;
  }
}
