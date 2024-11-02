import { Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './compontents/general/navbar/navbar.component';
import { FooterComponent } from './compontents/general/footer/footer.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './compontents/login/login.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{
  title = 'prestamos';
  @Output() iniciarSesion = new EventEmitter<void>();

  constructor(@Inject(PLATFORM_ID) private platafomrId:any){}

  suscribeToEmmiter(componentRef:Component){
    if(componentRef instanceof LoginComponent){
      componentRef.loginEvent.subscribe((val) => {
        this.iniciarSesion.emit();
      });
    }

  }
}
