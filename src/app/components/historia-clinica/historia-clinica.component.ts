import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApplicationService } from '../../services/app.service';

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

  constructor(private formBuilder: FormBuilder, private _aplicationService: ApplicationService) {
    this.mymodel = 'informacion';
    this.tituloModal = 'Datos del usuario';
    this.estadoModal = 'datos';
    this.estadoModalAtras = 'cerrar';
    this.validaciones();
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

      nombresYapellidos : ['', [Validators.required]],
      tipoDocumento : ['', [Validators.required]],
      numeroDocumento : ['', [Validators.required]],
      EstadoCivil : ['', [Validators.required]],
      edad : ['', [Validators.required]],
      fechaNacimiento : ['', [Validators.required]],
      departamento : ['', [Validators.required]],
      municipio : ['', [Validators.required]],
      ocupacion : ['', [Validators.required]],
      direccion : ['', [Validators.required]],
      barrio : ['', [Validators.required]],
      telefono : ['', [Validators.required]],
      eps : ['', [Validators.required]],
      acompanante : ['', [Validators.required]],
      parentesco : ['', [Validators.required]],
      telefonoAcompanante : ['', [Validators.required]]

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
      selectOdRefraccion : ['', [Validators.required]],
      esferaRefraccion : ['', [Validators.required]],
      selectRefracion1 : ['', [Validators.required]],
      cilindroRefracion : ['', [Validators.required]],
      selectRefracion2 : ['', [Validators.required]],
      ejeRefracion : ['', [Validators.required]],

      selectOdFormulaFinal : ['', [Validators.required]],
      esferaFormulaFinal : ['', [Validators.required]],
      selecFormulaFinal1 : ['', [Validators.required]],
      cilindrFormulaFinal : ['', [Validators.required]],
      selecFormulaFinal2 : ['', [Validators.required]],
      ejFormulaFinal: ['', [Validators.required]],

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

}
