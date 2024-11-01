import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrestamosServiceService, Pais, Estado, Municipio, Registro } from '../../services/prestamos-service.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-singup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './singup.component.html',
  styleUrl: './singup.component.scss'
})
export class SingupComponent implements OnInit{
  registerForm: FormGroup;
  sendingRegister:boolean = false;
  municipios:Municipio[] = [];
  estados:Estado[] = []
  paises:Pais[] = [];

  constructor(private fb: FormBuilder, private prestamosService:PrestamosServiceService, private alertService:AlertService) {
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

  ngOnInit(): void {
    this.getPaises();
  }

  getPaises() {

    this.prestamosService.getPaises().then((res) => {
      if(res){
        if(res.success){
          this.paises = res.data;
        }else{
          this.alertService.danger(res.message);
        }
      }else{
        this.alertService.error("Error de conexión")
      }
    });

  }

  paisonchange(){
    this.prestamosService.getEstados(this.registerForm.value.direccion.pais).then((res) => {
      if(res){
        if(res.success){
          this.estados = res.data;
        }else{
          this.alertService.danger(res.message);
        }
      }else{
        this.alertService.error("Error de conexión")
      }
    })

  }

  estadoonchange(){

    this.prestamosService.getMunicipio(this.registerForm.value.direccion.estado).then((res) => {
      if(res){
        if(res.success){
          this.municipios = res.data;
        }else{
          this.alertService.danger(res.message);
        }
      }else{
        this.alertService.error("Error de conexión")
      }
    })

  }


  onSubmit() {
    if (this.registerForm.valid) {
      this.sendingRegister = true;
      const {
        email,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        telefono,
        password,
        direccion: { calle, codigoPostal, noInt, noExt, colonia, municipio, estado, pais }
      } = this.registerForm.value;

      let usrInfo = JSON.parse(sessionStorage.getItem('usuario')!);
      if(usrInfo && Object.hasOwn(usrInfo, 'usuario')){
        this.prestamosService.sendRegistro({
          usuario: usrInfo.usuario,
          password: usrInfo.contrasena,
          nombre: nombre,
          correo: email,
          apellidomaterno: apellidoMaterno,
          apellidopaterno: apellidoPaterno,
          telefono: telefono,
          contrasena: password,
          calle: calle,
          cp: codigoPostal,
          noext: noExt,
          noint: noInt,
          colonia: colonia,
          idmunicipio: municipio
        } as Registro).then((res) => {
          if(res){
            if(res.success){
              this.alertService.success(res.message);
              this.registerForm.reset();
            }else{
              this.alertService.danger(res.message);
            }
          }else{
            this.alertService.error("Error de conexión")
          }
        }).finally(()=>{{
          this.sendingRegister = false;
        }});

      }


      console.log('Formulario enviado:', this.registerForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }
}
