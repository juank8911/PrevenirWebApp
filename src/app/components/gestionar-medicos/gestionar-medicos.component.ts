import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ProvedorService } from '../../services/provedor.service';
import { Global } from '../../services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MedicoService } from '../../services/medico.service';


@Component({
  selector: 'app-gestionar-medicos',
  templateUrl: './gestionar-medicos.component.html',
  styleUrls: ['./gestionar-medicos.component.css'],
  providers : [UserService, ProvedorService, Global, MedicoService]
})
export class GestionarMedicosComponent implements OnInit {
  public identity;
  public medicos;
  public status;
  public token;
  public loading = false;

  constructor(public _userService: UserService, public _provedorService: ProvedorService, public global: Global,
    private _router: Router, private _route: ActivatedRoute, public _medicoService: MedicoService) { }

  ngOnInit() {
    this.getIdentity();
  }

  // Obtener la identidad del usuario logueado
  getIdentity() {
    this.identity = this._userService.getIdentity();
    this.getMedicos(this.identity.id_provedor);
  }

  getMedicos(id) {
    this.loading = true;

    this._provedorService.getMedicosProvedor(id).subscribe((response) => {
      this.medicos = response;
      console.log(this.medicos);
      this.loading = false;
    }, (err) => {
      this.loading = false;
      console.log(err);
    });
  }

  verMedico(id) {
    this._router.navigate( ['/vermedico', id]);
  }

  deleteMedico(medico_id) {

    let token = this._userService.getToken();

    this._medicoService.dltMedicoPorProvedor(medico_id, this.identity.id_provedor, token).subscribe( (response) => {
      if (response === true) {
        console.log('Medico eliminado con exito.');
        this.getMedicos(this.identity.id_provedor);
        this.status = 'eliminado';
      } else {
        this.status = 'no_eliminado';
        console.log('El medico no se puede eliminar por que tiene un servicio asociado, elimina primero el servicio.');
      }
    }, (err) => {
      console.log(err);
    });
  }

}
