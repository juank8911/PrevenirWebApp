import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApplicationService } from '../../services/app.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { MedicoService } from '../../services/medico.service';
import { UserService } from '../../services/user.service';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css'],
  providers: [ApplicationService, MedicoService, UserService]
})
export class HistoriaClinicaComponent implements OnInit {
  public mymodel;
  public tituloModal;
  public estadoModal;
  public estadoModalAtras;
  public datosUsuario: FormGroup;
  public datosOptometria: FormGroup;
  public loading;
  public departamentos;
  public municipios;
  public status;
  public statusText;
  public edad = null;
  public today;
  public parentescos;
  public tipoDocumento;
  public estadoCivil;
  public infoUser;
  public infoUserFb;
  public infoHcFb;
  public id_usuario;
  public infoHc;
  public infoHistoriaClinica;
  public id_servicio;
  public res;

  constructor(private formBuilder: FormBuilder, private _aplicationService: ApplicationService, private _route: ActivatedRoute,
    private _medicoService: MedicoService, private _userService: UserService, location: PlatformLocation) {
    this.mymodel = 'informacion';
    this.tituloModal = 'Datos del usuario';
    this.estadoModal = 'datos';
    this.estadoModalAtras = 'cerrar';
    this.today = moment(new Date().toISOString()).format('YYYY-MM-DD');

    location.onPopState(() => {
      document.getElementById('cerrar-modal-hc').click();
      document.getElementById('btn-cerrar-moda-ver-hc').click();
    });


    // console.log(this.today);

    // setInterval(() => {
    //   this.oe();
    //   }, 5000);
   }

  //  oe() {
  //    console.log('oe');
  //  }

