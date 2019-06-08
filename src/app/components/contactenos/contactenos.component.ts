import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { ApplicationService } from '../../services/app.service';

@Component({
  selector: 'app-contactenos',
  templateUrl: './contactenos.component.html',
  styleUrls: ['./contactenos.component.css'],
  providers: [ApplicationService]
})
export class ContactenosComponent implements OnInit {
  public datos: FormGroup;
  municipio = new FormControl('', Validators.required);
  departamento = new FormControl('', Validators.required);
  public loading;
  public status;
  public statusText;
  public departamentos;
  public municipios;

  constructor(public formBuilder: FormBuilder, private _aplicationService: ApplicationService) {

    this.datos = this.formBuilder.group({
      nombres : ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('[a-z A-z]*')]],
      cedula : ['', [Validators.required, Validators.pattern('[0-9]*')]],
      email : ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      telefono : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern('[0-9]*')]],
      mensaje : ['', [Validators.required, Validators.minLength(5)]]
    });
  }
  ngOnInit() {
    this.getDepartamentos();
  }

  getDepartamentos() {
    this.loading = true;
    this._aplicationService.getDepartamento().subscribe( (response) => {
      this.departamentos = response;
      // console.log(this.departamentos);
      this.loading = false;
    }, (err) => {
      this.status = 'error';
      this.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
      this.loading = false;
    });
  }

  contactenos() {
    let info = {nombres : this.datos.value.nombres, cedula: this.datos.value.cedula, email: this.datos.value.email,
    telefono: this.datos.value.telefono, mensaje: this.datos.value.mensaje, municipio : this.municipio.value};

    // console.log(info, this.municipio.value);
  }

  cerrarAlerta() {
    this.status = undefined;
  }

  departamentoSelect(ev) {
    // console.log(this.departamento.value);
    this.loading = true;
    this._aplicationService.getMunicipio(this.departamento.value).subscribe( (response) => {
      this.municipios = response;
      // console.log(response);
      this.loading = false;
    }, (err) => {
      this.status = 'error';
      this.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde.';
      this.loading = false;
    });
  }

}
