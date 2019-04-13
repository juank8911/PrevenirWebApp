import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { ProvedorService } from '../../services/provedor.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-buscar-cita',
  templateUrl: './buscar-cita.component.html',
  styleUrls: ['./buscar-cita.component.css']
})
export class BuscarCitaComponent implements OnInit {
  cedula = new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('[0-9]*')]);
  public infoCitas;
  public confirmacionEli = false;
  public status: any;
  public statusText;

  // Informacion de una cita a eliminar
  public infoCita;

  //
  public citasAgregadas = [];

  constructor(private _userService: UserService, private _provedorService: ProvedorService) { }

  ngOnInit() {
  }

  buscarCedula() {
    this.confirmacionEli = false;
    let identity = this._userService.getIdentity();
    this._provedorService.ordenCita(this.cedula.value, identity.id_provedor).subscribe( (response) => {
      console.log(response);
      this.infoCitas = response;

      if (this.infoCitas.length <= 0) {
        console.log('no hay citas');
      } else {
        // console.log(this.infoCitas);
        document.getElementById('btn-modal-cita').click();
      }

    }, (err) => {
      console.log(err);
    });
  }

  confirmacionEliminarCita(c) {
    this.confirmacionEli = true;
    this.infoCita = c;
  }

  cancelarDltCita() {
    this.confirmacionEli = false;
  }

  eliminarCita(bol) {
    // console.log(this.infoCita);
    var categoria;

    if (bol === false) {
      categoria = 0;
    } else {
      categoria = 20;
    }

    let identity = this._userService.getIdentity();
    let token = this._userService.getToken();

    // // es un usuario
    this._provedorService.dltCitaProvedor(this.infoCita.id_eventos, identity.id_provedor, categoria, token).subscribe( (response) => {
      console.log(response);

      if (response[0].borrado === true) {
        this.status = 'success';
        this.statusText = 'La cita fue elimina con exito.';
        window.scroll(0 , 0);

      } else {
        this.status = 'error';
        this.statusText = 'La cita no se puede eliminar, por favor revisa tu conexión o intentalo más tarde.';
        window.scroll(0 , 0);
      }
    }, (err) => {
      this.status = 'error';
      this.statusText = 'La cita no se puede eliminar, por favor revisa tu conexión o intentalo más tarde.';
      window.scroll(0 , 0);
    });

  }

  agregarCita(c) {
    this.citasAgregadas.push({cita : c});
    console.log(this.citasAgregadas);
  }

}