  ngOnInit() {
    this.getDepartamentos();
    this.getParentescos();
    this.tpDocumento();
    this.loadPage();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  // ngOnDestroy() {
  //   // cerrar modales cuando salga del componente
  //   document.getElementById('cerrar-modal-hc').click();
  //   document.getElementById('btn-cerrar-moda-ver-hc').click();
  // }

  loadPage() {
    this._route.params.subscribe(params => {
      this.id_usuario = params['id'];
      this.id_servicio = params['id_servicio'];
      // console.log(id);
      this.getUser(this.id_usuario);
      this.getHistoriasClinicas(this.id_usuario, this.id_servicio);
    });
  }

  getHistoriasClinicas(id_usuario, id_servicio) {


    this.loading = true;

    this._medicoService.getHistoriaClinicaPorServicio(id_usuario, id_servicio).subscribe( (response) => {
      console.log(response);
      this.infoHc = response;
      this.loading = false;
    }, (err) => {
      this.status = 'error';
      this.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde';
      this.loading = false;
      // console.log(err);
    });
  }

  getUser(id) {
    this.loading = true;
    this._aplicationService.getUser(id).subscribe( (response) => {
      // console.log(response);
      this.infoUser = response;
      this.validaciones();
      this.loading = false;
    }, (err) => {
      this.status = 'error';
      this.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde';
      this.loading = false;
      // console.log(err);
    });
  }

  tpDocumento() {
    this.tipoDocumento = [{tipo : 'CC' , nombre : 'Cédula de Ciudadanía'},
                          {tipo : 'CE' , nombre : 'Cédula de Extranjería'},
                          {tipo : 'PA' , nombre : 'Pasaporte'},
                          {tipo : 'RC' , nombre : 'Registro Civil'},
                          {tipo : 'TI' , nombre : 'Tarjeta de Identidad'}];

    this.estadoCivil = [{tipo : 'Solter@' , nombre : 'Solter@'},
                        {tipo : 'Comprometid@' , nombre : 'Comprometid@'},
                        {tipo : 'Casad@' , nombre : 'Casad@'},
                        {tipo : 'Union libre' , nombre : 'Union libre'},
                        {tipo : 'Separad@' , nombre : 'Separad@'},
                        {tipo : 'Divorciad@' , nombre : 'Divorciad@'},
                        {tipo : 'Viud@' , nombre : 'Viud@'},
                        {tipo : 'Noviazgo' , nombre : 'Noviazgo'}];
  }

  pestana(tipo) {
    this.mymodel = tipo;
  }

  modalHistoriaClinica(tipo) {
    let bol = true;

    switch (bol === true) {
      case tipo === 'datos' :
        this.tituloModal = 'Anamnesis';
        this.estadoModal = 'anamnesis';
        this.estadoModalAtras = 'vacio';
        this.formPruebaUsuario();
      break;

      case tipo === 'anamnesis' :
          this.tituloModal = 'Optometría';
          this.estadoModal = 'optometria';
          this.estadoModalAtras = 'vacio';
      break;

      case tipo === 'optometria':
          this.estadoModal = 'optometria2';
          this.estadoModalAtras = 'vacio';
      break;


    }

  }

  validaciones() {

    this.edad = this.infoUser.edad;


    this.datosUsuario = this.formBuilder.group({

      nombresYapellidos : [this.infoUser.nombres, [Validators.required, Validators.pattern('[a-z A-z]*')]],
      tipoDocumento : [this.infoUser.tipoDocumento, [Validators.required]],
      // tipoDocumentoStr : [this.infoUser.tipoDocumento, [Validators.required]],
      numeroDocumento : [this.infoUser.cedula, [Validators.required, Validators.pattern('[0-9]*')]],
      estadoCivil : [this.infoUser.estadoCivil, [Validators.required]],
      // estadoCivilStr : [this.infoUser.estadoCivil, [Validators.required]],
      edad : [''],
      fechaNacimiento : [this.infoUser.fecha_nacimiento, [Validators.required]],
      // fechaNacimientoStr : ['', [Validators.required]],
      departamento : [this.infoUser.nomDepa, [Validators.required]],
      // departamentoStr : [this.infoUser.nomDepa, [Validators.required]],
      municipio : [this.infoUser.nomMuni, [Validators.required]],
      // municipioStr : [this.infoUser.nomMuni, [Validators.required]],
      ocupacion : [this.infoUser.ocupacion, [Validators.required, Validators.pattern('[a-z A-z]*')]],
      direccion : [this.infoUser.direccion , [Validators.required]],
      barrio : [this.infoUser.barrio, [Validators.required]],
      telefono : [this.infoUser.telefono, [Validators.required, Validators.pattern('[0-9]*')]],
      eps : [this.infoUser.eps, [Validators.pattern('[a-z A-z]*')]],
      acompanante : [this.infoUser.acompanante, Validators.pattern('[a-z A-z]*')],
      parentesco : [this.infoUser.pareentesco, ],
      // parentescoStr : ['', ],
      telefonoAcompanante : [this.infoUser.telefonoAcompanante, [Validators.pattern('[0-9]*')]]

    });


    this.datosOptometria = this.formBuilder.group({

      tipoConsulta : ['', [Validators.required]],
      motivoConsulta : ['', [Validators.required]],
      antecedentes : ['', [Validators.required]],
      lensometriaOd : ['', [Validators.required]],
      lensometriaOi : ['', [Validators.required]],
      agudezaVisualOd : ['', [Validators.required]],
      agudezaVisualOi : ['', [Validators.required]],
      visionLejanaOd : ['', [Validators.required]],
      visionLejanaOi : ['', [Validators.required]],
      visionCercanaOd : ['', [Validators.required]],
      visionCercanaOi : ['', [Validators.required]],
      adicion : ['', [Validators.required]],
      tipoLente : ['', [Validators.required]],
      examenExternoOd : ['', [Validators.required]],
      examenExternoOi : ['', [Validators.required]],
      oftalmologiaOd : ['', [Validators.required]],
      oftalmologiaOi : ['', [Validators.required]],
      examenMotorOd : ['', [Validators.required]],
      examenMotorOi : ['', [Validators.required]],
      queratometriaOd : ['', [Validators.required]],
      queratometriaOi : ['', [Validators.required]],
      refracionOd : ['', [Validators.required]],
      refracionOi : ['', [Validators.required]],
      formulaFinalOd : ['', [Validators.required]],
      formulaFinalOi : ['', [Validators.required]],
      avvlOd : ['', [Validators.required]],
      avvlOi : ['', [Validators.required]],
      avvpOd : ['', [Validators.required]],
      avvpOi : ['', [Validators.required]],
      adicionOd : ['', [Validators.required]],
      adicionOi : ['', [Validators.required]],
      dnpOd : ['', [Validators.required]],
      dnpOi : ['', [Validators.required]],
      testIshihara : ['', [Validators.required]],
      testEstereopsis : ['', [Validators.required]],
      diagnosticoInicial : ['', [Validators.required]],
      conducta : ['', [Validators.required]],
      medicamentos : ['', [Validators.required]],
      remision : ['', [Validators.required]],
      observaciones : ['', [Validators.required]],
      rips : [''],


      // Datos refracion y formular fina
      // refraccion ojo derecho
      selectOdRefraccion : ['', [Validators.required]],
      esferaRefraccion : ['', [Validators.required]],
      selectRefracion1 : ['', [Validators.required]],
      cilindroRefracion : ['', [Validators.required]],
      selectRefracion2 : ['', [Validators.required]],
      ejeRefracion : ['', [Validators.required]],

      // refraccion ojo izquierdo
      selectOiRefraccion : ['', [Validators.required]],
      esferaRefraccionoi : ['', [Validators.required]],
      selectRefracion1Oi : ['', [Validators.required]],
      cilindroRefracionOi : ['', [Validators.required]],
      selectRefracion2Oi : ['', [Validators.required]],
      ejeRefracionOi : ['', [Validators.required]],


      // Formula final Ojo derecho
      selectOdFormulaFinal : ['', [Validators.required]],
      esferaFormulaFinalOd : ['', [Validators.required]],
      selecFormulaFinal1Od : ['', [Validators.required]],
      cilindrFormulaFinalOd : ['', [Validators.required]],
      selecFormulaFinal2Od : ['', [Validators.required]],
      ejFormulaFinalOd: ['', [Validators.required]],

      // Formula final Ojo Izquierdo
      selectOiFormulaFinal : ['', [Validators.required]],
      esferaFormulaFinalOi : ['', [Validators.required]],
      selecFormulaFinal1Oi : ['', [Validators.required]],
      cilindrFormulaFinalOi : ['', [Validators.required]],
      selecFormulaFinal2Oi : ['', [Validators.required]],
      ejFormulaFinalOi: ['', [Validators.required]],

      // option adicion
      adicionOption : ['', [Validators.required]]

    });
  }

  modalHistoriaClinicaAtras(tipo) {
    let bol = true;

    switch (bol === true) {
      case tipo === 'anamnesis' :
      this.estadoModal = 'datos';
      this.estadoModalAtras = 'cerrar';
      break;

      case tipo === 'optometria' :
      this.estadoModal = 'anamnesis';
      this.estadoModalAtras = 'vacio';
      break;

      case tipo === 'optometria2' :
      this.estadoModal = 'optometria';
      this.estadoModalAtras = 'vacio';
      break;
    }
  }


  getDepartamentos() {
    this.loading = true;

    this._aplicationService.getDepartamento().subscribe( (response) => {
      // console.log(response);
      this.departamentos = response;
      this.loading = false;
    }, (err) => {
      // console.log(err);
      this.loading = false;
    });
  }

  getMunicipios(id) {

    this.loading = true;
    this._aplicationService.getMunicipio(id).subscribe( (response) => {
      // console.log(response);
      this.loading = false;
      this.municipios = response;
    }, (err) => {
      this.loading = false;
      // console.log(err);
    });
  }

  departSelec(ev) {
    // console.log(ev.target.value);
    // console.log(this.datosUsuario.value.departamento);
    this.getMunicipios(this.datosUsuario.value.departamento);
  }

  // prueba() {
  //   console.log(this.datosUsuario.value.fechaNacimiento);
  // }

  calcularEdad() {
    // fecha de nacimiento
    let fecha1 = moment(this.datosUsuario.value.fechaNacimiento);
    // fecha actual
    let fecha2 = moment(this.today);
    let years = fecha2.diff(fecha1, 'years');

    // console.log(years);

    this.edad = years;
  }

  formPrueba() {

    this.loading = true;

    let adicion = '+' + ' ' + this.datosOptometria.value.adicion;
    // console.log('adocion' + adicion);

    // this.datosOptometria.value.selectRefracion1 this.datosOptometria.value.selectRefracion2
    let refraccionOd = this.datosOptometria.value.selectOdRefraccion + ' ' + this.datosOptometria.value.esferaRefraccion +
    ' ' + '-' + ' ' + this.datosOptometria.value.cilindroRefracion + ' ' +
     'X' + ' ' + this.datosOptometria.value.ejeRefracion;

    //  this.datosOptometria.value.selectRefracion1Oi this.datosOptometria.value.selectRefracion2Oi
    let refraccionOi = this.datosOptometria.value.selectOiRefraccion + ' ' + this.datosOptometria.value.esferaRefraccionoi +
    ' ' + '-' + ' ' + this.datosOptometria.value.cilindroRefracionOi + ' ' + 'X'
     + ' ' + this.datosOptometria.value.ejeRefracionOi;

    //  this.datosOptometria.value.selecFormulaFinal1Od this.datosOptometria.value.selecFormulaFinal2Od
    let ffod = this.datosOptometria.value.selectOdFormulaFinal + ' ' + this.datosOptometria.value.esferaFormulaFinalOd +
    ' ' + '-' + ' ' + this.datosOptometria.value.cilindrFormulaFinalOd + ' ' + 'X'
     + ' ' + this.datosOptometria.value.ejFormulaFinalOd;

    //  this.datosOptometria.value.selecFormulaFinal1Oi this.datosOptometria.value.selecFormulaFinal2Oi
    let ffoi = this.datosOptometria.value.selectOiFormulaFinal + ' ' + this.datosOptometria.value.esferaFormulaFinalOi +
    ' ' + '-' + ' ' + this.datosOptometria.value.cilindrFormulaFinalOi + ' ' +
    'X' + ' ' + this.datosOptometria.value.ejFormulaFinalOi;

    // console.log ('refraccion od ' + refraccionOd);
    // console.log ('refraccion oi ' + refraccionOi);
    // console.log ('ff od ' + ffod);
    // console.log ('ff oi ' + ffoi);

      this.infoHcFb = {motivoConsulta: this.datosOptometria.value.motivoConsulta,
      antecedentes : this.datosOptometria.value.antecedentes, lensometriaOd : this.datosOptometria.value.lensometriaOd,
      lensometriaOi : this.datosOptometria.value.lensometriaOi, agudezaVisualOd : this.datosOptometria.value.agudezaVisualOd,
      agudezaVisualOi : this.datosOptometria.value.agudezaVisualOi, visionLejanaOd : this.datosOptometria.value.visionLejanaOd,
      visionLejanaOi : this.datosOptometria.value.visionLejanaOi, visionCercanaOd : this.datosOptometria.value.visionCercanaOd,
      visionCercanaOi : this.datosOptometria.value.visionCercanaOi, adicion : adicion, tipoLente : this.datosOptometria.value.tipoLente,
      examenExternoOd : this.datosOptometria.value.examenExternoOd, examenExternoOi : this.datosOptometria.value.examenExternoOi,
      oftalmologiaOd : this.datosOptometria.value.oftalmologiaOd, oftalmologiaOi : this.datosOptometria.value.oftalmologiaOi,
      examenMotorOd : this.datosOptometria.value.examenMotorOd, examenMotorOi : this.datosOptometria.value.examenMotorOi,
      queratometriaOd : this.datosOptometria.value.queratometriaOd, queratometriaOi : this.datosOptometria.value.queratometriaOi,
      refracionOd : refraccionOd, refraccionOi : refraccionOi, formulaFinalOd : ffod, formulaFinalOi : ffoi,
      avvlOd : this.datosOptometria.value.avvlOd, avvlOi : this.datosOptometria.value.avvlOi,
      avvpOd : this.datosOptometria.value.avvpOd, avvpOi : this.datosOptometria.value.avvpOi,
      adicionOd : this.datosOptometria.value.adicionOd, adicionOi : this.datosOptometria.value.adicionOi,
      dnpOd : this.datosOptometria.value.dnpOd, dnpOi : this.datosOptometria.value.dnpOi,
      testIshihara : this.datosOptometria.value.testIshihara, testEstereopsis : this.datosOptometria.value.testEstereopsis,
      diagnosticoInicial : this.datosOptometria.value.diagnosticoInicial, conducta : this.datosOptometria.value.conducta,
      medicamentos : this.datosOptometria.value.medicamentos, remision : this.datosOptometria.value.remision,
      observaciones : this.datosOptometria.value.observaciones, id_usuario: this.id_usuario, id_servicio: this.id_servicio,
      tipoConsulta: this.datosOptometria.value.tipoConsulta, rips : this.datosOptometria.value.rips};


      console.log(this.infoHcFb);

      // this.enviarDatosUsuario();

  }

  enviarDatosUsuario() {
    let token = this._userService.getToken();
    this._aplicationService.editUser(this.infoUserFb, token).subscribe( (response) => {
      this.res = response;
      // console.log(this.res);
      this.enviarDatosHistoriaC();
      if (this.res.update === true) {
        //  this.datosUsuario.reset();
      }
    }, (err) => {
      // console.log(err);
      this.loading = false;
    });
  }

  enviarDatosHistoriaC() {
    this.loading = true;
    // console.log('aqui');
    this._medicoService.putHistoriaClinica(this.infoHcFb).subscribe( (response) => {
      // console.log('hc', response);

      if (response === true) {
        this.status = 'success';
        this.statusText = 'Historia clinica guarda con exito.';
        this.datosOptometria.reset();
        this.tituloModal = 'Datos del usuario';
        this.estadoModal = 'datos';
        this.estadoModalAtras = 'cerrar';
        document.getElementById('cerrar-modal-hc').click();
        this.loading = false;
        this.getUser(this.id_usuario);
        this.getHistoriasClinicas(this.id_usuario, this.id_servicio);
      }

    }, (err) => {
      console.log(err);
      this.status = 'error';
      this.statusText = 'Error al guardar la historia clinica, por favor revisa tu conexión o intentalo más tarde.';
      document.getElementById('cerrar-modal-hc').click();
      this.loading = false;
      return false;
    });

  }

  formPruebaUsuario () {
  //  var inputValue = (<HTMLInputElement>document.getElementById('oe')).value;

  // console.log('El valor del campo es:' +  inputValue);

   if (this.infoUser.tipoDocumento) {
      this.datosUsuario.value.tipoDocumento = this.infoUser.tipoDocumento;
   }

   if (this.infoUser.estadoCivil) {
      this.datosUsuario.value.estadoCivil = this.infoUser.estadoCivil;
   }

   if (this.infoUser.fecha_nacimiento) {
      this.datosUsuario.value.fechaNacimiento = this.infoUser.fecha_nacimiento;
   }

   if (this.infoUser.nomDepa) {
      this.datosUsuario.value.departamento = this.infoUser.id_departamento;
   }

   if (this.infoUser.nomMuni) {
    this.datosUsuario.value.municipio = this.infoUser.id_municipio;
   }

      this.infoUserFb = { nombres : this.datosUsuario.value.nombresYapellidos, tipoDocumento: this.datosUsuario.value.tipoDocumento,
      cedula : this.datosUsuario.value.numeroDocumento, estadoCivil : this.datosUsuario.value.estadoCivil,
      edad : this.edad, fecha_nacimiento : this.datosUsuario.value.fechaNacimiento,
      id_departamento : this.datosUsuario.value.departamento, id_municipio : this.datosUsuario.value.municipio,
      ocupacion : this.datosUsuario.value.ocupacion, direccion : this.datosUsuario.value.direccion,
      barrio : this.datosUsuario.value.barrio, telefono : this.datosUsuario.value.telefono,
      eps : this.datosUsuario.value.eps, acompanante : this.datosUsuario.value.acompanante,
      parentesco : this.datosUsuario.value.parentesco, telefonoAcompanante : this.datosUsuario.value.telefonoAcompanante ,
      id: this.id_usuario, apellidos : this.infoUser.apellidos, nombre : this.infoUser.nombre,
      telefonowatshapp : this.infoUser.telefonowatshapp
  };
  console.log(this.infoUserFb);

  }

  verHistoriaClinica(info) {
    this.infoHistoriaClinica = info;
    // console.log(this.infoHistoriaClinica);
    document.getElementById('btn-ver-hc').click();
  }

  getParentescos() {
    this._aplicationService.getParentescos().subscribe( (response) => {
      // console.log(response);
      this.parentescos = response;
    }, (err) => {
      // console.log(err);
    });
  }

  cerrarAlerta() {
    this.status = null;
    this.statusText = null;
  }

}
