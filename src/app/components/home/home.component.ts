import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { interval } from 'rxjs';

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
  public agregarImg:boolean = false;
  public image1:string;
  public image2:string;
  public item:number = 1;

  public horas = Array.from({ length: 12 }, (_, index) => (index + 1).toString().padStart(2, '0'));
  public minutos = Array.from({ length: 59 }, (_, index) => (index + 1).toString().padStart(2, '0'));

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
    this.image1 = '';
    this.image2 = '';
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
    return this.validForm.get("IdEvento");
  }

  get Fecha(){
    return this.validForm.get("Fecha");
  }

  get Descripcion(){
    return this.validForm.get("Descripcion");
  }

  get HH(){
    return this.validForm.get("HH");
  }

  get MM(){
    return this.validForm.get("MM");
  }

  //Iniciamos las reglas del formulario
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
       Validators.minLength(10),
        Validators.pattern('[a-zA-Z0-9áéíóúÁÉÍÓÚÑñ ]*')
      ]],
      HH: ['', [
        Validators.required,
        Validators.maxLength(2),
        Validators.minLength(2),
        Validators.pattern('[0-9]*')
      ]],
      MM: ['', [
        Validators.required,
        Validators.maxLength(2),
        Validators.minLength(2),
        Validators.pattern('[0-9]*')
      ]]
    })
  }

  //respuesta de los errores
  errorsInput(e:any, tipo:string){
    if(e?.required){
      return `${tipo} requerido` ;
    }else if(e?.minlength){
      return `${tipo} con menos de ${e.minlength.requiredLength} carácteres no valido`; 
    }else if(e?.maxlength){
      return `${tipo} con mas de ${e.maxlength.requiredLength} carácteres no valido`; 
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

//envio del formulario
  onSubmit(e:any){
    this.spinner = true;
    console.log("data ", this.validForm );    
    if( !this.validForm.invalid ){
      const data = {
        "Fecha": this.validForm.value.Fecha,
        "Hora": this.validForm.value.Hora,
        "idEvento": this.validForm.value.IdEvento,
        "descripcion": this.validForm.value.Descripcion,
        "cordenadas": this.coordenas,
        "Imagen1": this.image1,
        "Imagen2": this.image2
      }


      console.log(JSON.stringify(data));
      this._rServices.addRegistro( this.token, data).subscribe( response => {

        Swal.fire({
          icon: 'success',
          title: 'Registro agregado correctamente, en unos minutos aparecera tu reporte en el mapa.',
          showConfirmButton: true,
          heightAuto: false,
        });
        this.mostrar = false;
        this.spinner = false;

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
      this.spinner = false;
    }else{
      this.spinner = false;
      Swal.fire({
        icon: 'warning',
        title: '¡Oops!',
        text: 'Parece que el formulario no esta correctamente lleno, por favor reviselo e intentelo de nuevo',
        showConfirmButton: true,
        heightAuto: false
      });
      this.spinner = false;
    }
  }


//Iniciar las comfiguraciones del mapa
  private initMap():void {
    this.map = L.map('map', {
      center: [ 14.634915, -90.506882 ],
      zoom: 8
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
      if(this._userService.getDataUser() ){
        this.token = this.dataUser.token;
        this.mostrar = !this.mostrar;
        this.coordenas=`${latlng.lat.toFixed(6)}|${latlng.lng.toFixed(6)}`;
      }else {
        Swal.fire(
          '¡No as iniciado sesión!',
          'Si quieres agregar un registro, primero debes de iniciar sesión',
          'question'
        )
      }
    }

//Obtener el tipo de reportes
  getReportes(limpiar=0) {
   if(limpiar) this.clearMap();
    const customIcon = L.icon({
      iconUrl: './assets/images/marker-icon.png', // Reemplaza con la ruta correcta de tu icono
      iconSize: [25, 41], // Tamaño del icono
      iconAnchor: [16, 32], // Punto de anclaje del icono (donde se conecta al marcador)
      popupAnchor: [0, -32] // Punto donde se muestra el popup en relación con el icono
    });

    this._rServices.getIncidentes().subscribe(response => {
      response.forEach( (r:any) => {
        const cordenadas = r.cordenadas.split('|');
        const marker = L.marker( [cordenadas[0], cordenadas[1] ], { icon: customIcon }).addTo(this.map);

        //Popop del incidente
        const popopIncidente = this.getStylePopu(r);
        marker.bindPopup(popopIncidente).openPopup();
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
  }

  //Obtener los eventos de la base de datos
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

  showHidden(e:any) {
    e.preventDefault()
    this.agregarImg = !this.agregarImg;
  }

  ngOnDestroy() {
  }

  //Convertir imagen en base64
  addFile(e:any, fileType:number){
    const file: File = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const base64: string = event.target.result;
        this.resizeImage(base64, file.type, fileType);
      };
      reader.readAsDataURL(file);
    }
  }

//cambiar de tamaño la imagen
resizeImage(base64: string, type:string, cont:number) {
  const img = new Image();

  img.onload = () => {
    const maxWidth = 800; // ajusta según tus necesidades
    const maxHeight = 600; // ajusta según tus necesidades

    let newWidth = img.width;
    let newHeight = img.height;

    // Redimensionar proporcionalmente solo si supera los límites
    if (img.width > maxWidth) {
      const ratio = maxWidth / img.width;
      newWidth = maxWidth;
      newHeight = img.height * ratio;
    }

    if (newHeight > maxHeight) {
      const ratio = maxHeight / newHeight;
      newHeight = maxHeight;
      newWidth *= ratio;
    }

    // Crear un lienzo para redimensionar la imagen
    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    // Obtener la nueva imagen en base64
    const resizedBase64 = canvas.toDataURL(type); // Puedes cambiar a 'image/png' si prefieres PNG
    if( cont == 1) this.image1 = resizedBase64;
    if( cont == 2) this.image2 = resizedBase64;
  };
  img.src = base64;
}

continuarRegresar(e:any){
  if( e.target.value == 'Continuar'){
    if(this.item >=2) return
    this.item ++;
  }else{
    if(this.item <=1 ) return
    this.item --;
  }
}

//Estilo del popop del mapa
  getStylePopu(r:any):string {
    const url = this._router.createUrlTree(['/Register']).toString();
    const imgURl = ( r.imagen1 ) ? r.imagen1 : "https://i.pinimg.com/originals/34/22/90/3422900cb9e9bd4ce803847129eb6c9f.jpg"
    return `<div class="detalleEvento">
    <table>
     <tr>
         <td><b>Evento</b></td>
         <td>${r.evento}</td>
     </tr>
     <tr>
         <td><b>Fecha</b></td>
         <td>${r.fecha}</td>
     </tr>
     <tr>
         <td align="center" valign="center" colspan="2">
             <a href='${url}?${r.id}'>Detalles <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                 <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
               </svg></a>
         </td>
     </tr>
     <tr><td colspan="2" height="2" style="border-bottom: 1px solid black;"></td></tr>
     <tr><td colspan="2" align="center" class="contImg"> 
         <div class="imagenes">
             <img src="${imgURl}" width="100px" alt="">
         </div>
         </td>
     </tr>
    </table>
 </div>`;

  }
}
