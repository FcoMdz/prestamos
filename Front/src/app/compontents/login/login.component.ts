import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrestamosServiceService } from '../../services/prestamos-service.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginFormEmpleado: FormGroup;
  loginFormCliente: FormGroup;
  constructor(private fb: FormBuilder, private prestamosService:PrestamosServiceService, private alertService:AlertService) {
    this.loginFormEmpleado = this.fb.group({
      username: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          //Validators.pattern('^(?=.*[A-Z])(?=.*[0-9]).+$') // Al menos una mayúscula y un número
        ]
      ]
    });
    this.loginFormCliente = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          //Validators.pattern('^(?=.*[A-Z])(?=.*[0-9]).+$') // Al menos una mayúscula y un número
        ]
      ]
    });
  }

  onSubmitEmpleado() {
    if (this.loginFormEmpleado.valid) {
      const { username, password } = this.loginFormEmpleado.value;
      this.prestamosService.loginEmpleado(username, password).then((res) => {
        if(res){
          if(res.success){
            this.alertService.success(res.message);
            sessionStorage.setItem('usuario', JSON.stringify(res.data));
          }else{
            this.alertService.danger(res.message);
          }
        }else{
          this.alertService.error("Error de conexión")
        }

      });

    } else {
      this.alertService.danger("Es necesario completar los campos correctamente antes de continuar")
    }
  }

  onSubmitCliente() {
    if (this.loginFormCliente.valid) {
      const { username, password } = this.loginFormCliente.value;
      this.prestamosService.loginCliente(username, password).then((res) => {
        if(res){
          if(res.success){
            this.alertService.success(res.message);
            sessionStorage.setItem('usuario', JSON.stringify(res.data));
          }else{
            this.alertService.danger(res.message);
          }
        }else{
          this.alertService.error("Error de conexión")
        }

      });
    } else {
      this.alertService.danger("Es necesario completar los campos correctamente antes de continuar")
    }
  }
}
