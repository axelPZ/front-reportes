import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from "rxjs";

import { Global } from './global';

@Injectable({
    providedIn: 'root'
}) export class UserServices {
    private url:string;
    public dataUser = new BehaviorSubject('');

    constructor(
        private _http: HttpClient
    ){
        this.url = Global.url;
    }

    setDataUser(info:any){
        this.dataUser.next(info);
    }

    getDataUser(){
        return this.dataUser.getValue();
    }

    //Login
    Auth(data:any):Observable<any>{
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(`${this.url}/Auth`, JSON.stringify(data), {headers: headers });
    }

    //Validar correo
    ValidEmail(data:any):Observable<any>{
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(`${this.url}/Auth/Validar/Correo`, JSON.stringify(data), { headers: headers});
    }

    //Cambiar contraseña
    RequestPassword(data:any):Observable<any>{
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(`${this.url}/Auth/Cambiar/Password`, JSON.stringify(data), { headers: headers});
    }

    //Agregar usuario
    saveUser(data:any):Observable<any>{
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(`${this.url}/Usuarios`, JSON.stringify(data), { headers: headers});
    }

    //Editar usuario
    updateUser(data:any, token:any|string):Observable<any>{
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                         .set('Authorization', `Bearer ${token}`);
        return this._http.put(`${this.url}/Usuarios`, JSON.stringify(data), { headers: headers});
    }

    //Eliminar usuario
    deleteUser(email:string, token:any|string):Observable<any>{
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                         .set('Authorization', `Bearer ${token}`);
        return this._http.delete(`${this.url}/Usuarios?Correo=${email}`, { headers: headers});
    }
}