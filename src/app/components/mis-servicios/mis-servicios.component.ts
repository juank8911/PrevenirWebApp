import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../services/medico.service';
import { UserService } from '../../services/user.service';
import { User } from '../crear-publicacion/crear-publicacion.component';
import { Router } from '@angular/router';
import { stringify } from '@angular/core/src/render3/util';

@Component({
  selector: 'app-mis-servicios',
  templateUrl: './mis-servicios.component.html',
  styleUrls: ['./mis-servicios.component.css'],
  providers: [MedicoService, UserService]
})
export class MisServiciosComponent implements OnInit {
  public loading;
  public servicios;
  public servicioSelect;
  public status;
  public statusText;
  public comentarios;
  public infoServicio;
 
  constructor(private _medicoService: MedicoService, private _userService: UserService, private _router: Router) { }

  ngOnInit() {
    let identity = this._userService.getIdentity().medico_id;
    this.getServiciosMedico(identity);
  }

  getServiciosMedico(id) {
    this.loading = true;
    this._medicoService.getServicios(id).subscribe( (response) => {
      console.log(response);
      this.servicios = response;
      this.loading = false;
    }, (err) => {
      console.log(err);
      this.loading = false;
    });
  }

  serviciosSelecionado(ev) {
    console.log(ev);
    this.servicioSelect = ev.value;
  }

  irCalendario(info) {
    console.log(info);
    let inf = {id_servicios : info.id_servicios, id_categoria: info.categoria_idcategoria};
    localStorage.removeItem('calendar-medico');
    localStorage.setItem('calendar-medico', JSON.stringify(inf));
    this._router.navigate(['/calendario']);
  }

  verComentarios(info) {
    // console.log(info);
    this.loading = true;
    this.infoServicio = info;
    this._medicoService.getComentarioMedico(info.id_servicios, info.categoria_idcategoria).subscribe( (response) => {
      console.log(response);
      this.comentarios = response;
      this.loading = false;
      document.getElementById('btn-modal-comentarios').click();
    }, (err) => {
      this.loading = false;
      console.log(err);
    });
  }

}
