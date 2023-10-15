import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { Observable, interval } from 'rxjs';
import { observeOn, startWith, switchMap } from 'rxjs/operators';
import { ReporteServices } from 'src/app/services/reportes.services';
import { UserServices } from 'src/app/services/user.services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy { 
  public mostrar: boolean;
  public eventos: any[];
  private map: any;
  validForm!: FormGroup;
  public coordenas:any;
  public spinner:boolean;
  private token:string;
  private dataUser:any;


  constructor(
    private _fb: FormBuilder,
    private _rServices: ReporteServices,
    private _router: Router,
    private _route: ActivatedRoute, 
    private _userService: UserServices
  ) { 
    this.mostrar = true;
    this.eventos = [];
    this.spinner = false;
    this.token = '';
  }

  ngOnInit() {
    this.dataUser = this._userService.getDataUser();
    this.getEventos();
    this.getReportes();
    this.validForm = this.initForm();
    this.Reportes();
  }

  //El mapa se actualiza cada dos minutos
  Reportes(){
    const intDosMin = interval(2 * 60 * 1000);
    intDosMin.subscribe( val => { this.getReportes(1) } );
  }

  ngAfterViewInit():void { 
    //Iniciar el mapa
   this.initMap();
  }

  get IdEvento(){
    return this.validForm.get("Fecha");
  }

  get Fecha(){
    return this.validForm.get("Fecha");
  }

  get Descripcion(){
    return this.validForm.get("Fecha");
  }

  get Hora(){
    return this.validForm.get("Fecha");
  }

  initForm():FormGroup{
    return this._fb.group({
      IdEvento: ['', [

        Validators.required,
        Validators.pattern('[0-9]*')
      ]],
      Fecha: ['', [
        Validators.required,
        this.fechaValidator
      ]],
      Descripcion: ['',[
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(50)
      ]],
      Hora: ['', [
        Validators.required
      ]]

    })
  }

  errorsInput(e:any, tipo:string){
    console.log(e)
    if(e?.required){
      return `${tipo} requerido` ;
    }else if(e?.minlength){
      return `${tipo} con menos de ${e.minlength.requiredLength} caracteres no valido`; 
    }else if(e?.maxlength){
      return `${tipo} con mas de ${e.maxlength.requiredLength} caracteres no valido`; 
    }else if(e?.fechaInvalida){
      return `Fecha no valida`; 
    }{
      return `${tipo} no valido`; 
    }
  }


  // Función de validación personalizada para la fecha
  fechaValidator(control:any) {
    const inputDate = new Date(control.value);
    const currentDate = new Date();
    console.log("Fecha control ", control.value)
    if (inputDate > currentDate) {
      return { fechaInvalida: true };
    }

    return null;
  }


  onSubmit(e:any){
    console.log("data ", this.validForm );    
    if( !this.validForm.invalid ){
      const data = {
        "Fecha": this.validForm.value.Fecha,
        "Hora": this.validForm.value.Hora,
        "idEvento": this.validForm.value.IdEvento,
        "descripcion": this.validForm.value.Descripcion,
        "cordenadas": this.coordenas
      }

      console.log("id del envento ", data)

      this._rServices.addRegistro( this.token, data).subscribe( response => {

        Swal.fire({
          icon: 'success',
          title: 'Registro agregado correctamente, en unos minutos aparecera tu reporte en el mapa.',
          showConfirmButton: true,
          heightAuto: false,
        });

      }, error => {
        this.spinner = false;
        let errorMensaje = ( error?.error?.Mensaje ) ? error?.error?.Mensaje : 'Ocurrio un error al intentar agregar el incidente, por favor intentelo más tarde'
        console.log("error ", error);
        Swal.fire({
          icon: 'warning',
          title: '¡Oops!',
          text: errorMensaje,
          showConfirmButton: true,
          heightAuto: false
        });
      })

      console.log("data ", data);
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

//Iniciar las comfiguraciones del mapa
  private initMap():void {
    this.map = L.map('map', {
      center: [ 14.634915, -90.506882 ],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 8,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

   // Define los límites máximos para restringir la vista a Guatemala
   const maxBounds: L.LatLngBoundsExpression = [
    [7, -94],
    [22, -83],
    ];
    this.map.setMaxBounds(maxBounds);

    tiles.addTo(this.map);

      // Definir el icono personalizado
  const customIcon = L.icon({
    iconUrl: './assets/images/marker-icon.png', // Reemplaza con la ruta correcta de tu icono
    iconSize: [25, 41], // Tamaño del icono
    iconAnchor: [16, 32], // Punto de anclaje del icono (donde se conecta al marcador)
    popupAnchor: [0, -32] // Punto donde se muestra el popup en relación con el icono
  });


    const guatemalaMarker = L.marker([14.634915, -90.506882], { icon: customIcon }).addTo(this.map);
    guatemalaMarker.bindPopup('Ciudad de Guatemala').openPopup(); // Agrega un mensaje emergente al marcador

    this.map.on('click', (e:any) => this.onMapClick(e, customIcon));
  }

   //Funcion que detecta un click en el mapa
    private onMapClick(e: L.LeafletMouseEvent, customIcon: L.Icon): void {
      const latlng = e.latlng;
      console.log("cordenadas ", `${latlng.lat.toFixed(6)}|${latlng.lng.toFixed(6)}` )
      if(this._userService.getDataUser() ){
        this.token = this.dataUser.token;
        this.showHidden();
        this.coordenas=`${latlng.lat.toFixed(6)}|${latlng.lng.toFixed(6)}`;
      }else {
        Swal.fire(
          '¡No as iniciado sesión!',
          'Si quieres agregar un registro, primero debes de iniciar sesión',
          'question'
        )
      }
    }


  getReportes(limpiar=0) {
   if(limpiar) this.clearMap();
    const customIcon = L.icon({
      iconUrl: './assets/images/marker-icon.png', // Reemplaza con la ruta correcta de tu icono
      iconSize: [25, 41], // Tamaño del icono
      iconAnchor: [16, 32], // Punto de anclaje del icono (donde se conecta al marcador)
      popupAnchor: [0, -32] // Punto donde se muestra el popup en relación con el icono
    });

    this._rServices.getIncidentes().subscribe(response => {
      console.log(response);
      response.forEach( (r:any) => {
        const cordenadas = r.cordenadas.split('|');
        console.log("Registro ", cordenadas);
        const marker = L.marker( [cordenadas[0], cordenadas[1] ], { icon: customIcon }).addTo(this.map);
        marker.bindPopup(`Evento: ${ r.evento }, Fecha ${ r.fecha }`).openPopup();
      });
     
    }, error => {
      console.log('Error ', error);
      Swal.fire({
        icon: 'warning',
        title: '¡Oops!',
        text: 'Ocurrió un error al intentar actualizar la lista de incidentes',
        showConfirmButton: true,
        heightAuto: false
      });
    });

   /* return new Observable<any>( observer => {
      observer.of('Valor emitido por la');
      //observer.complete();
    })*/
  }

  getEventos() {
    this._rServices.getEventos().subscribe(response => {
      this.eventos = response.Eventos;
      console.log(this.eventos);
    }, error => {
      console.log('Error ', error);
      Swal.fire({
        icon: 'warning',
        title: '¡Oops!',
        text: 'Ocurrió un error al intentar actualizar la lista de eventos',
        showConfirmButton: true,
        heightAuto: false
      });
    });
  }

  //limpiar el mapa de todos los puntos de referencia
  private clearMap(): void {
    // Limpia todas las capas del mapa, incluyendo los marcadores
    this.map.eachLayer((layer:any) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
  }

  showHidden() {
    this.mostrar = !this.mostrar;
  }

  ngOnDestroy() {
  }
}
