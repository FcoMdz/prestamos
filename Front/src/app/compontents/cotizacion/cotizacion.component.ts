import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PrestamosServiceService } from '../../services/prestamos-service.service';

@Component({
  selector: 'app-cotizacion',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './cotizacion.component.html',
  styleUrl: './cotizacion.component.scss'
})
export class CotizacionComponent {
  calculoForm: FormGroup;
  resultados: Array<any> = [];
  mostrarResultados: boolean = false;
  empleado:any;
  constructor(private fb: FormBuilder,
    private prestamosService:PrestamosServiceService,
  ) {
    this.calculoForm = this.fb.group({
      monto: ['', Validators.required],
      meses: ['', Validators.required],
      interes: ['', Validators.required]
    });
  }

  // Método para procesar el formulario y realizar cálculos
  onSubmit() {
    this.resultados = [];
    let intereses = 0; 
    let subtotal = 0;
    
    if (this.calculoForm.valid) {
      const monto = this.calculoForm.value["monto"];
      const porcentaje = this.calculoForm.value["interes"]/100;
      const mes = this.calculoForm.value["meses"]
      intereses = monto*porcentaje;
      subtotal = monto + intereses;
      const pagoMes = subtotal / mes; 
      const subtotalMes = monto/mes;
      const interesMes = pagoMes - subtotalMes;
      console.log("cuota", pagoMes)
      console.log("interes", subtotalMes)
      console.log("capital", interesMes)
      let solicitud = {
        monto:monto,
        meses:mes,
        interes:porcentaje,
        aprobado:false,
        usuario_cliente:0,
        contrasena:0,
        usuario_empleado:0
      }
      //this.prestamosService.sendSolicitud(solicitud)
      // Realizar cálculos aquí y almacenarlos en la tabla de resultados
      var saldo = subtotal;
      for(let i=0; i<mes;i++){
        var saldo = saldo-pagoMes;
        var calculo = { cuota: pagoMes, interes: interesMes, capital:subtotalMes, saldo: saldo};
        this.resultados.push(calculo);
      }

      this.mostrarTablaResultados(); // Mostrar la tabla de resultados
    }
  }
  mostrarTablaResultados() {
    Swal.fire({
      title: 'Amortización',
      html: this.modalAmortizacion(),
      customClass: {
        popup: 'fullscreen-swal-popup', // Clase para ajustar el tamaño máximo del modal
        htmlContainer: 'scrollable-swal-html' // Clase para el contenedor desplazable de la tabla
      },
      showCloseButton: true,
      focusConfirm: false,
      allowOutsideClick:false,
      confirmButtonText: 'Guardar y Autorizar',
      showCancelButton: true,
      cancelButtonText: 'Guardar',
      preConfirm: () => this.autorizar(),  // Llama a la función al confirmar
      didClose: () => this.guardar() 
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

  autorizar(){

  }
  guardar(){

  }
}
