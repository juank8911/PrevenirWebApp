import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApplicationService } from '../../services/app.service';
import CryptoJS from 'crypto-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-olvido-contrasenia',
  templateUrl: './olvido-contrasenia.component.html',
  styleUrls: ['./olvido-contrasenia.component.css'],
  providers: [ ApplicationService ]
})
export class OlvidoContraseniaComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]);
  codigo = new FormControl('', [Validators.required]);
  pssw = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]);
  psswConf = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]);
  loading;
  cambio = false;
  status;
  statusText;

  constructor(private _aplicationService: ApplicationService, private _router: Router) { }

  ngOnInit() {
  }

  comprobarCorreo() {
    this.loading = true;
    this._aplicationService.getConfirmacionCorreo(this.email.value).subscribe( (response) => {
      console.log(response);
      this.loading = false;
      if (response === true) {
        this.cambio = true;
      } else {
        this.status = 'warning';
        this.statusText = 'Por favor ingresa un correo valido.';
      }

    }, (err) => {
        this.loading = false;
        this.status = 'error';
        this.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión';
    });
  }

  cambioContrasena() {

    this.loading = true;

    if (this.pssw.value === this.psswConf.value) {

      let password = CryptoJS.SHA512(this.pssw.value).toString(CryptoJS.enc.Hex);
      let info = {salt: this.codigo.value , pssw: password };
      this._aplicationService.cambioContrasena(info).subscribe( (response) => {
        this.loading = false;

        if (response === true) {
          document.getElementById('modal-contrasenia').click();
        } else {
          this.status = 'warning';
          this.statusText = 'El codigo de recuperación de contraseña no coincide.';
        }

      }, (err) => {
        this.status = 'error';
        this.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión';
        this.loading = false;
      });

    } else {
      this.status = 'error';
      this.statusText = 'Las contraseñas no coinciden.';
      this.loading = false;
    }
  }

  aceptar() {
    this._router.navigate(['/login']);
  }
}
