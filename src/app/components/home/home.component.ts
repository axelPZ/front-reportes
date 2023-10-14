import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Map, NavigationControl } from 'maplibre-gl';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ReporteServices } from 'src/app/services/reportes.services';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, AfterViewInit, OnDestroy { 
  public mostrar:boolean;
  public eventos:any[];
  map: Map | undefined;
  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;
  
  constructor(
    private _fb: FormBuilder,
    private _rServices: ReporteServices,
    private _router: Router,
    private _route: ActivatedRoute, 
  ) { 
    this.mostrar = true;
    this.eventos = [];
  }


  ngOnInit(){
    this.getReportes();
    this.getEventos();
  }

  ngAfterViewInit() { 
    const initialState = { lng: -90.61416733456322, lat: 14.503790221782317, zoom: 14 };
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=dUVDBugrdiqbX0xSVyEi`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    this.map.addControl(new NavigationControl({}), 'top-right');

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

  ngOnDestroy() {
    this.map?.remove();
  }

}
