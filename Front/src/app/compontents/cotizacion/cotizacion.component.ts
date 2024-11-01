import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cotizacion',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './cotizacion.component.html',
  styleUrl: './cotizacion.component.scss'
})
export class CotizacionComponent {
  calculoForm: FormGroup;
  resultados: any[] = [];
  mostrarResultados: boolean = false;

  constructor(private fb: FormBuilder) {
    this.calculoForm = this.fb.group({
      monto: ['', Validators.required],
      meses: ['', Validators.required],
      interes: ['', Validators.required]
    });
  }

  // Método para procesar el formulario y realizar cálculos
  onSubmit() {
    if (this.calculoForm.valid) {
      console.log("Hola, después se realiza esto")
      // Realizar cálculos aquí y almacenarlos en la tabla de resultados
      this.resultados = [
      ];

      this.mostrarResultados = true; // Mostrar la tabla de resultados
    }
  }
}
