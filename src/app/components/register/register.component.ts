import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

import { UserServices } from 'src/app/services/user.services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  validForm!: FormGroup;
  public item:number;
  private token: string|null;
  private user: string|null;
  public spinner: boolean;

  constructor(
    private _fb: FormBuilder,
    private _usrServices: UserServices,
    private _router: Router,
    private _route: ActivatedRoute, 
  ) {
    this.item = 1;
    this.token = localStorage.getItem('TokenAdm');
    this.user = localStorage.getItem('UserAdm');
    this.spinner = false;
   }

  ngOnInit(): void {
    this.validForm = this.initForm();
  }

  //Registrar los usuarios
  onSubmit(e:any){
    this.spinner = true;
    console.log("Usuarui ", this.validForm.value )
    if( !this.validForm.invalid ){
      const data = {
        Nombres: this.validForm.value.Nombres,
        Apellidos: this.validForm.value.Apellidos,
        Fecha: this.validForm.value.FechaDeNacimiento,
        Edad: this.validForm.value.Edad,
        Alias: this.validForm.value.Alias,
        Correo: this.validForm.value.Email,
        Password: this.validForm.value.Password,
        Rol: 'USUARIO'
      }

      this._usrServices.saveUser(data).subscribe( response => {
        this.spinner = false;
        Swal.fire({
          icon: 'success',
          title: 'Te as registrado correctamente',
          showConfirmButton: true,
          heightAuto: false,
        });
        this._router.navigate(['/Auth']);
      }, error => {
        this.spinner = false;
        let errorMensaje = ( error?.error?.Mensaje ) ? error?.error?.Mensaje : 'Ocurrio un error al intentar registrar al usuario, por favor intentelo más tarde'
        console.log("error ", error);
        Swal.fire({
          icon: 'warning',
          title: '¡Oops!',
          text: errorMensaje,
          showConfirmButton: true,
          heightAuto: false
        });
      })
      
    }else{
      this.spinner = false;
      Swal.fire({
        icon: 'warning',
        title: '¡Oops!',
        text: 'Parece que el formulario no esta correctamente lleno, por favor reviselo e intentelo de nuevo',
        showConfirmButton: true,
        heightAuto: false
      });
    }
  }

  get Nombres(){
    return this.validForm.get("Nombres");
  }
  get Apellidos(){
    return this.validForm.get("Apellidos");
  }
  get FechaDeNacimiento(){
    return this.validForm.get("FechaDeNacimiento");
  }
  get Edad(){
    return this.validForm.get("Edad");
  }
  get Alias(){
    return this.validForm.get("Alias");
  }
  get Email(){
    return this.validForm.get("Email");
  }
  get Password(){
    return this.validForm.get("Password");
  }
  get RePassword(){
    return this.validForm.get("RePassword");
  }
  get AceptarTer(){
    return this.validForm.get("AceptarTer");
  }

  initForm():FormGroup {
    return this._fb.group({
      Nombres: ['', [   
                      Validators.required,
                      Validators.minLength(2),
                      Validators.maxLength(50),
                      Validators.pattern('[A-Za-záéíóúÁÉÍÓÚñÑ ]*') ]],
      Apellidos: ['', [ 
                      Validators.required,
                      Validators.minLength(2),
                      Validators.maxLength(50),
                      Validators.pattern('[A-Za-záéíóúÁÉÍÓÚñÑ ]*') ]],
      FechaDeNacimiento: ['', [ 
                      Validators.required,
                      this.validarFecha.bind(this) ]], 
      Edad: ['', [    Validators.required,
                      Validators.minLength(2),
                      Validators.maxLength(2),
                      Validators.pattern('[0-9]*') ]],
      Alias: ['', [   Validators.required,
                      Validators.minLength(2),
                      Validators.maxLength(50),
                      Validators.pattern('[A-Za-záéíóúÁÉÍÓÚñÑ ]*') ]],
      Email: ['', [   Validators.required,
                      Validators.email ]],
      Password: ['',[ Validators.required,
                      Validators.pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/)]],
      RePassword: [ '', [Validators.required,
                         this.confirmPass.bind(this)]],
      AceptarTer: [ false, [Validators.requiredTrue ]]
    });
  }


  confirmPass(control:any){
    return (  this.validForm?.get('Password')?.value == control.value ) ? null : { noCoincide: true }
  }

  validarFecha(control:any){
    return (new Date(control.value) >= new Date() ) ? ( { enElFuturo: true }) : false;
  }

  errorsInput(e:any, tipo:string){
    console.log(e)
    if(e?.required){
      return `${tipo} requerido` ;
    }else if(e?.minlength){
      return `${tipo} con menos de ${e.minlength.requiredLength} caracteres no valido`; 
    }else if(e?.maxlength){
      return `${tipo} con mas de ${e.maxlength.requiredLength} caracteres no valido`; 
    }else if(e?.enElFuturo){
      return `No se aceptan fechas a futuro`; 
    }else if(e?.email){
      return `Correo no valido`; 
    }else if(e?.noCoincide){
      return `Las contraseñas no son iguales`; 
    }else if(e?.requiredTrue){
      return `Por favor seleccione que acepta los terminos y condiciones`; 
    }else{
      return `${tipo} no valido`; 
    }
  }


  continuarRegresar(e:any){
    if( e.target.value == 'Continuar'){
      if(this.item >=3) return
      this.item ++;
    }else{
      if(this.item <=1 ) return
      this.item --;
    }
  }



}
