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

    // Ruta paera pedir la informacion de un usuario
    getUser(id_paciente): Observable<any> {
      // console.log(id);
      return this.http.get(this.url + '/user/' + id_paciente);
    }

    // Ruta para pedir la informacion de una mascota

    getMascotaInfo(id_mascota): Observable<any> {
      return this.http.get(this.url + '/mascotam/' + id_mascota);
    }

    // metodo para verificar que el correo exista, para el cambio de contraseña
    getConfirmacionCorreo(correo) {
      return this.http.get(this.url + '/cambioc/' + correo);
    }

    // Ruta para hacer el cambio de contrasena

    cambioContrasena(info) {

      let headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.put(this.url + '/cambioc', info, {headers : headers});

    }
}
