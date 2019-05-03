import { Injectable } from '@angular/core';

@Injectable()
export class Global {
  public login = false;
  public id_usuario;
  public admin = false;
  public apiUrl = 'http://192.168.2.107:3300';
  // public apiUrl = 'http://cdn.prevenirexpress.com:3000';
  public infoPerfil = {};
  public foto;
  public nombre;
  public medico = false;
  // public nombres;
}
