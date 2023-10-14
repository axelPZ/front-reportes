import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

import { UserServices } from 'src/app/services/user.services';

@Component({
  selector: 'app-request-pass',
  templateUrl: './request-pass.component.html',
  styleUrls: ['./request-pass.component.css']
})
export class RequestPassComponent implements OnInit {

  validForm!: FormGroup;
  public item:number;
  public spinner: boolean;
  private token: string;

  constructor(
    private _fb: FormBuilder,
    private _usrServices: UserServices,
    private _router: Router,
    private _route: ActivatedRoute, 
  ) { 
    this.item = 1;
    this.spinner = false;
    this.token = '';
  }

  get Password(){
    return this.validForm.get("Password");
  }
  get RePassword(){
    return this.validForm.get("RePassword");
  }

  ngOnInit(): void {
    this.validForm = this.initForm();
    this.getToken();
  }

  getToken(){
    this._route.params.subscribe( params =>{
      const token = params['token'];
      if(token){
        this.token = token;
        console.log(this.token);
      }else {
        Swal.fire({
          icon: 'error',
          title: '¡Oops!',
          text: 'No se pudo obtener el token',
          showConfirmButton: true,
          heightAuto: false
        });
        this._router.navigate(['/Auth']);
      }
    })
  }

  initForm():FormGroup {
    return this._fb.group({
      Password: ['',[ Validators.required,
        Validators.pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/)]],
      RePassword: [ '', [Validators.required,
           this.confirmPass.bind(this)]],
    })}

    confirmPass(control:any){
      return (  this.validForm?.get('Password')?.value == control.value ) ? null : { noCoincide: true }
    }

    errorsInput(e:any, tipo:string){
      console.log(e)
      if(e?.required){
        return `${tipo} requerido` ;
      }else if(e?.noCoincide){
        return `Las contraseñas no son iguales`; 
      }else{
        return `${tipo} no valido`; 
      }
    }

    onSubmit(e:any){
      this.spinner = true;
      console.log("Usuarui ", this.validForm.value )
      if( !this.validForm.invalid ){

        const data = {
          "Password": this.validForm.value.Password,
          "Token": this.token
        }

        console.log("token ", data);
        this._usrServices.RequestPassword(data).subscribe( response => {
          Swal.fire({
            icon: 'success',
            title: 'Se ha cambiado correctamente la contraseña',
            showConfirmButton: true,
            heightAuto: false,
          });
          console.log("response ", response );
          this._router.navigate(['/Auth']);

        }, error => {
          console.log(error);
          this.spinner = false;
          let errorMensaje = ( error?.error?.Mensaje ) ? error?.error?.Mensaje : 'Ocurrio un error al intentar cambiar la contraseña';
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

}
