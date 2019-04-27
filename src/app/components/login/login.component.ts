import { Component, OnInit } from '@angular/core';
import CryptoJS from 'crypto-js';
import { Provedor } from '../../models/provedor';
import { FormControl } from '@angular/forms';
import { Member } from '../../models/member';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProvedorService } from '../../services/provedor.service';
import { MedicoService } from '../../services/medico.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ProvedorService, MedicoService, UserService]
})
export class LoginComponent implements OnInit {
  public user: Member;
  public status: string;
  public loading = false;
  public statusText;


  constructor(private _router: Router, private _route: ActivatedRoute, private _provedorService: ProvedorService,
    private _medicoService: MedicoService, public _userService: UserService) {

    this.user = new Member('', '');
  }

  ngOnInit() {

    this.getIdentity();
  }

  getIdentity() {
    let identity = this._userService.getIdentity();
    let token = this._userService.getToken();

    // console.log(identity, token);

    if (identity && token) {
      this._router.navigate(['/home']);
    }
  }

  login(loginForm) {

    this.loading = true;

    let password = CryptoJS.SHA512(this.user.pssw).toString(CryptoJS.enc.Hex);

    this._provedorService.postLogin(this.user.email, password).subscribe((response) => {

      console.log(response);

      if (response.login === true) {

        if (response.esAdmin === 2) {
          this.status = 'error';
          this.statusText = 'Error cuenta de usuario.';
        }

         if (response.esAdmin === 1) {

          localStorage.setItem('token', JSON.stringify(response.token));

          // true admin
          this.identity(response.id_usuario, true);
        } else if (response.esAdmin === 3) {

          localStorage.setItem('token', JSON.stringify(response.token));
          this.identity(response.id_usuario, false);
        }

      } else {
        this.status = 'error';
        this.statusText = 'Usuario o contraseña incorrectos.';

      }

      this.loading = false;

    }, (err) => {
      console.log(err);
      this.status = 'error';
      this.statusText = 'Error en la conexión, intentalo más tarde o revisa tu conexión.'
      this.loading = false;
    });

    // this._router.navigate(['/home']);

  }


  identity(id, bol) {

    this.loading = true;

      console.log(id);

      if (bol === true) {

        this._provedorService.getIdentity(id).subscribe( (response) => {
          console.log(response);

         localStorage.setItem('identity', JSON.stringify(response));
          this._router.navigate(['/home']);

           // this._router.navigate(['/home/', response.id_usuario, response.esAdmin ]);
           this.loading = false;

        }, (err) => {
          this.loading = false;
          console.log(err);
        });

      } else {

        this._medicoService.getInfoMedico(id).subscribe( (response) => {
          console.log(response);

          let identity = response[0];
          localStorage.setItem('identity', JSON.stringify(identity));
          this._router.navigate(['/home']);
          this.loading = false;
        }, (err) => {
          this.loading = false;
          console.log(err);
        });

      }

  }

  goToRegister() {
    this._router.navigate(['/registro']);
   }

   cerrarAlerta() {
     this.status = undefined;
   }


}
