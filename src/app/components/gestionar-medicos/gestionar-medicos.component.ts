import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ProvedorService } from '../../services/provedor.service';
import { Global } from '../../services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MedicoService } from '../../services/medico.service';
import { Medico } from '../../models/medico';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-gestionar-medicos',
  templateUrl: './gestionar-medicos.component.html',
  styleUrls: ['./gestionar-medicos.component.css'],
  providers : [UserService, ProvedorService, Global, MedicoService, UserService]
})
export class GestionarMedicosComponent implements OnInit {
  public identity;
  public medicos;
  public status: any;
  public statusText;
  public token;
  public loading = false;
  public vacio = false;
  public datos: FormGroup;

  // Variables modal
  public medico: Medico;
  public existe: boolean;
  public formulario: boolean;
  public read;
  public nombre;
  cedula = new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('[0-9]*')]);

  constructor(public _userService: UserService, public _provedorService: ProvedorService, public global: Global,
    private _router: Router, private _route: ActivatedRoute, public _medicoService: MedicoService, public formBuilder: FormBuilder) {
      this.medico = new Medico('', '', '', '', '', '', '', '', '', '', '', '', '');
      this.formulario = false;
     }

  ngOnInit() {
    this.status = undefined;
    this.getIdentity();
    this.validacionesFormMedico();
  }

  // Obtener la identidad del usuario logueado
  getIdentity() {
    this.identity = this._userService.getIdentity();
    this.getMedicos(this.identity.id_provedor);
  }

  getMedicos(id) {
    this.loading = true;

    this._provedorService.getMedicosProvedor(id).subscribe((response) => {

      if (response.length <= 0) {
        this.vacio = true;
        this.loading = false;
        console.log('vacio');
      } else {
        this.vacio = false;
        this.medicos = response;
        console.log(this.medicos);
        this.loading = false;
      }
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
      console.log(response);
      if (response === true) {
        this.getMedicos(this.identity.id_provedor);
        this.status = 'success';
        this.statusText = 'El medico ha sido eliminado con exito.';
        this.getMedicos(this.identity.id_provedor);
      } else {
        this.status = 'error';
        this.statusText = 'El medico no se puede eliminar por que tiene un servicio asociado, elimina primero el servicio.';
      }
    }, (err) => {
      console.log(err);
    });
  }

  // LOGICA DEL MODAL

  buscarMedico() {

    this._medicoService.getMedico(this.cedula.value).subscribe( (response) => {

      if (response === false) {
        this.existe = false;
        this.formulario = true;
        this.read = false;
        // this.datos.reset();
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

  validacionesFormMedico() {

    this.datos = this.formBuilder.group({
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50),
                Validators.pattern('[a-z A-z]*')]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50),
                Validators.pattern('[a-z A-z]*')]],
      email: ['', [Validators.required,
              Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      cedula: ['', [Validators.pattern('[0-9]*')]],
      tarjetaProfecional: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      titulo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50),
              Validators.pattern('[a-z A-z]*')]],
      pssw: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      psswConf: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]]
    });

  }

  agregarMedico(bol, form) {

    this.loading = true;
    this.identity = this._userService.getIdentity();
    this.nombre = this.identity.nombre;

    var token = this._userService.getToken();
    // console.log(token);

    if (bol === true) {

      console.log(this.medico);
     let info = {cedula: this.medico.id, provedores_id: this.identity.id_provedor, existe: bol};

     this._medicoService.postAgregarMedicos(info, token).subscribe( (response) => {
      this.loading = false;
      console.log(response);
      if (response === true) {
        this.getMedicos(this.identity.id_provedor);
        this.status = 'success';
        this.statusText = 'Medico agregado con exito.';
        document.getElementById('cerrarModal').click();
      }

      if (response === false) {
        this.status = 'error';
        this.statusText = 'Error al agregar el medico, intentalo más tarde o revisa tu conexion';
        document.getElementById('cerrarModal').click();
      }
 
      if (response.existe === true ) {
        this.status = 'warning';
        this.statusText = 'No se puede agregar. El medico actualmente ya se encuentra registrado en ' + this.identity.nombre;
        console.log('No se puede agregar. El medico actualmente ya se encuentra registrado en el servicio.');
      }

     }, (err) => {
      console.log(err);
        this.status = 'error';
        this.statusText = 'Error al agregar el medico, intentalo más tarde o revisa tu conexion';
        this.loading = false;
        document.getElementById('cerrarModal').click();
     });

    } else {

      if (this.datos.value.pssw === this.datos.value.psswConf) {

        let password = CryptoJS.SHA512(this.datos.value.pssw).toString(CryptoJS.enc.Hex);

        let info = {nombre: this.datos.value.nombres , apellidos: this.datos.value.apellidos,
        tarj_profecional: this.datos.value.tarjetaProfecional , email: this.datos.value.email,
        pssw: password, cedula: this.cedula.value, titulo: this.datos.value.titulo,
        provedores_id: this.identity.id_provedor, existe: bol };

        console.log(info);

        this._medicoService.postAgregarMedicos(info, token).subscribe((response) => {
          this.loading = false;
          console.log(response);

          if (response === true) {
            this.status = 'success';
            this.statusText = 'Medico agregado con exito';
            this.getMedicos(this.identity.id_provedor);
            this.formulario = false;
            this.cedula.reset();
            document.getElementById('cerrarModal').click();
          } else if (response === false) {
            this.status = 'error';
            this.statusText = 'Error al agregar el medico, intentalo más tarde o revisa tu conexion';
            document.getElementById('cerrarModal').click();
          }

            if (response.campo === 'profecional') {
              this.status = 'warning';
              this.statusText = 'La tarjeta profecinal ya se encuentra registrada';
            }
            if (response.campo === 'email') {
              this.status = 'warning';
              this.statusText = 'El email ya se encuentra registrado';
            }

        }, (err) => {
          this.status = 'error';
          this.statusText = 'Error al agregar el medico, intentalo más tarde o revisa tu conexion';
          this.loading = false;
          document.getElementById('cerrarModal').click();
          console.log(err);
        });

      } else {
        this.status = 'warning';
        this.statusText = 'Error las contraseñas no coinciden';
        this.loading = false;
      }
    }
  }

  cerrarAlerta() {
    this.status = undefined;
  }

  limpiarForm() {
    this.datos.reset();
    this.existe = undefined;
    this.formulario = false;
    this.cedula.reset();
    document.getElementById('btn-abriModal').click();
  }

}
