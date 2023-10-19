import { Component, OnInit } from '@angular/core';

import { ReporteServices } from 'src/app/services/reportes.services';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-detalle',
  templateUrl: './register-detalle.component.html',
  styleUrls: ['./register-detalle.component.css']
})
export class RegisterDetalleComponent implements OnInit {

  public eventos:any;
  private idEvent:string;
  public incidente:any;
  public imgFull:string; 
  public screen:boolean=false;

  constructor(
    private _rServices: ReporteServices,
    private _router: Router,
    private _route: ActivatedRoute, 
  ) {

    this.idEvent = '';
    this.imgFull = '';
   }

   public horas = Array.from({ length: 12 }, (_, index) => (index + 1).toString().padStart(2, '0'));
   public minutos = Array.from({ length: 59 }, (_, index) => (index + 1).toString().padStart(2, '0'));
 

  ngOnInit(): void {
    this._route.params.subscribe( params =>{
      const id = params['id'];
      if(id){
        this.idEvent = id;
        this.getInfoRegister(this.idEvent);
      }else {
        Swal.fire({
          icon: 'error',
          title: '¡Oops!',
          text: 'No se pudo obtener el id del incidente',
          showConfirmButton: true,
          heightAuto: false
        });
        this._router.navigate(['/Home']);
      }
    })
  }

  fullscreen(img:string){
    if(!img) return;
    this.imgFull = img;
    this.screen = true;
  }

  minScremm(){
    this.screen = false;
  }


  getInfoRegister(id:string){
    this._rServices.getIdIncidente(id).subscribe( response => {
      console.log("resoponse ", response );
      this.incidente = response;
    }, error => {
      console.log("error ", error);
      Swal.fire({
        icon: 'warning',
        title: '¡Oops!',
        text: 'Ocurrio un error al intentar obtener la informacion del incidente',
        showConfirmButton: true,
        heightAuto: false
      });
    })
  }

}
