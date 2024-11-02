import { CommonModule } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PrestamosServiceService, Cliente } from '../../services/prestamos-service.service';
import { AlertService } from '../../services/alert.service';
import { isPlatformBrowser } from '@angular/common';

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
  clientes: Cliente[] = [];
  mostrarResultados: boolean = false;
  loadingClientes: boolean = false;
  loadingSolicitud:boolean = false;
  solicitudId:number|undefined = undefined
  empleado:any;
  constructor(private fb: FormBuilder,
    private prestamosService:PrestamosServiceService,
    private alertService:AlertService,
    @Inject(PLATFORM_ID) private plataformid:any
  ) {
    this.calculoForm = this.fb.group({
      monto: ['', Validators.required],
      meses: ['', Validators.required],
      interes: ['', Validators.required],
      cliente: ['', Validators.required]
    });
    this.getClientes();
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




  getClientes(){
    if(isPlatformBrowser(this.plataformid)){
      let usrInfo = JSON.parse(sessionStorage.getItem('usuario')!);
      if(usrInfo && Object.hasOwn(usrInfo, 'usuario')){
        this.loadingClientes = true;
        this.prestamosService.getClientes(usrInfo.usuario, usrInfo.contrasena).then((res) => {
          if(res){
            if(res.success){
              this.clientes = res.data;
            }else{
              this.alertService.danger(res.message);
            }
          }else{
            this.alertService.error("Error de conexión")
          }
        }).finally(() => {
          this.loadingClientes = false;
        });
      }
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
      showDenyButton: true,
      denyButtonText: 'Guardar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => this.autorizar(),  // Llama a la función al confirmar
      preDeny: () => this.guardar()
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

  async autorizar(){
    if(!this.loadingSolicitud){
      await this.guardar();
      this.alertService.danger("Guardando y autorizando prestamo")
      let usrInfo = JSON.parse(sessionStorage.getItem('usuario')!);
      if(usrInfo && Object.hasOwn(usrInfo, 'usuario')){
        this.loadingSolicitud = true;
        let solicitud = {
          usuario_empleado: usrInfo.usuario,
          contrasena:usrInfo.contrasena,
          id_solicitud: this.solicitudId ?? null
        }
        this.prestamosService.aproveSolicitud(solicitud).then((res) => {
          if(res){
            if(res.success){
              this.alertService.success(res.message);
            }else{
              this.alertService.danger(res.message);
            }
          }else{
            this.alertService.error("Error de conexión")
          }
        }).finally(() => {
          this.loadingSolicitud = false;
          this.solicitudId = undefined;
        });
      }
    }

  }

  async guardar(){
    if(!this.loadingSolicitud){
      this.alertService.danger("Guardando prestamo sin autorizar...")
      const monto = this.calculoForm.value["monto"];
      const porcentaje = this.calculoForm.value["interes"];
      const mes = this.calculoForm.value["meses"]
      let usrInfo = JSON.parse(sessionStorage.getItem('usuario')!);
          if(usrInfo && Object.hasOwn(usrInfo, 'usuario')){
            this.loadingSolicitud = true;
            let solicitud = {
              monto:monto,
              meses:mes,
              interes:porcentaje,
              usuario_cliente:this.calculoForm.value["cliente"],
              contrasena:usrInfo.contrasena,
              usuario_empleado:usrInfo.usuario
            }
            await this.prestamosService.sendSolicitud(solicitud).then((res) => {
              if(res){
                if(res.success){
                  this.alertService.success(res.message + " no. " + res.data);
                  this.solicitudId = res.data;
                }else{
                  this.alertService.danger(res.message);
                }
              }else{
                this.alertService.error("Error de conexión")
              }
            }).finally(() => {
              this.loadingSolicitud = false;
            });

        }
    }

  }
}
