import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from "rxjs";

import { Global } from './global';

@Injectable({
    providedIn: 'root'
}) export class ReporteServices {

    private url: string;
    constructor(
        private _http: HttpClient
    ){
        this.url = Global.url;
    }

    //Obtener los registros
    getIncidentes():Observable<any>{
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(`${this.url}/Registros`, {headers: headers });
    }

    //Obtener los tipos de registros
    getEventos():Observable<any>{
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(`${this.url}/Eventos`, {headers: headers });
    }
}