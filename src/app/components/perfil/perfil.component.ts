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
  public statusText;
  public res;
  public mymodel;
  descuentoPrecio = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
  public datos: FormGroup;
  public datosAdmin: FormGroup;
  public loading;


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
    this.loading = true;
    var user = this._userService.getIdentity();
    console.log(user);

    if (user.medico_id) {
      this.estudios = new EstudiosMedicos('', '', '', '', '');

      this.medico = user;
      this.medico.id = user.medico_id;
      this.mymodel = 'informacion';
      console.log(this.medico);


      // validaciones campos perfil de medico
      this.datos = this.formBuilder.group({
            nombres: [this.medico.nombres, [Validators.required, Validators.minLength(2), Validators.maxLength(50),
                      Validators.pattern('[a-z A-z]*')]],
            apellidos: [this.medico.apellidos, [Validators.required, Validators.minLength(2), Validators.maxLength(50),
                      Validators.pattern('[a-z A-z]*')]],
            email: [this.medico.email, [Validators.required,
                    Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
            cedula: [this.medico.cedula, [Validators.required, Validators.pattern('[0-9]*')]],
            tarjetaProfecional: [this.medico.tarj_profecional, [Validators.required, Validators.pattern('[0-9]*')]],
            titulo: [this.medico.titulo, [Validators.required, Validators.minLength(2), Validators.maxLength(50),
                    Validators.pattern('[a-z A-z]*')]],
            wp: [this.medico.whatsapp, [Validators.pattern('[0-9]*')]],
            telefono: [this.medico.telefono, [Validators.pattern('[0-9]*')]]
      });
 
      this.loading = false;

      // let info = {nombres : this.datosMedico.value.nombres,
      // apellidos:this.datosMedico.value.apellidos , titulo : this.datosMedico.value.especialidad,
      //   telefono:telefono , wp:wp , id:this.global.id_usuario, estudios:contenedor }
    }

    if (user.id_provedor) {
      this.provedor = new Provedor ('' , '', '', '', '', '', '', '', '', '', '', '');
      this.provedor = user;
      this.provedor.id = user.id_provedor ;
      console.log(this.provedor);
      // validaciones campos perfil de provedor
      this.datosAdmin = this.formBuilder.group({

        nombres: [this.provedor.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(50),
                Validators.pattern('[a-z A-z]*') ]],
        nit : [this.provedor.nit, [Validators.required, Validators.pattern('[0-9]*')]],
        direccion : [this.provedor.direccion, [Validators.required]],
        telefono : [this.provedor.telefono, [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(7) ,
                    Validators.maxLength(15)]],
        whats : [this.provedor.whatsapp , [Validators.pattern('[0-9]*'),  Validators.minLength(7) ,
        Validators.maxLength(15)]],
        descripcion : [this.provedor.descripcion, [Validators.required, Validators.minLength(40)]],
        web : ['', [Validators.pattern('(?:(?:(?:ht|f)tp)s?://)?[\\w_-]+(?:\\.[\\w_-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?')]],
        youtube : ['', [Validators.pattern('(?:(?:(?:ht|f)tp)s?://)?[\\w_-]+(?:\\.[\\w_-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?')]],

      });

      this.loading = false;
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

    if (this.datosAdmin.valid && this.datosAdmin.dirty) {
      // console.log(this.provedor);
    this.loading = true;

    let datos = {nit: this.provedor.nit, correo: this.provedor.correo, nombre: this.datosAdmin.value.nombres,
      direccion: this.datosAdmin.value.direccion, telefono : this.datosAdmin.value.telefono, whatsapp: this.datosAdmin.value.whats,
      descripcion: this.datosAdmin.value.descripcion, link: this.datosAdmin.value.web, video: this.datosAdmin.value.youtube,
      id: this.provedor.id };

    console.log(this.provedor);
    let token = this._userService.getToken();
    this._provedorService.editProv(datos, token).subscribe( (response) => {
      this.res = response;
      if (this.res.update === true) {
        this.getProvedor(this.provedor.id);
        // localStorage.removeItem('identity');
        // localStorage.setItem('identity', JSON.stringify(this.provedor));

      } else {
        this.status = 'error';
        this.statusText = 'No se pudo actualizar los datos.';
        window.scroll(0, 0);
      }

      this.loading = false;
    }, (err) => {
      console.log(err);
      this.status = 'error';
      this.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
      window.scroll(0, 0);
      this.loading = false;
    });
    }
  }

  getProvedor(id) {
    this._provedorService.getIdentity(id).subscribe( (response) => {
      console.log(response);

       localStorage.removeItem('identity');
       localStorage.setItem('identity', JSON.stringify(response));
       this.getIdentity();
       this.status = 'success';
       this.statusText = 'Datos actualizados correctamente.';
       window.scroll(0, 0);
       this.loading = false;

    }, (err) => {
      this.loading = false;
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

      let info = {nombres : this.datos.value.nombres, apellidos: this.datos.value.apellidos , titulo : this.datos.value.titulo,

        telefono: this.datos.value.telefono , wp: this.datos.value.wp , id: this.medico.id, estudios : estu };
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
    } else  {

      if (this.datos.valid && this.datos.dirty) {
        this.loading = true;
        let estu = [];
        let info = {nombres : this.datos.value.nombres, apellidos: this.datos.value.apellidos , titulo : this.datos.value.titulo,
        telefono: this.datos.value.telefono , wp: this.datos.value.wp , id: this.medico.id, estudios : estu };
          // console.log(info);
        let token = this._userService.getToken();

        this._medicoService.editInfoMedico(info, token).subscribe( (response) => {
          console.log(response);
          this.loading = false;
          if (response === true) {
            // "Datos actualizados con exito";
            this.getIdentityMedico();
          } else {
            // "Error al actualizar los datos";
            this.status = 'error';
            this.statusText = 'Error al actualizar los datos.';

          }

        }, (err) => {
          this.loading = false;
          console.log(err);
          this.status = 'error';
          this.statusText = 'Error en la conexion, por favor intentalo más tarde o revisa tu conexión.';
        });
      }

    }
  }

  getIdentityMedico() {

    this._medicoService.getInfoMedico(this.medico.id).subscribe( (response) => {
      console.log(response);
      let identity = response[0];
      localStorage.removeItem('identity');
      localStorage.setItem('identity', JSON.stringify(identity));
      this.getIdentity();
      this.status = 'success';
      this.statusText = 'Datos actualizados con exito.';
      window.scroll(0, 0);
    }, (err) => {
      console.log(err);
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor intentalo más tarde o revisa tu conexión.';
    });
  }

  cerrarAlerta() {
    this.status = undefined;
  }

}


