import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Global } from './global';
import { Provedor } from '../models/provedor';
import axios from 'axios';
import { from } from 'rxjs';
import { log } from 'util';
import CryptoJS from 'crypto-js';

@Injectable( )
export class ProvedorService {
    public url;

    constructor(public http: HttpClient, public global: Global) {
        this.url = this.global.apiUrl;
    }

    // Login
    postLogin(email , pssw): Observable<any> {

        let datos = {email : email, pssw: pssw };
        let headers = new HttpHeaders().set('Content-Type', 'application/json');


        return this.http.post(this.url + '/login', datos, {headers : headers});
    }

    // Obtener los datos de un provedor a traves del id
    getIdentity(id): Observable<any> {

        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this.http.get(this.url + '/provedores/' + id , {headers : headers});
    }

    // Registrar un provedor
    registerProvedor(datos): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        let password = CryptoJS.SHA512(datos.pssw).toString(CryptoJS.enc.Hex);
        datos.pssw = password;
        return this.http.post(this.url + '/register', datos , {headers : headers});
    }

    // Obtener las publicaciones de un provedor
    getPublications(id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get(this.url + '/services/' + id);
    }

    // Obtener los medicos del provedor

    getMedicosProvedor(id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this.http.get(this.url + '/medicos/' + id);
    }


    // Editar datos del perfil de provedor

    editProv(datos, token): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this.http.put(this.url + '/provedores/' + '?token=' + token, datos, {headers : headers});
      }

}


