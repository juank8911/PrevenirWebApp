import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProvedorService } from '../../services/provedor.service';
import {Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  providers: [ProvedorService]
})
export class RegistroComponent implements OnInit {
  public status: string;
  statusText;
  public loading;
  private datos: FormGroup;

  constructor(public _provedorService: ProvedorService, private _router: Router, private _route: ActivatedRoute,
    private formBuilder: FormBuilder) {

    this.datos = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40), Validators.pattern('[a-z A-z]*')]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      pssw: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      direccion: ['', [Validators.required, Validators.maxLength(80)]],
      nit: ['', [Validators.required, Validators.min(3), Validators.pattern('[0-9]*')]],
      tel: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(15),  Validators.pattern('[0-9]*')]],
      wsp: ['', [Validators.minLength(7), Validators.maxLength(15), Validators.pattern('[0-9]*')]],
      psswConf : ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
    });

   }

  ngOnInit() {
  }

  registro() {
    this.loading = true;

    if (this.datos.value.pssw === this.datos.value.psswConf) {
      let password = CryptoJS.SHA512(this.datos.value.pssw).toString(CryptoJS.enc.Hex);

       let userData = {email: this.datos.value.email, pssw: password,
       nombre: this.datos.value.nombre, esAdmin: true, face: false, direccion: this.datos.value.direccion,
       nit: this.datos.value.nit, tel: this.datos.value.tel, wsp: this.datos.value.wsp};

       console.log(userData);
  
      this._provedorService.registerProvedor(userData).subscribe( (response) => {
        console.log(response);

        if (response[0].existe === false) {
          console.log(response[0].mensaje);

          localStorage.setItem('token', JSON.stringify(response[1].token));
         this.identity(response[1].id_usuario);
        } else {

          let campo = response[1];
          if (campo[0] = 'email') {
          this.status = 'error';
          this.statusText = 'El correo esta repetido.';
          this.loading = false;
        } else {
          this.status = 'error';
          this.statusText = 'El nit ya se encuentra registrado.';
          this.loading = false;
        }

        }
      }, (err) => {
        console.log(err);
        this.status = 'error';
        this.statusText = 'Error en la conexion, por favor intentalo mas tarde o revisa tu conexion.';
        this.loading = false;
      });

    } else {
      console.log('No coinciden');
      this.status = 'error';
      this.statusText = 'Las contraseñas no coinciden.';
      this.loading = false;
    }
  }

  identity(id) {

    console.log(id);

    this._provedorService.getIdentity(id).subscribe( (response) => {
      console.log(response);
      this.loading = false;
      localStorage.setItem('identity', JSON.stringify(response));
      localStorage.setItem('confirmar', JSON.stringify(false));
      this._router.navigate(['/confirmar-cuenta']);

       // this._router.navigate(['/home/', response.id_usuario, response.esAdmin ]);

    }, (err) => {
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor intentalo mas tarde o revisa tu conexion.';
      this.loading = false;
    });
}

cerrarAlerta() {
  this.status = undefined;
}

}
