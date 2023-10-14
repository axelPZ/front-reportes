import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ReporteServices } from 'src/app/services/reportes.services';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public mostrar:boolean;
  public eventos:any[];

  constructor(
    private _fb: FormBuilder,
    private _rServices: ReporteServices,
    private _router: Router,
    private _route: ActivatedRoute, 
  ) { 
    this.mostrar = true;
    this.eventos = [];
  }

  ngOnInit(): void {
    this.getReportes();
    this.getEventos();
  }

  getReportes(){
   this._rServices.getIncidentes().subscribe( response => {
      console.log(response)
    }, error => {
      console.log('Error ', error)
      Swal.fire({
        icon: 'warning',
        title: '¡Oops!',
        text: 'Ocurrio un error al intentar actualizar la lista de incidentes',
        showConfirmButton: true,
        heightAuto: false
      });

    })
  }

  getEventos(){
    this._rServices.getEventos().subscribe( response => {
      this.eventos = response.Eventos;
      console.log(this.eventos)
    }, error => {
      console.log('Error ', error)
      Swal.fire({
        icon: 'warning',
        title: '¡Oops!',
        text: 'Ocurrio un error al intentar actualizar la lista de eventos',
        showConfirmButton: true,
        heightAuto: false
      });

    })
  }
  showHidden(){
    this.mostrar = ( this.mostrar ) ? false: true; 
  }

}
