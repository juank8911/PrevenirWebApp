import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../services/medico.service';
import { UserService } from '../../services/user.service';
import { User } from '../crear-publicacion/crear-publicacion.component';
import { Router } from '@angular/router';
import { stringify } from '@angular/core/src/render3/util';
import { FormControl, Validators } from '@angular/forms';
import { Global } from '../../services/global';

@Component({
  selector: 'app-mis-servicios',
  templateUrl: './mis-servicios.component.html',
  styleUrls: ['./mis-servicios.component.css'],
  providers: [MedicoService, UserService, Global]
})
export class MisServiciosComponent implements OnInit {
  public loading;
  public servicios;
  public servicioSelect;
  public status;
  public statusText;
  public comentarios;
  public infoServicio;
  comentarioArea = new FormControl('', [Validators.required, Validators.minLength(2)]);

  constructor(private _medicoService: MedicoService, private _userService: UserService, private _router: Router,
    private global: Global) { }

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
    this.status = undefined;
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

  responderComent(info) {
    console.log(info);
    this.loading = true;
    let infoComent = { cate: this.infoServicio.categoria_idcategoria , coment : this.comentarioArea.value , id : info.id_comentarios };
    console.log(infoComent);

    this._medicoService.respuestaComentarioMedico(infoComent).subscribe( (response) => {
      if (response === true) {
        this.status = 'success_modal';
        this.statusText = 'Respuesta exitosa';
        let info = {id_servicios : this.infoServicio.id_servicios , categoria_idcategoria: this.infoServicio.categoria_idcategoria};
        this.verComentarios(info);
        this.comentarioArea.reset();
      } else {
        this.status = 'error_modal';
        this.statusText = 'Error al enviar respuesta.';
      }

      this.loading = false;
    }, (err) => {
      console.log(err);
      this.status = 'error';
      this.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
      document.getElementById('cerrar-modal-comentarios').click();
      this.loading = false;
    });
  }

  cerrarAlerta() {
    this.status = undefined;
  }

}
