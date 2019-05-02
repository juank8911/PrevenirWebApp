import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ApplicationService } from '../../services/app.service';
import { User } from '../crear-publicacion/crear-publicacion.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmar-cuenta',
  templateUrl: './confirmar-cuenta.component.html',
  styleUrls: ['./confirmar-cuenta.component.css'],
  providers: [UserService, ApplicationService]
})
export class ConfirmarCuentaComponent implements OnInit {
  codigo = new FormControl('', Validators.required);
  public status;
  public statusText;
  public loading;

  constructor(private _userService: UserService, private _appService: ApplicationService, private _router: Router) { }

  ngOnInit() {

  }

  confirmar() {
    console.log("Entro");
    this.loading = true;
    let identity = this._userService.getIdentity().id_provedor;
    let token = this._userService.getToken();
    var id;

    if (identity === undefined) {
      id = this._userService.getIdentity().medico_id;
    } else {
      id = identity;
    }

    let info = {salt: this.codigo.value, id : id};
    this._appService.confirmacionCuenta(info, token).subscribe( (response) => {

      if (response === true) {
        document.getElementById('btn-modal-exitosa').click();
      } else {
        this.status = 'warning';
        this.statusText = 'Codigo incorrecto.';
      }
      this.loading = false;
    }, (err) => {
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor intentalo mas tarde o revisa tu conexion.';
      this.loading = false;
    });
  }

  reenviar() {
    this.loading = true;
    let identity = this._userService.getIdentity().id_provedor;
    var id;

    if (identity === undefined) {
      id = this._userService.getIdentity().medico_id;
    } else {
      id = identity;
    }

    this._appService.getReenviarCodigoCorreo(id).subscribe( (response) => {
      console.log(response);
      if (response === true) {
        this.status = 'success';
        this.statusText = 'Código reenviado con exito, Por favor revisa tu correo.';
      }
      this.loading = false;
    }, (err) => {
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor intentalo mas tarde o revisa tu conexion.';
      this.loading = false;
      console.log(err);
    });
  }

  atras() {
    localStorage.clear();
    this._router.navigate(['/login']);
  }

  cerrarAlerta() {
    this.status = undefined;
  }

  bienvenido() {
    console.log('oeee');
  }

}
