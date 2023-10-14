import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Map, NavigationControl } from 'maplibre-gl';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy { 
  
  map: Map | undefined;
  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;
  
  constructor() { }

  ngOnInit(){
   
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

  ngOnDestroy() {
    this.map?.remove();
  }

}
