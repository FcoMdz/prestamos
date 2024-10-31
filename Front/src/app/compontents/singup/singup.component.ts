import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-singup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './singup.component.html',
  styleUrl: './singup.component.scss'
})
export class SingupComponent {
  registerForm: FormGroup;

  municipios = ['Municipio 1', 'Municipio 2', 'Municipio 3'];
  estados = ['Estado 1', 'Estado 2', 'Estado 3'];
  paises = ['País 1', 'País 2', 'País 3'];

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2)]],
      apellidoMaterno: ['', Validators.minLength(2)],
      telefono: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')] // 10 dígitos
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$')
        ]
      ],
      direccion: this.fb.group({
        calle: ['', Validators.required],
        codigoPostal: [
          '',
          [Validators.required, Validators.pattern('^[0-9]{5}$')]
        ],
        noInt: [''],
        noExt: ['', Validators.required],
        colonia: ['', Validators.required],
        municipio: ['', Validators.required],
        estado: ['', Validators.required],
        pais: ['', Validators.required]
      })
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Formulario enviado:', this.registerForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }
}
