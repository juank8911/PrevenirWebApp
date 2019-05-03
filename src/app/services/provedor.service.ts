import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Global } from './global';
import { Provedor } from '../models/provedor';
import axios from 'axios';
import { from } from 'rxjs';
import { log } from 'util';
import CryptoJS from 'crypto-js';
import { timer } from 'rxjs/observable/timer';
const TIME = 5000; // milisegundos

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

    // Publicar un servicio

    pubService(formulario): Observable<any> {

        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(this.url + '/services' , formulario, {headers : headers});
    }

    // Ruta para saber si un usuario esta registrado o no para sacar uan cita a travez de su
    // cedula y obtener su informacion en caso de que exista.
    // bol = true; sacar cita por veterinario veteninario
    cedula(cedula, bol) {
        return this.http.get(this.url + '/cedula/' + cedula + '/' + bol);
      }

    // Ruta para obtener el horaio segun cada servicio
    getHorario (fecha, id_servicio, id_categoria): Observable<any> {
        return this.http.get(this.url + '/servcitas/' + fecha + '/' + id_servicio + '/' + id_categoria);
    }

    // Ruta para pedir los eventos que tiene cada servicio
    getEventos(mes, anio, id_serv, id_cate): Observable <any> {
      console.log('aqui events');
        return this.http.get(this.url + '/eventser/' + mes + '/' + anio + '/' + id_serv + '/' + id_cate, );
    }

    postCitasProvedor(info, token): Observable <any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return   this.http.post(this.url + '/citai/' + '?token=' + token, info, {headers : headers});

      }

    // Ruta para obtener la informacion de una publicacion para ser editada.
    getInfoEditar(id): Observable <any> {
        return this.http.get(this.url + '/sservicio/' + id);
      }

      // Ruta para obtener los datos de una mascota

      getMascotaInfo(id): Observable <any> {
        return this.http.get(this.url + '/mascotam/' + id);
      }


      // Ruta para borrar una cita de provedor
      dltCitaProvedor(idEventos, idProvedor, id_categoria , token): Observable <any> {

        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.delete(this.url + '/eventss/' + idEventos + '/' + idProvedor + '/'
                                + id_categoria + '?token=' + token , {headers : headers});

       }

       // Ruta para obtener las imagenes del servicio
       getFotosServicio(id) {
        return this.http.get(this.url + '/fotosser/' + id);
      }

      // Ruta para eliminar las imagenes de un servicio
      dltImagenServicio(id, ruta): Observable<any> {

        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.delete(this.url + '/elmfotoser/' + id, {headers : headers});

     }

     // Ruta para enviar informacion con la edicion de un servicio
     editInfoServicio(datos, token): Observable<any> {

        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.put(this.url + '/servicioput/' + '?token=' + token, datos, {headers : headers});

      }

      // Ruta para enviar las imagenes de edicion de un servicio
      enviarFotosEditServicio(imgs): Observable<any> {

        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(this.url + '/infotoser', imgs, {headers : headers});

      }

    // Ruta para consultar
    ordenCita(cedula, id_provedor): Observable<any> {
      let headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.get(this.url + '/ordencita/' + cedula + '/' + id_provedor, {headers : headers});
    }

    // Ruta para eliminar un servicio
    dltService(id, token): Observable<any> {
       let headers = new HttpHeaders().set('Content-Type', 'application/json');
       return  this.http.delete(this.url + '/services/' + id + '?token=' + token , {headers : headers});

     }

     // Ruta para pasar una cita a activa
     postCita(info): Observable<any> {
      let headers = new HttpHeaders().set('Content-Type', 'application/json');
      return  this.http.post(this.url + '/activacita', info, {headers : headers});
     }

     // Get citas activas

     getCitasActivas(id_provedor): Observable<any> {
      let headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.get(this.url + '/citasprovac/' + id_provedor, {headers : headers});
     }

     // cambiar el estado de las citas
     putCambiarEstadoCitas(id_cita, id_servicio, id_categoria): Observable<any> {
      let headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.put(this.url + '/cambestado/' + id_cita + '/' + id_servicio + '/' + id_categoria , {headers : headers});
     }

     // Ruta para finalizar una cita, fue 0 = cancelada, fue 1 finalizada
     putFinalizarCita(id_categoria, id_cita, fue): Observable<any> {
      let headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.put(this.url + '/fincita/' + id_categoria + '/' + id_cita + '/' + fue, {headers : headers});
     }

     // Ruta para entrar a activa la siguiente cita
     putSiguienteCita(id_cita, id_serv, categoria): Observable<any> {
      let headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.put(this.url + '/siguiente/' + id_cita + '/' + id_serv + '/' + categoria, {headers : headers});
     }

}


