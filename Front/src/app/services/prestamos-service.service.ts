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

  async getPaises():Promise<resultado<Pais[]> | undefined>{
    let data:resultado<Pais[]>|undefined = undefined;
    await this.httpClient.get(this.baseurl + 'get/pais').forEach((res) => {
      data = <resultado<Pais[]>> res;
    })
    return data;
  }

  async getEstados(idpais:number):Promise<resultado<Estado[]> | undefined>{
    let data:resultado<Estado[]>|undefined = undefined;
    await this.httpClient.get(this.baseurl + 'get/estados/' + idpais).forEach((res) => {
      data = <resultado<Estado[]>> res;
    })
    return data;
  }

  async getMunicipio(idestado:number):Promise<resultado<Municipio[]> | undefined>{
    let data:resultado<Municipio[]>|undefined = undefined;
    await this.httpClient.get(this.baseurl + 'get/municipios/' + idestado).forEach((res) => {
      data = <resultado<Municipio[]>> res;
    })
    return data;
  }

  async sendRegistro(registro:Registro):Promise<resultado<null> | undefined>{
    let data:resultado<null>|undefined = undefined;
    await this.httpClient.post(this.baseurl + 'post/usuario', registro).forEach((res) => {
      data = <resultado<null>> res;
    });
    return data;
  }

  async getHistorial(correo:string, contrasena:string):Promise<resultado<Solicitud[]>|undefined>{
    let data:resultado<Solicitud[]>|undefined = undefined;
    await this.httpClient.post(this.baseurl + 'post/solicitudes', {correo: correo, contrasena: contrasena}).forEach((res) => {
      data = <resultado<Solicitud[]>> res;
    });
    return data;
  }
  
  async sendSolicitud(soli:Solicitud):Promise<resultado<null>|undefined>{
    let monto = soli.monto;
    let usuarioEmpleado = soli.empleado_idempleado;
    let data:resultado<null>|undefined = undefined;
    await this.httpClient.post(this.baseurl + 'post/prestamo',{}).forEach((res) => {
      data = <resultado<null>> res;
    });
    return data;
  }
}

export interface Solicitud{
  idsolicitud:number
  monto:number
  meses:number
  interes:number
  fecha_solicitud:Date
  fecha_aprovado:Date
  aprobado:boolean
  empleado_idempleado:number
}

export interface Registro{
  usuario?:string
  password?:string
  nombre:string
  apellidomaterno:string
  apellidopaterno:string
  telefono:string
  correo:string
  contrasena:string
  calle:string
  cp:number
  noint:number
  noext:number
  colonia:string
  idmunicipio:number
}

export interface Pais{
  idpais:number
  nombre:string
}

export interface Estado{
  idestado:number
  nombre:string
  pais_idpais:number
}

export interface Municipio{
  idmunicipio:number
  nombre:string
  estado_idestado:number
}

interface Empleado{
  nombre:string
  usuario:string
  contrasena:string
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
