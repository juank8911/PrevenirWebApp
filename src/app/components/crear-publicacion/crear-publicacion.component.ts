import { Component, OnInit } from '@angular/core';
import { Publicacion } from '../../models/publicacion';
import { UserService } from '../../services/user.service';
import { ApplicationService } from '../../services/app.service';
import { ProvedorService } from '../../services/provedor.service';

// Autocompletar
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { parseIntAutoRadix } from '@angular/common/src/i18n/format_number';


// Autocompletar categorias
export interface User {
  nombre: string;
  id_categoria: number;
}

// Scroll

import {ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';


@Component({
  selector: 'app-crear-publicacion',
  templateUrl: './crear-publicacion.component.html',
  styleUrls: ['./crear-publicacion.component.css'],
  providers: [UserService, ApplicationService, ProvedorService],
})
export class CrearPublicacionComponent implements OnInit {
  public mymodel;
  public publicacion: Publicacion;
  public departamentos;
  public loading = false;
  public deptSelect;
  public municipios;
  public muncSelect;
  public medicos;
  public medcSelect;
  public categorias;
  myControl = new FormControl('', Validators.required);
  options: User[];
  filteredOptions: Observable<User[]>;
  public horasDesdeHastaManana;
  public horasDesdeHastaTarde;
  public diasH1;
  public diasH2;
  public diasH3;
  public ds = [];
  public mananaH1 = false;
  public mananaH2 = false;
  public mananaH3 = false;
  public tardeH1 = false;
  public tardeH2 = false;
  public tardeH3 = false;
  public horario2 = false;
  public horario3 = false;
  public btnHorario = true;
  public btnEliminarHorario = false;
  public disableH1;
  public disableH2;
  public mananaDesdeH1: any;
  public mananaHastaH1: any;
  public tardeDesdeH1: any;
  public tardeHastaH1: any;
  public mananaDesdeH2: any;
  public mananaHastaH2: any;
  public tardeDesdeH2: any;
  public tardeHastaH2: any;
  public mananaDesdeH3: any;
  public mananaHastaH3: any;
  public tardeDesdeH3: any;
  public tardeHastaH3: any;
  // Variable para almacenar el array de imagenes en base 64
  public imagenes = [];
  // base64textString;
  private datos: FormGroup;
  // Validacion select
  selectMedico = new FormControl('', Validators.required);
  selectDepartamento = new FormControl('', Validators.required);
  selectMunicipio = new FormControl('', Validators.required);
  // autCategoria = new FormControl('', Validators.required);
  numeroMaxCitas = new FormControl('', Validators.required);
  // Formulario con la informacion de la publicación
  public formulario = {};
  // variable para lanzar posibles errores de horarios
  public status: boolean;
  public textoStatus: string;
  public horarios: any;
  //  variable para lanzar posibles errores de imagenes
  public statusImgs = false;


  constructor(public _userService: UserService, public _aplicationService: ApplicationService, public _provedorService: ProvedorService,
    private formBuilder: FormBuilder) {
    // this.publicacion = new Publicacion('', '', '', null, '', null, null, '', '', '', null, '', '');
    this.mymodel = 'informacion';
    this.status = false;

    this.datos = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]],
      duracion : ['', [Validators.required, Validators.max(60), Validators.min(15), Validators.pattern('[0-9]*')]],
      precio: ['', [Validators.required, Validators.min(0), Validators.pattern('[0-9]*')]],
      descuento: ['', [Validators.max(100), Validators.min(10), Validators.pattern('[0-9]*')]],
      video : [''],
      direccion : ['', [Validators.required, Validators.maxLength(60)]],
      descripcion: ['', [Validators.required, Validators.minLength(40)]],
      // check: [false, [Validators.requiredTrue]],
    });
   }

  ngOnInit() {

    this.getDepartamento();
    this.getCategorias();
    this.getMedicos();
    this.horas();
    this.diasSemana();
  }

  // AUTOCOMPLETAR ---------------------------------------------


  displayFn(user?: User): string | undefined {
    return user ? user.nombre : undefined;
  }

  private _filter(nombre: string): User[] {
    const filterValue = nombre.toLowerCase();

    return this.options.filter(option => option.nombre.toLowerCase().indexOf(filterValue) > -1);
  }

  // ---------------------------------------------------------------


  pestana(pestana) {
    this.mymodel = pestana;

    var li = document.getElementById(this.mymodel);

    if (this.mymodel === 'informacion') {

        let l = document.getElementById('horarios');
        let l2 = document.getElementById('imagenes');

        l.className = 'list-group-item';
        l2.className = 'list-group-item';
        li.className = 'list-group-item active';
    }

    if (this.mymodel === 'horarios') {

        let l = document.getElementById('informacion');
        let l2 = document.getElementById('imagenes');

        l.className = 'list-group-item';
        l2.className = 'list-group-item';
        li.className = 'list-group-item active';
    }

    if (this.mymodel === 'imagenes') {

        let l = document.getElementById('informacion');
        let l2 = document.getElementById('horarios');

        l.className = 'list-group-item';
        l2.className = 'list-group-item';
        li.className = 'list-group-item active';
    }

  }


  // ------------------ Metodos para almacenar la información de la publciacion ------------

  siguienteInformacion() {

      if (this.myControl.value === '') {
        console.log('No hya categoria');
      } else if (this.selectMunicipio.value === '') {
        console.log('No hya municipio');
      } else if (this.selectMedico.value === '') {
        console.log('No hya medico');
      } else if (this.numeroMaxCitas.value === '') {
        console.log('No hya max citas');
      } else if (!this.datos.valid) {
        console.log('falta llenar lso datos');
      } else {
        this.pestana('horarios');
      }
  }

  atrasInformacion() {
    this.pestana('informacion');
  }

  siguienteHorarios(bol) {

    console.log(bol);
    let siguiente = true;

    switch (siguiente === true) {

      case (this.horario2 === false && this.horario3 === false):
      if (this.validacionesH1(bol) === true) {
        this.pestana('imagenes');
      }
      break;

      case (this.horario2 === true && this.horario3 === false):
      if (this.validacionesH2(bol) === true) {
        this.pestana('imagenes');
      }
      break;

      case (this.horario2 === true && this.horario3 === true):
      if (this.validacionesH3() === true) {
        this.pestana('imagenes');
      }
      break;

    }

  }

  getDepartamento() {

    this.loading = true;

    this._aplicationService.getDepartamento().subscribe( (res) => {
      // console.log(res);
      this.departamentos = res;
      this.loading = false;
    }, (err) => {
      this.loading = false;
      console.log(err);
    });
  }

  getMunicipio(id) {

    this.loading = true;
    this._aplicationService.getMunicipio(id).subscribe( (res) => {
      this.municipios = res;
      console.log(this.municipios);
      this.loading = false;
    }, (err) => {
      this.loading = false;
      console.log(err);
    });
  }

  // Metodo para obtener las categorias, y a travez de filterOptions hacer el autocomplete
  getCategorias() {
    this._aplicationService.getCategorias().subscribe( (res) => {
      this.options = res;
      console.log(this.options);

      this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | User>(''),
        map(value => typeof value === 'string' ? value : value.nombre),
        map(nombre => nombre ? this._filter(nombre) : this.options.slice())
      );
    }, (err) => {
      console.log(err);
    });
  }

  deparSelect(event) {
    this.getMunicipio(event.value);
  }

  muniSelect(event) {
    this.muncSelect = event.value;
  }

  // Metodo para obtener los medicos subscritos al provedor
  getMedicos() {
    let id = this._userService.getIdentity();
    id = id.id_provedor;

    this._provedorService.getMedicosProvedor(id).subscribe( (response) => {

      this.medicos = response;
      console.log(this.medicos);
    }, (err) => {
      console.log(err);
    } );
  }

  medicoSelect(event) {
    this.medcSelect = event.value;
  }

  checktManana(ev, h) {

    if (ev.checked === true && h === 'h1') {
      this.mananaH1 = true;
    }

    if (ev.checked === false && h === 'h1') {
      this.mananaH1 = false;
    }

    if (ev.checked === true && h === 'h2') {
      this.mananaH2 = true;
    }

    if (ev.checked === false && h === 'h2') {
      this.mananaH2 = false;
    }

    if (ev.checked === true && h === 'h3') {
      this.mananaH3 = true;
    }

    if (ev.checked === false && h === 'h3') {
      this.mananaH3 = false;
    }
  }

  checktTarde(ev, h) {
    if (ev.checked === true && h === 'h1') {
      this.tardeH1 = true;
    }

    if (ev.checked === false && h === 'h1') {
      this.tardeH1 = false;
    }

    if (ev.checked === true && h === 'h2') {
      this.tardeH2 = true;
    }

    if (ev.checked === false && h === 'h2') {
      this.tardeH2 = false;
    }

    if (ev.checked === true && h === 'h3') {
      this.tardeH3 = true;
    }

    if (ev.checked === false && h === 'h3') {
      this.tardeH3 = false;
    }
  }


  horas() {
    this.horasDesdeHastaManana = [
      { hora : '6 a.m', value : '6:00' },
      { hora : '7 a.m', value : '7:00' },
      { hora : '8 a.m', value : '8:00' },
      { hora : '9 a.m', value : '9:00' },
      { hora : '10 a.m', value : '10:00' },
      { hora : '11 a.m', value : '11:00' },
      { hora : '12 a.m', value : '12:00' },
    ];

    this.horasDesdeHastaTarde = [
      { hora : '1 p.m', value : '13:00' },
      { hora : '2 p.m', value : '14:00' },
      { hora : '3 p.m', value : '15:00' },
      { hora : '4 p.m', value : '16:00' },
      { hora : '5 p.m', value : '17:00' },
      { hora : '6 p.m', value : '18:00' },
      { hora : '7 p.m', value : '19:00' },
    ];
  }

  diasSemana() {
    let lunes = {nombre: 'lunes',  disponible: true};
    let martes = {nombre: 'martes', disponible: true};
    let miercoles = {nombre: 'miércoles', disponible: true};
    let jueves = {nombre: 'jueves', disponible: true};
    let viernes = {nombre: 'viernes', disponible: true};
    let sabado = {nombre: 'sábado', disponible: true};
    let domingo = {nombre: 'domingo', disponible: true};

    let days = [lunes, martes, miercoles, jueves, viernes, sabado, domingo];

    for ( var i = 0; i < days.length; i++) {
      let dia = days[i];
      this.ds.push({dia});
    }

  }

  mostrarHorario(bol) {
    console.log(bol);
    let mostrar = true;

    switch (mostrar === true) {
      case this.horario2 === false:
      this.validacionesH1(bol);
      break;

      case (this.horario2 === true && this.horario3 === false):
      this.status = false;
      this.validacionesH2(bol);
      break;
    }
  }


  eliminarHorario() {

    let bol = true;

    switch (bol === true) {

      case this.horario2 === true && this.horario3 === false:
      this.horario2 = false;
      this.btnEliminarHorario = false;
      this.enabledDiasH1();
      this.disableH1 = false;
      this.diasH2 = undefined;
      this.mananaDesdeH2 = undefined;
      this.mananaHastaH2 = undefined;
      this.tardeDesdeH2 = undefined;
      this.tardeHastaH2 = undefined;
      break;

      case this.horario2 === true && this.horario3 === true:
      this.horario3 = false;
      this.btnHorario = true;
      this.disableH2 = false;
      this.diasH3 = undefined;
      this.mananaDesdeH3 = undefined;
      this.mananaHastaH3 = undefined;
      this.tardeDesdeH3 = undefined;
      this.tardeHastaH3 = undefined;
      break;
    }

  }

  // desabilitar dias escogidos en el horario 1
  disabledDiasH1 () {

    console.log(this.diasH1);

   for (var i = 0; i < this.diasH1.length; i++) {
     var nombre = this.diasH1[i];

     for (var j = 0; j < this.ds.length; j++) {

      if (nombre === this.ds[j].dia.nombre) {
        this.ds[j].dia.disponible = false;
      }
     }

   }
  }

  // desabilitar dias escogidos en el horario 2
  disabledDiasH2 () {

    console.log(this.diasH1);

    for (var i = 0; i < this.diasH2.length; i++) {
      var nombre = this.diasH2[i];

      for (var j = 0; j < this.ds.length; j++) {

       if (nombre === this.ds[j].dia.nombre) {
         this.ds[j].dia.disponible = false;
       }
      }

    }
   }

   // habilitar dias horario 1 cuando se elimina el horario 2
   enabledDiasH1 () {
      for (var i = 0; i < this.diasH1.length; i++) {
        var nombre = this.diasH1[i];

      for (var j = 0; j < this.ds.length; j++) {

         if (nombre === this.ds[j].dia.nombre) {
           this.ds[j].dia.disponible = true;
         }
        }

      }

      console.log(this.ds);
   }

   // habilitar dias horario 2 cuando se elimina el horario 3
   enabledDiasH2 () {
    for (var i = 0; i < this.diasH3.length; i++) {
      var nombre = this.diasH3[i];

      for (var j = 0; j < this.ds.length; j++) {

       if (nombre === this.ds[j].dia.nombre) {
         this.ds[j].dia.disponible = true;
       }
      }
    }

    console.log(this.ds);

   }

  // Dias seleccionados en el horario 1
  diasHorario1(ev) {
    this.diasH1 = ev.value;
    console.log(this.diasH1);
  }

  // Dias seleccionados en el horario 2
  diasHorario2(ev) {
    this.diasH2 = ev.value;
    console.log(this.diasH2);
  }

  // Dias seleccionados en el horario 3
  diasHorario3(ev) {
    this.diasH3 = ev.value;
    console.log(this.diasH3);
  }

  horasHorarios(ev, info) {
    console.log(ev, info);

    // H1

    if (info === 'mdesde_h1') {
      // tslint:disable-next-line:radix
      this.mananaDesdeH1 = parseInt(ev.value);
      console.log(this.mananaDesdeH1);
    }

    if (info === 'mhasta_h1') {
      // tslint:disable-next-line:radix
      this.mananaHastaH1 = parseInt(ev.value);
      console.log(this.mananaHastaH1);
    }

    if (info === 'tdesde_h1') {
      // tslint:disable-next-line:radix
      this.tardeDesdeH1 = parseInt(ev.value);
      console.log(this.tardeDesdeH1);
    }

    if (info === 'thasta_h1') {
      // tslint:disable-next-line:radix
      this.tardeHastaH1 = parseInt(ev.value);
      console.log(this.tardeHastaH1);
    }

    // H2

    if (info === 'mdesde_h2') {
      // tslint:disable-next-line:radix
      this.mananaDesdeH2 = parseInt(ev.value);
    }

    if (info === 'mhasta_h2') {
      // tslint:disable-next-line:radix
      this.mananaHastaH2 = parseInt(ev.value);
    }

    if (info === 'tdesde_h2') {
      // tslint:disable-next-line:radix
      this.tardeDesdeH2 = parseInt(ev.value);
    }

    if (info === 'thasta_h2') {
      // tslint:disable-next-line:radix
      this.tardeHastaH2 = parseInt(ev.value);
    }


    // H3

    if (info === 'mdesde_h3') {
      // tslint:disable-next-line:radix
      this.mananaDesdeH3 = parseInt(ev.value);
    }

    if (info === 'mhasta_h3') {
      // tslint:disable-next-line:radix
      this.mananaHastaH3 = parseInt(ev.value);
    }

    if (info === 'tdesde_h3') {
      // tslint:disable-next-line:radix
      this.tardeDesdeH3 = parseInt(ev.value);
    }

    if (info === 'thasta_h3') {
      // tslint:disable-next-line:radix
      this.tardeHastaH3 = parseInt(ev.value);
    }
  }


  // Validaciones horario 1
  validacionesH1(bol): boolean {
  
    if (this.diasH1 === undefined) {
        this.status = true;
        this.textoStatus = 'Por favor completa los dias de atención en el horario 1.';
        return false;
    } else {

      let val = true;
    switch (val === true) {

      case (this.mananaH1 === true && this.tardeH1 === false) :
      if (this.mananaDesdeH1 === undefined || this.mananaHastaH1 === undefined) {
        this.status = true;
        this.textoStatus = 'Por favor completa una hora de inicio y terminación en la mañana del horario 1.';
        return false;
      } else {

        // Validacion de las horas de inicio y final
        if (this.mananaDesdeH1 > this.mananaHastaH1) {
          this.status = true;
          this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 1.';
          return false;
        } else {

          if ( bol === 'false' ) {
            this.horario2 = true;
             this.btnEliminarHorario = true;
             this.disabledDiasH1();
             this.disableH1 = true;
             return true;
            } else {
            return true;
          }

        }
      }
      break;

      case (this.mananaH1 === false && this.tardeH1 === true) :
      if (this.tardeDesdeH1 === undefined || this.tardeHastaH1 === undefined) {
          this.status = true;
          this.textoStatus = 'Por favor completa una hora de inicio y terminación en la tarde de el horario 1.';
          return false;
      } else {

        // Validacion de las horas de inicio y final
        if (this.tardeDesdeH1 > this.tardeHastaH1) {
          this.status = true;
          this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 1.';
          return false;
        } else {

          if ( bol === 'false' ) {
            this.horario2 = true;
             this.btnEliminarHorario = true;
             this.disabledDiasH1();
             this.disableH1 = true;
             return true;
            } else {
            return true;
          }

        }
      }
      break;

      case (this.mananaH1 === true && this.tardeH1 === true) :

      if (this.mananaDesdeH1 === undefined || this.mananaHastaH1 === undefined) {
        this.status = true;
        this.textoStatus = 'Por favor completa una hora de inicio y terminación en la mañana del horario 1.';
        return false;
      } else if (this.tardeDesdeH1 === undefined || this.tardeHastaH1 === undefined) {
        this.status = true;
        this.textoStatus = 'Por favor completa una hora de inicio y terminación en la tarde del horario 1.';
        return false;
      } else {

        // Validacion de las horas de inicio y final
        if (this.mananaDesdeH1 > this.mananaHastaH1) {
          this.status = true;
          this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 1.';
          return false;
        } else if (this.tardeDesdeH1 > this.tardeHastaH1) {
          this.status = true;
          this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 1.';
          return false;
        } else {

          if ( bol === 'false' ) {
            this.horario2 = true;
             this.btnEliminarHorario = true;
             this.disabledDiasH1();
             this.disableH1 = true;
             return true;
            } else {
            return true;
          }
        }

      }
      break;

      case (this.mananaH1 === false && this.tardeH1 === false) :
      this.status = true;
      this.textoStatus = 'Por favor escoge el horario de atención en la mañana o en la tarde de acuerdo a la disponibilidad del servicio.';
      return false;
      break;
    }

    }
  }

  validacionesH2 (bol): boolean {

    console.log('aquiii');

    if (this.diasH2 === undefined) {
        this.status = true;
        this.textoStatus = 'Por favor completa los dias de atención en el horario 2.';
        return false;
    } else {

      let val = true;
    switch (val === true) {

      case (this.mananaH2 === true && this.tardeH2 === false) :
      if (this.mananaDesdeH2 === undefined || this.mananaHastaH2 === undefined) {
        this.status = true;
        this.textoStatus = 'Por favor completa una hora de inicio y terminación en la mañana del horario 2.';
        return false;
      } else {

        // Validacion de las horas de inicio y final
        if (this.mananaDesdeH2 > this.mananaHastaH2) {
          this.status = true;
          this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 2.';
          return false;
        } else {

          if (bol === 'false') {
            this.horario3 = true;
          this.btnHorario = false;
          this.disabledDiasH2();
          this.disableH2 = true;
          return true;
          } else {
            return true;
          }

        }
      }
      break;

      case (this.mananaH2 === false && this.tardeH2 === true) :
      if (this.tardeDesdeH2 === undefined || this.tardeHastaH2 === undefined) {
          this.status = true;
          this.textoStatus = 'Por favor completa una hora de inicio y terminación en la tarde de el horario 2.';
          return false;
      } else {

        // Validacion de las horas de inicio y final
        if (this.tardeDesdeH2 > this.tardeHastaH2) {
          this.status = true;
          this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 2.';
          return false;
        } else {

          if (bol === 'false') {
            this.horario3 = true;
          this.btnHorario = false;
          this.disabledDiasH2();
          this.disableH2 = true;
          return true;
          } else {
            return true;
          }

        }
      }
      break;

      case (this.mananaH2 === true && this.tardeH2 === true) :

      if (this.mananaDesdeH2 === undefined || this.mananaHastaH2 === undefined) {
        this.status = true;
        this.textoStatus = 'Por favor completa una hora de inicio y terminación en la mañana del horario 2.';
        return false;
      } else if (this.tardeDesdeH2 === undefined || this.tardeHastaH2 === undefined) {
        this.status = true;
        this.textoStatus = 'Por favor completa una hora de inicio y terminación en la tarde del horario 2.';
        return false;
      } else {
         // Validacion de las horas de inicio y final
         if (this.mananaDesdeH2 > this.mananaHastaH2) {
          this.status = true;
          this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 2.';
          return false;
        } else if (this.tardeDesdeH2 > this.tardeHastaH2) {
          this.status = true;
          this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 2.';
          return false;
        } else {

          if (bol === 'false') {
            this.horario3 = true;
          this.btnHorario = false;
          this.disabledDiasH2();
          this.disableH2 = true;
          return true;
          } else {
            return true;
          }
        }
      }
      break;

      case (this.mananaH2 === false && this.tardeH2 === false) :
      this.status = true;
      this.textoStatus = 'Por favor escoge el horario de atención en la mañana o en la tarde de acuerdo a la disponibilidad del servicio.';
      return false;
      break;
    }

    }
  }

  validacionesH3(): boolean {

    if (this.diasH3 === undefined) {
        this.status = true;
        this.textoStatus = 'Por favor completa los dias de atención en el horario 3.';
    } else {

      let val = true;
    switch (val === true) {

      case (this.mananaH3 === true && this.tardeH3 === false) :
      if (this.mananaDesdeH3 === undefined || this.mananaHastaH3 === undefined) {
        this.status = true;
        this.textoStatus = 'Por favor completa una hora de inicio y terminación en la mañana del horario 3.';
        return false;
      } else {

        // Validacion de las horas de inicio y final
        if (this.mananaDesdeH3 > this.mananaHastaH3) {
          this.status = true;
          this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 3.';
          return false;
        } else {
          // console.log('mañana bn h3');
          return true;
        }
      }
      break;

      case (this.mananaH3 === false && this.tardeH3 === true) :
      if (this.tardeDesdeH3 === undefined || this.tardeHastaH3 === undefined) {
        this.status = true;
        this.textoStatus = 'Por favor completa una hora de inicio y terminación en la tarde de el horario 3.';
        return false;
      } else {

        // Validacion de las horas de inicio y final
        if (this.tardeDesdeH3 > this.tardeHastaH3) {
          this.status = true;
          this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 3.';
          return false;
        } else {
          // console.log('tarde bn h3');
          return true;
        }
      }
      break;

      case (this.mananaH3 === true && this.tardeH3 === true) :

      if (this.mananaDesdeH3 === undefined || this.mananaHastaH3 === undefined) {
        this.status = true;
        this.textoStatus = 'Por favor completa una hora de inicio y terminación en la mañana del horario 3.';
        return false;
      } else if (this.tardeDesdeH3 === undefined || this.tardeHastaH3 === undefined) {
        this.status = true;
        this.textoStatus = 'Por favor completa una hora de inicio y terminación en la tarde del horario 3.';
        return false;
      } else {
         // Validacion de las horas de inicio y final
         if (this.mananaDesdeH3 > this.mananaHastaH3) {
          this.status = true;
          this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 3.';
          return false;
        } else if (this.tardeDesdeH3 > this.tardeHastaH3) {
          this.status = true;
          this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 3.';
          return false;
        } else {
          return true;
        }
      }
      break;

      case (this.mananaH3 === false && this.tardeH3 === false) :
      this.status = true;
      this.textoStatus = 'Por favor escoge el horario de atención en la mañana o en la tarde de acuerdo a la disponibilidad del servicio.';
      return false;
      break;
    }

    }
  }


  // ---------------------------------- CARGAR IMAGENES ------------------------

