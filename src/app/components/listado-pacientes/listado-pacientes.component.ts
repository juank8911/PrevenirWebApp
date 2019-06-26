import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MedicoService } from '../../services/medico.service';
import { PlatformLocation } from '@angular/common';

// Validaciones
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-listado-pacientes',
  templateUrl: './listado-pacientes.component.html',
  styleUrls: ['./listado-pacientes.component.css'],
  providers: [UserService, MedicoService],
})
export class ListadoPacientesComponent implements OnInit {
  cedula = new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('[0-9]*')]);
  loading;
  infoHc;
  infoHistoriaClinica;
  statusText;
  status;

  constructor(private _userService: UserService, private _medicoService: MedicoService, location: PlatformLocation) { 

    location.onPopState(() => {
      document.getElementById('btn-cerrar-moda-ver-hc').click();
    });

  }

  ngOnInit() {
  }

  buscarCedula() {

    this.loading = true;
    let identity = this._userService.getIdentity().medico_id;
    // console.log(identity, this.cedula.value);

    this._medicoService.getHistoriasClinicaPorUsuario(identity, this.cedula.value).subscribe((response) => {
      this.loading = false;
      // console.log(response);
      this.infoHc = response;    
    }, (err)=> {
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor revisa tu conexion o intentalo mas tarde.';
      this.loading = false;
      // console.log(err);
    });

  }

  verHistoriaClinica(info) {
    this.infoHistoriaClinica = info;
    // console.log(this.infoHistoriaClinica);
    document.getElementById('btn-ver-hc').click();
  }

}
