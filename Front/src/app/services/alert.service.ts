import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  private alert = Swal.mixin({
    toast: true,
    timer: 5000,
    position: 'top',
    showConfirmButton: false,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });


  public success(mensaje:string){
    this.alert.fire({
      icon: 'success',
      title: mensaje,
    });
  }

  public error(mensaje:string){
    this.alert.fire({
      icon: 'error',
      title: mensaje
    });
  }

  public danger(mensaje:string){
    this.alert.fire({
      icon: 'warning',
      title: mensaje
    });
  }

  public modal(titulo:string, mensaje:string){
    Swal.fire(titulo, mensaje, 'info');
  }
}
