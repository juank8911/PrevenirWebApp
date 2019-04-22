import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Global } from './global';
import CryptoJS from 'crypto-js';

@Injectable( )
export class MedicoService {
    public url;

    constructor(public http: HttpClient, public global: Global) {
        this.url = this.global.apiUrl;
    }

    // Obtener la informacion del medico a travez de su id
    getInfoMedico(id) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get(this.url + '/medicosm/' + id , {headers : headers});
      }

      // Consultar si un medico existe o no a traves de la cedula
      getMedico(cedula): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get(this.url + '/medicosc/' + cedula, {headers : headers});
      }

       // Agregar medico desde provedor
    postAgregarMedicos(info, token, bol): Observable<any> {

        var headers = new HttpHeaders().set('Content-Type', 'application/json');

        if (bol === false ) {
            let password = CryptoJS.SHA512(info.pssw).toString(CryptoJS.enc.Hex);
            info.pssw = password;

            return this.http.post(this.url + '/medicos/' + '?token=' + token, info, {headers : headers});
        } else {
            return this.http.post(this.url + '/medicos/' + '?token=' + token, info, {headers : headers});
        }

    }


    // Borrar medico por provedor

    dltMedicoPorProvedor(medico_id, provedor_id, token): Observable<any> {
       let headers = new HttpHeaders().set('Content-Type', 'application/json');
       return this.http.delete(this.url + '/medico/' + medico_id + '/' + provedor_id + '?token=' + token , {headers : headers});
       }

    // Editar datos del medico

    editInfoMedico(info, token) {

        console.log('medico service');
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.put(this.url + '/medico/' + '?token=' + token , info, {headers : headers});
    }
}
