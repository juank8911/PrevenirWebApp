import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { ProvedorService } from '../../services/provedor.service';
import { UserService } from '../../services/user.service';
import { HomeComponent } from '../home/home.component';
import { ApplicationService } from '../../services/app.service';

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

  // Informacion de una cita a eliminar
  public infoCita;

  //
  public citasAgregadas;
  public citasAgregadasMasc;

  constructor(private _userService: UserService, private _provedorService: ProvedorService, private home: HomeComponent,
              private _aplicatioService: ApplicationService) { }

  ngOnInit() {
    this.citasUsuario();
  }


  buscarCedula() {
    this.home.loading = true;
    this.confirmacionEli = false;
    let identity = this._userService.getIdentity();
    this._provedorService.ordenCita(this.cedula.value, identity.id_provedor).subscribe( (response) => {
      console.log(response);

      // this.infoCitasPaciente = response[0];
      // this.infoCitasMascotas = response[1];
      // console.log(this.infoCitasMascotas);

      // if (this.infoCitasPaciente.length <= 0) {
      //   console.log('no hay citas');
      // } else {
      //   console.log(this.infoCitasPaciente);
      //   document.getElementById('btn-modal-cita').click();
      // }

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


    if (tipo === 'paciente') {
      this.citasUsuario();
    }

    if (tipo === 'mascota') {
      this.citasAgregadasMasc.push({cita : info});
      console.log(this.citasAgregadasMasc);
    }
  }

  citasUsuario() {
    let id_provedor = this._userService.getIdentity();
    this._provedorService.getCitasActivas(id_provedor.id_provedor).subscribe( (response) => {
      console.log(response);
      this.citasAgregadas = response;
    }, (err) => {
      console.log(err);
    });
    console.log(this.citasAgregadas);
  }

  verPerfilPaciente(info, tipo) {
    // this.home.loading = true;

    if (tipo === 'paciente') {
      this.mascota = false;

      this.infoUser = info;
      document.getElementById('btn-modal-info-paciente').click();

      // this._aplicatioService.getUser(id).subscribe((response) => {
      //   this.infoUser = response[0];
      //   // console.log(this.infoUser);
      //   this.home.loading = false;
      //   document.getElementById('btn-modal-info-paciente').click();
      // }, (err) => {
      //   // console.log(err);
      //   this.home.status = 'error';
      //   this.home.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
      //   window.scroll(0 , 0);
      //   this.home.loading = false;
      // });

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

  activarCita(id_usu, id_eve, id_ser, id_ctga) {
    // let id_provedor = this._userService.getIdentity();
    // , id_prov : id_provedor.id_provedor
    let info = {id_eve : id_eve, id_ctga : id_ctga };
    console.log(info);
    this._provedorService.postCita(info).subscribe((response) => {
      console.log(response);
    }, (err) => {
      console.log(err);
      this.home.status = 'error';
        this.home.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
        window.scroll(0 , 0);
        this.home.loading = false;
    });
  }

}
