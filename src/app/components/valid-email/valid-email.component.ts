import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UserServices } from 'src/app/services/user.services';

@Component({
  selector: 'app-valid-email',
  templateUrl: './valid-email.component.html',
  styleUrls: ['./valid-email.component.css']
})
export class ValidEmailComponent implements OnInit {
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

  get Email(){
    return this.validForm.get("Email");
  }

  //validar correo electronico
  onSubmit(e:any){
    this.spinner = true;
    console.log("Usuarui ", this.validForm.value )
    if( !this.validForm.invalid ){
      const data = {
        Correo: this.validForm.value.Email,
      }

      console.log("DATA ", data);

      this._usrServices.ValidEmail(data).subscribe( response => {
        this.spinner = false;
        Swal.fire({
          icon: 'success',
          title: 'Se ha enviado un mensaje a tu correo',
          text: 'para que puedas seguir con el proseso de recuperación de contraseña, ve al correo que se te envio y luego sigue las instrucciones para seguir con el proceso de recuperación de contraseña.',
          showConfirmButton: true,
          heightAuto: false,
        });
        console.log("response ", response );
        this._usrServices.setDataUser(response);
        this._router.navigate(['/Auth']);

      }, error =>{
        this.spinner = false;
        this._usrServices.setDataUser('');
        let errorMensaje = ( error?.error?.Mensaje ) ? error?.error?.Mensaje : 'Ocurrio un error al intentar validar el correo electronico'
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

  initForm():FormGroup {
    return this._fb.group({
      Email: ['', [   Validators.required,
        Validators.email ]]
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
