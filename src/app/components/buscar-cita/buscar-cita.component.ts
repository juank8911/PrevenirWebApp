import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { ProvedorService } from '../../services/provedor.service';
import { UserService } from '../../services/user.service';
import { HomeComponent } from '../home/home.component';
import { ApplicationService } from '../../services/app.service';
import { IfStmt } from '@angular/compiler';
import { ModalVerCitaComponent } from '../modal-ver-cita/modal-ver-cita.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buscar-cita',
  templateUrl: './buscar-cita.component.html',
  styleUrls: ['./buscar-cita.component.css'],
  providers : [ApplicationService]
})
export class BuscarCitaComponent implements OnInit {


  cedula = new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('[0-9]*')]);
  public infoCitasPaciente;
  public infoCitasMascotas;
  public confirmacionEli = false;
  public mascota;
  public infoUser;
  public loading;

  // Informacion de una cita a eliminar
  public infoCita;

  //
  public citasAgregadas;
  public citasAgregadasMasc;

  // variables para citas
  activada;

  constructor(private _userService: UserService, private _provedorService: ProvedorService, private home: HomeComponent,
              private _aplicatioService: ApplicationService, private _router: Router) { }

  ngOnInit() {

    let identity = this._userService.getIdentity().id_provedor;
    if (identity !== undefined) {
      console.log('es provedor');
      this.citasUsuario();
    } else {
      console.log('es medico');
    }

  }


  buscarCedula() {
    this.home.loading = true;
    this.confirmacionEli = false;
    let identity = this._userService.getIdentity();
    this._provedorService.ordenCita(this.cedula.value, identity.id_provedor).subscribe( (response) => {

      if (response[0][0].activas !== undefined && response[0][0].activas === false) {
        document.getElementById('btn-modal-cita').click();
      } else {

        if (response[0][0].activas === true) {
          console.log('tiene citas activas');
        } else {
            this.infoCitasPaciente = response[0][0];
            document.getElementById('btn-modal-cita').click();
        }
      }

      this.home.loading = false;

    }, (err) => {
      console.log(err);
      this.home.status = 'error';
      this.home.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
      this.home.loading = false;
    });
  }

  confirmacionEliminarCita(info, usuario) {
    this.confirmacionEli = true;

    if (usuario === 'paciente')  {
      this.infoCita = info;
      this.mascota = false;
    }

    if (usuario === 'mascota') {
      this.infoCita = info;
      this.mascota = true;
    }
  }

  cancelarDltCita() {
    this.confirmacionEli = false;
  }

  eliminarCita() {
    this.home.loading = true;
    // console.log(this.infoCita);
    var categoria;

    if (this.mascota === false) {
      categoria = 0;
    } else {
      categoria = 20;
    }

    let identity = this._userService.getIdentity();
    let token = this._userService.getToken();

    // es un usuario
    this._provedorService.dltCitaProvedor(this.infoCita.id_eventos, identity.id_provedor, categoria, token).subscribe( (response) => {
      console.log(response);
      this.home.loading = false;

      if (response[0].borrado === true) {
        this.home.status = 'success';
        this.home.statusText = 'La cita fue elimina con exito.';
        window.scroll(0 , 0);

      } else {
        this.home.status = 'error';
        this.home.statusText = 'La cita no se puede eliminar, por favor revisa tu conexión o intentalo más tarde.';
        window.scroll(0 , 0);
      }
    }, (err) => {
      this.home.status = 'error';
      this.home.statusText = 'La cita no se puede eliminar, por favor revisa tu conexión o intentalo más tarde.';
      window.scroll(0 , 0);
      this.home.loading = false;
    });

  }

  agregarCita(info, tipo) {

    console.log(info);
    if (tipo === 'paciente') {
      this.activarCita(info.id_eventos, info.categoria);
    }

    if (tipo === 'mascota') {
      this.citasAgregadasMasc.push({cita : info});
      console.log(this.citasAgregadasMasc);
    }
  }

  citasUsuario() {
    this.loading = true;
    let id_provedor = this._userService.getIdentity();
    this._provedorService.getCitasActivas(id_provedor.id_provedor).subscribe( (response) => {
      console.log(response);
      this.loading = false;
      this.citasAgregadas = response;
    }, (err) => {
      this.loading = false;
      this.home.status = 'error';
        this.home.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
      console.log(err);
    });
  }

  verPerfilPaciente(info, tipo) {
    // this.home.loading = true;

    if (tipo === 'paciente') {
      this.mascota = false;

      this.infoUser = info;
      document.getElementById('btn-modal-info-paciente').click();

    } else {
      this.mascota = true;

      this._aplicatioService.getMascotaInfo(info).subscribe( (response) => {
        this.infoUser = response[0];
        console.log(this.infoUser);
        this.infoUser.dueno = this.infoUser.dueño;
        this.home.loading = false;
        document.getElementById('btn-modal-info-paciente').click();
      }, (err) => {
        // console.log(err);
        this.home.status = 'error';
        this.home.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
        window.scroll(0 , 0);
        this.home.loading = false;
      });
    }
  }

  activarCita(id_eve, id_ctga) {

    let info = {id_eve : id_eve, id_ctga : id_ctga };
    console.log(info);
    this._provedorService.postCita(info).subscribe((response) => {
      if (response === true) {
        this.citasUsuario();
      }
    }, (err) => {
      console.log(err);
      this.home.status = 'error';
        this.home.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
        window.scroll(0 , 0);
        this.home.loading = false;
    });
  }

  // Metodo para rediriguir a calendario para crear una cita.
  crearCt() {
    this._router.navigate(['/calendario']);
  }

  // Metodo para cambiar de estado la cita
  cambiarEstado(info) {
    console.log(info);
    // console.log(info.id_citas_activas , info.servicios_idservicios, info.categoria);
    // this._provedorService.putCambiarEstadoCitas(info.id_citas_activas , info.servicios_idservicios, info.categoria)
    //                      .subscribe( (response) => {

    //                       if (response.activa === false && response.activada === true) {

    //                       } else {

    //                       }

    //                      }, (err) => {
    //                        console.log(err);
    //                      });
  }

}
