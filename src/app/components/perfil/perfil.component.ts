import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Global } from '../../services/global';
import { Provedor } from '../../models/provedor';
import { ProvedorService } from '../../services/provedor.service';
import { MedicoService } from '../../services/medico.service';
import { parseIntAutoRadix } from '@angular/common/src/i18n/format_number'; // no ce pa que es
import { EstudiosMedicos } from '../../models/estudios-medicos';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  providers: [UserService, Global, ProvedorService, MedicoService]
})
export class PerfilComponent implements OnInit {
  public identity;
  public provedor: Provedor;
  public medico;
  public estudios: EstudiosMedicos;
  public ver;
  public campo;
  public status: string;
  public res;
  public mymodel;
  descuentoPrecio = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
  public datos: FormGroup;


  constructor(public _userService: UserService, public global: Global, public _provedorService: ProvedorService,
              public _medicoService: MedicoService, public formBuilder: FormBuilder) {}

  ngOnInit() {
    this.getIdentity();
    // window.onload = function() {
    //   var li = document.getElementById('informacion');
    //   li.className = 'list-group-item active';
    // };
  }

  getIdentity() {

    var user = this._userService.getIdentity();
    console.log(user);

    if (user.medico_id) {
      this.estudios = new EstudiosMedicos('', '', '', '', '');

      this.medico = user;
      this.medico.id = user.medico_id;
      this.mymodel = 'informacion';
      console.log(this.medico);

      this.datos = this.formBuilder.group({
            nombres: [this.medico.nombres, [Validators.required, Validators.minLength(2), Validators.maxLength(50),
                      Validators.pattern('[a-zA-z]*')]],
            apellidos: [this.medico.apellidos, [Validators.required, Validators.minLength(2), Validators.maxLength(50),
                      Validators.pattern('[a-zA-z]*')]],
            email: [this.medico.email, [Validators.required,
                    Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
            cedula: [this.medico.cedula, [Validators.required, Validators.pattern('[0-9]*')]],
            tarjetaProfecional: [this.medico.tarj_profecional, [Validators.required, Validators.pattern('[0-9]*')]],
            titulo: [this.medico.titulo, [Validators.required, Validators.minLength(2), Validators.maxLength(50),
                    Validators.pattern('[a-zA-z]*')]],
            wp: [this.medico.whatsapp, [Validators.pattern('[0-9]*')]],
            telefono: [this.medico.telefono, [Validators.pattern('[0-9]*')]]
      });

      // let info = {nombres : this.datosMedico.value.nombres,
      // apellidos:this.datosMedico.value.apellidos , titulo : this.datosMedico.value.especialidad,
      //   telefono:telefono , wp:wp , id:this.global.id_usuario, estudios:contenedor }
    }

    if (user.id_provedor) {
      this.provedor = new Provedor ('' , '', '', '', '', '', '', '', '', '', '', '');
      this.provedor = user;
      this.provedor.id = user.id_provedor ;
    }
  }

  mouseEnter(campo) {
    this.ver = campo;
  }

  mouseLeave() {
    this.ver = '';
  }

  editar(campo) {
    this.campo = document.getElementById(campo);
    this.campo.readOnly = false;
  }

  cambio(campo) {
    this.campo = document.getElementById(campo);
    this.campo.readOnly = true;
  }

  editarProvedor() {

    console.log(this.provedor);
    let token = this._userService.getToken();
    this._provedorService.editProv(this.provedor, token).subscribe( (response) => {
      this.res = response;
      if (this.res.update === true) {
        this.status = 'update';
        localStorage.removeItem('identity');
        localStorage.setItem('identity', JSON.stringify(this.provedor));
        this.getIdentity();
      } else {
        this.status = 'no_update';
      }
    }, (err) => {
      console.log(err);
    });
  }

  pestana(pestana) {

    this.mymodel = pestana;
    var li = document.getElementById(this.mymodel);

    if (this.mymodel === 'informacion') {

        let l = document.getElementById('estudios');
        l.className = 'list-group-item';
        li.className = 'list-group-item active';
    }

    if (li.id === 'estudios') {
            let l = document.getElementById('informacion');
            l.className = 'list-group-item';
            li.className = 'list-group-item active';
          }
  }

  datosMedic(bol, form) {

    // console.log(bol);

    if (bol === true) {

      let estu = [];

      estu.push({nombreEstudio: this.estudios.nombreEstudio , nombreInstitucion: this.estudios.nombreInstitucion, 
        start: this.estudios.start, end: this.estudios.end, id: this.medico.id });

      let info = {nombres : this.medico.nombres, apellidos: this.medico.apellidos , titulo : this.medico.titulo,

        telefono: this.medico.telefono , wp: 0 , id: this.medico.id, estudios : estu };
        console.log(info);

        let token = this._userService.getToken();

        this._medicoService.editInfoMedico(info, token).subscribe( (response) => {

          console.log(response);
          if (response[0].fecha === false) {
            console.log('Por favor revisa las fechas, la fecha de inicio no puede ser mayor a la de finalización.');
          } else {
            console.log('Datos actualizados con exito.');
          }

        }, (err) => {
          console.log(err);
        });

        form.reset();
    }
  }

  editarMedico() {

     // let info = {nombres : this.datosMedico.value.nombres,
    //  apellidos:this.datosMedico.value.apellidos , titulo : this.datosMedico.value.especialidad,
      //   telefono:telefono , wp:wp , id:this.global.id_usuario, estudios : contenedor };

  }

}


