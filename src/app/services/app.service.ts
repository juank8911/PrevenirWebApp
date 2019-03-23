import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Global } from './global';
import CryptoJS from 'crypto-js';

@Injectable( )
export class ApplicationService {
    public url;

    constructor(public http: HttpClient, public global: Global) {
        this.url = this.global.apiUrl;
    }

    getDepartamento(): Observable<any> {
      return this.http.get(this.url + '/departamentos/47');
    }

    getMunicipio(id): Observable<any> {
      return this.http.get(this.url + '/municipios/' + id);
    }

    getCategorias(): Observable<any> {
      return this.http.get(this.url + '/categoria');
    }

    // Ruta para obtener las publicaciones que ha hecho un provedor;
    getPublicacionesProveedor(id): Observable<any> {
      return this.http.get(this.url + '/services/' + id);
    }
}