//   openGalery(event): void {
//     console.log(event);
//    if (event.target.files && event.target.files[0]) {
//        const file = event.target.files[0];

//        const reader = new FileReader();
//        reader.onload = e => this.imagenes.push({base64Image: reader.result});
//        reader.readAsDataURL(file);
//    }

//    console.log(this.imagenes);
//  }

openGalery(evt) {
  // console.log(evt);
  var files = evt.target.files;
  var file = files[0];

  // console.log(file.name.split('\.'));

  let validacionImagen = file.name.split('\.');
  let num = validacionImagen.length;

    for (var i = 0; i < validacionImagen.length; i++) {
      if (num = i) {
        var tipoImg = validacionImagen[i];
      }
    }

    if (tipoImg === 'png' || tipoImg === 'jpg' || tipoImg === 'jpeg') {
      console.log('si es imagen');

      if (files && file) {
        var reader = new FileReader();

        reader.onload = this._handleReaderLoaded.bind(this);

        reader.readAsBinaryString(file);
       }

    } else {
      this.statusImgs = true;
      this.textoStatus = 'Solo se admiten imagenes, Por favor selecciona una';
    }
}

_handleReaderLoaded(readerEvt) {
  var binaryString = readerEvt.target.result;
  // this.base64textString = btoa(binaryString);
  // console.log(btoa(binaryString));
  // console.log(this.base64textString);
  this.imagenes.push({base64Image: 'data:image/jpeg;base64,' + btoa(binaryString)});
  console.log(this.imagenes);
 }

 borrarFoto(i) {
  this.imagenes.splice(i, 1);
 }

 atrasImagenes() {
   this.pestana('horarios');
 }


 /////////////////////////////// PUBLICAR SERVICIO ///////////////////////////////////////

 publicarServicio() {
   if (this.imagenes.length <= 0) {
    this.statusImgs = true;
    this.textoStatus = 'Por favor selecciona al menos una imagen';
   } else {

    let token = this._userService.getToken();
    let user = this._userService.getIdentity();


      let h1 = { m_de: this.mananaDesdeH1, m_hasta: this.mananaHastaH1, t_de: this.tardeDesdeH1 ,
        t_hasta: this.tardeHastaH1 , semana : this.diasH1};
      let h2 = { m_de: this.mananaDesdeH2, m_hasta: this.mananaHastaH2, t_de: this.tardeDesdeH2 ,
                t_hasta: this.tardeHastaH2 , semana : this.diasH2};
      let h3 = { m_de: this.mananaDesdeH3, m_hasta: this.mananaHastaH3, t_de: this.tardeDesdeH3 ,
                t_hasta: this.tardeHastaH3 , semana : this.diasH3};
      let horario = [h1, h2, h3];
      let h4 = {horario: horario};
      let horarios = [h4];

    this.formulario = {id_usuario: user.id_provedor, token: token, nombre: this.datos.value.nombre,
    precio: this.datos.value.precio, direccion: this.datos.value.direccion, imagenes: this.imagenes,
    descuento: this.datos.value.descuento, duracion: this.datos.value.duracion,
    id_mncp: this.selectMunicipio.value, id_ctga: this.myControl.value.id_categoria, video : this.datos.value.video,
    max_citas: this.numeroMaxCitas.value, descripcion: this.datos.value.descripcion, medico_id: this.selectMedico.value, horarios};

      console.log(this.formulario);

      this._provedorService.pubService(this.formulario).subscribe( (res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });
   }
 }


  }

