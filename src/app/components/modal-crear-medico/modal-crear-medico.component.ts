import { Component, OnInit } from '@angular/core';
import { MedicoService } from 'src/app/services/medico.service';
import { Medico } from '../../models/medico';
import { UserService } from '../../services/user.service';



@Component({
  selector: 'app-modal-crear-medico',
  templateUrl: './modal-crear-medico.component.html',
  styleUrls: ['./modal-crear-medico.component.css'],
  providers: [MedicoService, UserService]
})
export class ModalCrearMedicoComponent implements OnInit {
  public medico: Medico;
  public existe: boolean;
  public formulario: boolean;
  public read;
  public identity;
  public status;
  public nombre;

  constructor(public _medicoService: MedicoService, public _userService: UserService) {
    this.medico = new Medico('', '', '', '', '', '', '', '', '', '', '', '', '');
    this.formulario = false;
   }

  ngOnInit() {
  }

  buscarMedico() {

    this._medicoService.getMedico(this.medico.cedula).subscribe( (response) => {

      if (response === false) {
        this.existe = false;
        this.formulario = true;
        this.read = false;
      } else {
       this.medico = response[0];
       this.medico.id = response[0].medico_id;
       this.existe = true;
       this.formulario = true;
       this.read = true;

      }
    }, (err) => {
      console.log(err);
    });

  }

  agregarMedico(bol) {

    this.identity = this._userService.getIdentity();
    this.nombre = this.identity.nombre;

    var token = this._userService.getToken();
    // console.log(token);

    if (bol === true) {

      console.log(this.medico);
     let info = {cedula: this.medico.id, provedores_id: this.identity.id_provedor, existe: bol};

     this._medicoService.postAgregarMedicos(info, token).subscribe( (response) => {

      console.log(response);
      if (response === true) {

        // this.presentToast("Medico agregado con exito.");
        // this.navCtrl.pop();
      }

      if (response === false) {
        // this.presentToast("Error al agregar el medico, intentalo más tarde o revisa tu conexion");
        // this.navCtrl.setRoot(HomePage);
      }

      if (response.existe === true ) {
        this.status = 'existe';
        // console.log('No se puede agregar. El medico actualmente ya se encuentra registrado en el servicio.');
      }

     }, (err) => {
      console.log(err);
     });

    } else {

      if (this.medico.pssw === this.medico.confirmPssw) {

        let info = {nombre: this.medico.nombres , apellidos: this.medico.apellidos , tarj_profecional: this.medico.tarj_profecional ,
          email: this.medico.email, pssw: this.medico.pssw, cedula: this.medico.cedula,
          titulo: this.medico.titulo, provedores_id: this.identity.id_provedor, existe: bol };

          console.log(info);

        this._medicoService.postAgregarMedicos(info, token).subscribe((response) => {

          console.log(response);

          if (response === true) {
            console.log('Medico agregado con exito');
          } else if (response === false) {
            console.log('Error al agregar el medico, intentalo más tarde o revisa tu conexion');
          }

            if (response.campo === 'profecional') {
              console.log('campo tarjeta profecinal repetido');
            }
            if (response.campo === 'email') {
              console.log('campo email repetido');
            }

        }, (err) => {
          console.log(err);
        });

      } else {
        this.status = 'contrasenia';
      }
    }
  }

}
