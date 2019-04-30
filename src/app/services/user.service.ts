import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Global } from './global';


@Injectable( )
export class UserService {
    public identity;
    public token;
    public confirmar;

    // Obtener la identidad del usuario almacenada en el local storage
    getIdentity() {
        let identity_ls = JSON.parse(localStorage.getItem('identity'));

        if (identity_ls !== 'undefined') {
            this.identity = identity_ls;
        } else {
            this.identity = null;
        }

        return this.identity;
    }

    // Obtener el token del usuario logueado, almacenado en el local storage
    getToken() {
        let token_ls = JSON.parse(localStorage.getItem('token'));

        if (token_ls !== 'undefined') {
            this.token = token_ls;
        } else {
            this.token = null;
        }

        return this.token;
    }

    getConfirmCuenta() {
        let confirmar = JSON.parse(localStorage.getItem('confirmar'));

        if (confirmar !== 'undefined') {
            this.confirmar = confirmar;
        } else {
            this.confirmar = null;
        }

        return this.confirmar;
    }

}
