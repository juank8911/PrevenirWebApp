import { Component, OnInit, Input } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { ProvedorService } from '../../services/provedor.service';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-modal-ver-cita',
  templateUrl: './modal-ver-cita.component.html',
  styleUrls: ['./modal-ver-cita.component.css']
})
export class ModalVerCitaComponent implements OnInit {
  @Input() cedula: any;
  @Input() tipo: any;
  loading;
  existe: string;
  datosUser = {nombre: '', apellidos: '', cedula: '', fecha_nacimiento: '', telefono: '', id : null};
  nombre = new FormControl('', [Validators.required, Validators.pattern('[A-Z a-z]*')]);
  apellidos = new FormControl('', [Validators.required, Validators.pattern('[A-Z a-z]*')]);
  fechaNacimiento = new FormControl('', Validators.required);
  telefono = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
  cd;

  constructor(private home: HomeComponent, private _provedorService: ProvedorService) { }

  ngOnInit() {
    // console.log(this.cedula);
    // console.log(this.tipo);
    this.buscarCedula(this.cedula, this.tipo);
  }

  prueba() {
    this.loading = true;
  }

  buscarCedula(cedula, tipo) {

    let tp;
    if (tipo === 'paciente') {
      tp = false;
    }

    this._provedorService.cedula(cedula, tp).subscribe( (response) => {
      // console.log(response);
      if (response === false) {
        this.existe = 'false';
        this.datosUser = {nombre: '', apellidos: '', cedula: this.cedula, fecha_nacimiento: '', telefono: '', id: ''};
      } else {
        this.datosUser = response[0];
        this.existe = 'true';
      }
    }, (err) => {
      console.log(err);
    });
  }

}
