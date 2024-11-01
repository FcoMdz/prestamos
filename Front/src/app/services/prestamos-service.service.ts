import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class PrestamosServiceService {
  private baseurl = "http://localhost:3002/api/";
  constructor(private httpClient:HttpClient) { }

  async loginEmpleado(usuario:string, contrasena:string):Promise<resultado<Empleado> | undefined>{
    let data:resultado<Empleado>|undefined = undefined;
    await this.httpClient.post(this.baseurl+"post/login/empleado", {usuario:usuario, contrasena:contrasena}).forEach((res) =>{
      data = <resultado<Empleado>> res;
    })
    return data;
  }

  async loginCliente(usuario:string, contrasena:string):Promise<resultado<Cliente> | undefined>{
    let data:resultado<Cliente>|undefined = undefined;
    await this.httpClient.post(this.baseurl+"post/login/usuario", {correo:usuario, contrasena:contrasena}).forEach((res) =>{
      data = <resultado<Cliente>> res;
    })
    return data;
  }
}

interface Empleado{
  nombre:string
  usuario:string
  contrsena:string
}

interface Cliente{
  nombre:string
  apellido_materno:string
  apellido_paterno:string
  contrasena:string
  telefono:string
  correo:string
}

interface resultado<T>{
  success:boolean
  message:string
  data:T
}
