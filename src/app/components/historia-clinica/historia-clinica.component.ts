import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup,FormControl } from '@angular/forms';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit {
  public mymodel;
  public tituloModal;
  public estadoModal;
  public datos: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.mymodel = 'informacion';
    this.tituloModal = 'Datos del usuario';
    this.estadoModal = 'optometria';

    this.validaciones();
   }

  ngOnInit() {
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
      break;

      case tipo === 'anamnesis' :
          this.tituloModal = 'Optometría';
          this.estadoModal = 'optometria';
      break;

      case tipo === 'optometria':
          this.estadoModal = 'optometria2';
      break;

    }

  }

  validaciones() {
    this.datos = this.formBuilder.group({

    });
  }

}
