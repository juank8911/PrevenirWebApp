import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApplicationService } from '../../services/app.service';
import * as moment from 'moment';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css'],
  providers: [ApplicationService]
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

  constructor(private formBuilder: FormBuilder, private _aplicationService: ApplicationService) {
    this.mymodel = 'informacion';
    this.tituloModal = 'Datos del usuario';
    this.estadoModal = 'datos';
    this.estadoModalAtras = 'cerrar';
    this.today = moment(new Date().toISOString()).format('YYYY-MM-DD');
    console.log(this.today);
    this.validaciones();

    // setInterval(() => {
    //   this.oe();
    //   }, 5000);
   }

   oe() {
     console.log('oe');
   }

  ngOnInit() {
    this.getDepartamentos();
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


    this.datosUsuario = this.formBuilder.group({

      nombresYapellidos : ['', [Validators.required, Validators.pattern('[a-z A-z]*')]],
      tipoDocumento : ['', [Validators.required]],
      numeroDocumento : ['', [Validators.required, Validators.pattern('[0-9]*')]],
      estadoCivil : ['', [Validators.required]],
      edad : ['', ],
      fechaNacimiento : ['', [Validators.required]],
      departamento : ['', [Validators.required]],
      municipio : ['', [Validators.required]],
      ocupacion : ['', [Validators.required, Validators.pattern('[a-z A-z]*')]],
      direccion : ['', [Validators.required]],
      barrio : ['', [Validators.required]],
      telefono : ['', [Validators.required, Validators.pattern('[0-9]*')]],
      eps : ['', [Validators.required,  Validators.pattern('[a-z A-z]*')]],
      acompanante : ['', Validators.pattern('[a-z A-z]*')],
      parentesco : ['', ],
      telefonoAcompanante : ['', [Validators.pattern('[0-9]*')]]

    });


    this.datosOptometria = this.formBuilder.group({

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
      console.log(err);
    });
  }

  departSelec(ev) {
    // console.log(ev.target.value);
    console.log(this.datosUsuario.value.departamento);
    this.getMunicipios(this.datosUsuario.value.departamento);
  }

  prueba() {
    console.log(this.datosUsuario.value.fechaNacimiento);
  }

  calcularEdad() {
    // fecha de nacimiento
    let fecha1 = moment(this.datosUsuario.value.fechaNacimiento);
    // fecha actual
    let fecha2 = moment(this.today);
    let years = fecha2.diff(fecha1, 'years');

    console.log(years);

    this.edad = years;
  }

  formPrueba() {
    let adicion = this.datosOptometria.value.adicionOption + ' ' + this.datosOptometria.value.adicion;
    console.log('adocion' + adicion);

    let refraccionOd = this.datosOptometria.value.selectOdRefraccion + ' ' + this.datosOptometria.value.esferaRefraccion +
    ' ' + this.datosOptometria.value.selectRefracion1 + ' ' + this.datosOptometria.value.cilindroRefracion + ' ' +
    this.datosOptometria.value.selectRefracion2 + ' ' + this.datosOptometria.value.ejeRefracion;

    let refraccionOi = this.datosOptometria.value.selectOiRefraccion + ' ' + this.datosOptometria.value.esferaRefraccionoi +
    ' ' + this.datosOptometria.value.selectRefracion1Oi + ' ' + this.datosOptometria.value.cilindroRefracionOi + ' ' +
    this.datosOptometria.value.selectRefracion2Oi + ' ' + this.datosOptometria.value.ejeRefracionOi;

    let ffod = this.datosOptometria.value.selectOdFormulaFinal + ' ' + this.datosOptometria.value.esferaFormulaFinalOd +
    ' ' + this.datosOptometria.value.selecFormulaFinal1Od + ' ' + this.datosOptometria.value.cilindrFormulaFinalOd + ' ' +
    this.datosOptometria.value.selecFormulaFinal2Od + ' ' + this.datosOptometria.value.ejFormulaFinalOd;

    let ffoi = this.datosOptometria.value.selectOiFormulaFinal + ' ' + this.datosOptometria.value.esferaFormulaFinalOi +
    ' ' + this.datosOptometria.value.selecFormulaFinal1Oi + ' ' + this.datosOptometria.value.cilindrFormulaFinalOi + ' ' +
    this.datosOptometria.value.selecFormulaFinal2Oi + ' ' + this.datosOptometria.value.ejFormulaFinalOi;

    // console.log ('refraccion od ' + refraccionOd);
    // console.log ('refraccion oi ' + refraccionOi);
    // console.log ('ff od ' + ffod);
    // console.log ('ff oi ' + ffoi);

    let datosOptometria = {motivoConsulta: this.datosOptometria.value.motivoConsulta,
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
      observaciones : this.datosOptometria.value.observaciones };


      console.log(datosOptometria);
  }

  verHistoriaClinica() {
    document.getElementById('btn-ver-hc').click();
  }

}
