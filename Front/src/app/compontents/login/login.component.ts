import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

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
  constructor(private fb: FormBuilder) {
    this.loginFormEmpleado = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern('^(?=.*[A-Z])(?=.*[0-9]).+$') // Al menos una mayúscula y un número
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
          Validators.pattern('^(?=.*[A-Z])(?=.*[0-9]).+$') // Al menos una mayúscula y un número
        ]
      ]
    });
  }

  onSubmitEmpleado() {
    if (this.loginFormEmpleado.valid) {
      const { username, password } = this.loginFormEmpleado.value;

      alert(`Bienvenido, ${username}!`);
    } else {
      alert('Por favor completa los campos correctamente.');
    }
  }

  onSubmitCliente() {
    if (this.loginFormCliente.valid) {
      const { username, password } = this.loginFormCliente.value;
      alert(`Bienvenido, ${username}!`);
    } else {
      alert('Por favor completa los campos correctamente.');
    }
  }
}
