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
    postAgregarMedicos(info, token): Observable<any> {

        var headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(this.url + '/medicos/' + '?token=' + token, info, {headers : headers});
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

    // Ruta para ver los servicios que tiene un medico
    getServicios(id) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get(this.url + '/medicospr/' + id , {headers : headers});
    }

    // ruta para obtener los comentarios por servicio de un medico
    getComentarioMedico(id_servicio , idctga) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get(this.url + '/comentmed/' + id_servicio + '/' + idctga, {headers : headers});
      }

       // ruta para dar respuestas a los comentarios por parte del medico.
    respuestaComentarioMedico(info): Observable<any>  {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.put(this.url + '/comentmed' , info, {headers : headers});
      }

      // Ruta para pedir las citas activas
      getCitasActivas(id_medico) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get(this.url + '/citasmedac/' + id_medico , {headers : headers});
      }

      // Ruta para enviar historia medica de optica
      putHistoriaClinica(info): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.put(this.url + '/opticausu' , info, {headers : headers});
      }

      // Ruta para pedir historia clinica
      getHistoriaClinica(id_usuario, id_servicio): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get(this.url + '/opticah/' + id_usuario + id_servicio , {headers : headers});
      }

      // Ruta para ver historias clinicas usuario por servicio
      getHistoriaClinicaPorServicio(id_usuario, id_servicio): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get(this.url + '/histserusu/' + id_usuario + '/' + id_servicio , {headers : headers});
      }

      // Ruta para obtener historias clinicas de usuario por cedula
      getHistoriasClinicaPorUsuario(id_medico, cedula) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get(this.url + '/histusuced/' + id_medico + '/' + cedula , {headers : headers});
      }

      // Ruta para obtener las citas del medico.
      getHistorialCitasCalendar(mes,anio,id_medico,id_categoria, id_servicio){
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get(this.url + '/histmed/' + mes + '/' + anio + '/' + id_medico + '/' + id_categoria + '/' + id_servicio , {headers : headers});
      }
}
