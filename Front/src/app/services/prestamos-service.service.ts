import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrestamosServiceService {
  private baseurl = "http://localhost:3002/api/";
  constructor(private httpClient:HttpClient) { }

  async loginEmpleado(usuario:string, contrasena:string){
    let data;
    await this.httpClient.post(this.baseurl+"post/login/empleado", {usuario:usuario, contrasena:contrasena}).forEach((res) =>{
      data = res;
    })
    return data;
  }
}
