import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { userInfo } from 'os';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet,RouterLink, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy{

  private eventSubscription!:Subscription;
  usrInfo:any;
  public usuarioEmpleado:string = "na"
  @Input() evento!:Observable<void>;

  constructor(private router:Router, @Inject(PLATFORM_ID) private plataformid:any){

  }

  ngOnInit(): void {
    if(isPlatformBrowser(this.plataformid)){
      this.obtenerSesion();
    }

    this.eventSubscription = this.evento.subscribe(() => {
      this.obtenerSesion();
    });
  }

  ngOnDestroy(): void {
      if(this.eventSubscription){
        this.eventSubscription.unsubscribe();
      }
  }

  async obtenerSesion(){
    this.usrInfo = JSON.parse(sessionStorage.getItem('usuario')!);
    console.log(this.usrInfo)
    if(this.usrInfo == undefined){
      this.usuarioEmpleado = "na";
      return;
    }
    if(Object.hasOwn(this.usrInfo,"correo")){
      this.usuarioEmpleado = "usuario";
      this.router.navigateByUrl('/historial');
      return;
    }
    if(Object.hasOwn(this.usrInfo,"usuario")){
      this.usuarioEmpleado = "empleado";
      this.router.navigateByUrl('/signup');
      return;
    }

  }

  gotoLogin(){
    this.router.navigateByUrl('/login');
  }

  logOut(){
    sessionStorage.removeItem('usuario');
    this.usuarioEmpleado = "na";
    this.router.navigateByUrl('/login');
  }
}
