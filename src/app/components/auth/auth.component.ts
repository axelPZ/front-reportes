import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UserServices } from 'src/app/services/user.services';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  validForm!: FormGroup;
  public spinner: boolean;

  constructor(
    private _fb: FormBuilder,
    private _usrServices: UserServices,
    private _router: Router,
    private _route: ActivatedRoute, 
  ) { 
    this.spinner = false;
  }

  ngOnInit(): void {
    this.validForm = this.initForm();
  }

  //logiarse
  onSubmit(e:any){
    this.spinner = true;
    console.log("Usuarui ", this.validForm.value )
    if( !this.validForm.invalid ){
      const data = {
        Correo: this.validForm.value.Email,
        Password: this.validForm.value.Password,
      }

      console.log("DATA ", data);

      this._usrServices.Auth(data).subscribe( response => {
        this.spinner = false;
        Swal.fire({
          icon: 'success',
          title: 'As ingresado correctamente el sitio',
          text: 'Ahora puedes agregar incidentes, ten en cuenta que cada vez que quieras ingresar un incidente, tendras que inciar session, ya que el sistema no guarda información de sesión',
          showConfirmButton: true,
          heightAuto: false,
        });
        console.log("response ", response );
        this._usrServices.setDataUser(response);
        this._router.navigate(['/Home']);

      }, error =>{
        this.spinner = false;
        this._usrServices.setDataUser('');
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

  get Email(){
    return this.validForm.get("Email");
  }
  get Password(){
    return this.validForm.get("Password");
  }

  initForm():FormGroup {
    return this._fb.group({
      Email: ['', [   Validators.required,
        Validators.email ]],
      Password: ['',[ Validators.required,
        Validators.pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/)]],
    })}

    errorsInput(e:any, tipo:string){
      console.log(e)
      if(e?.required){
        return `${tipo} requerido` ;
      }else if(e?.email){
        return `Correo no valido`; 
      }else{
        return `${tipo} no valido`; 
      }
    }

}
