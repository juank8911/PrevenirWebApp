import { Component, OnInit } from '@angular/core';

import {
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarMonthViewDay
} from 'angular-calendar';

import * as moment from 'moment';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

// Validaciones
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';

// Servicios
import { ApplicationService } from '../../services/app.service';
import { UserService } from '../../services/user.service';
import { ProvedorService } from '../../services/provedor.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-calendario-citas',
  templateUrl: './calendario-citas.component.html',
  styleUrls: ['./calendario-citas.component.css'],
  providers : [ApplicationService, UserService]
})
export class CalendarioCitasComponent implements OnInit {

  // Variables calendario
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  selectedMonthViewDay: CalendarMonthViewDay;
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  activeDayIsOpen = false;

  // Variables App
  title = 'cal';
  locale = 'es';
  md = false;
  ced: string;
  dia = {};
  days;
  serviciosSelect;
  servicios: any;
  datosUser = {nombre: '', apellidos: '', cedula: '', fecha_nacimiento: '', telefono: '', id : null};
  existe: string;
  mostrar: any;
  horarioCita;
  botonDisabled = false;
  mascotas: string;
  mascotaSlt;
  information;
  status;
  statusText;

  // FormsControls
  nombre = new FormControl('', [Validators.required, Validators.pattern('[A-Z a-z]*')]);
  apellidos = new FormControl('', [Validators.required, Validators.pattern('[A-Z a-z]*')]);
  cedula = new FormControl('', [Validators.required, Validators.min(6), Validators.pattern('[0-9]*')]);
  fechaNacimiento = new FormControl('', Validators.required);
  telefono = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
  nombreMascota = new FormControl('', [Validators.required, Validators.pattern('[A-Z a-z]*')]);
  especieMascota = new FormControl('', [Validators.required, Validators.pattern('[A-Z a-z]*')]);
  raza = new FormControl('', [Validators.required, Validators.pattern('[A-Z a-z]*')]);
  color = new FormControl('', Validators.pattern('[A-Z a-z]*'));
  fechaNacimientoMascota =  new FormControl('', Validators.required);
  esterilizado = new FormControl('', Validators.required);
  sexoMascota = new FormControl('', Validators.required);
  peludito = new FormControl('', Validators.required);

  constructor(private formBuilder: FormBuilder, private _aplicatioService: ApplicationService, private _userService: UserService,
              private _provedorService: ProvedorService) {

  }

  ngOnInit() {
    this.getPublicacionesProvedor();
  }

  getPublicacionesProvedor() {

    let identity = this._userService.getIdentity();
    this._aplicatioService.getPublicacionesProveedor(identity.id_provedor).subscribe( (response) => {
        this.servicios = response;
        console.log(this.servicios);
    }, (err) => {
      console.log(err);
    });
  }

  adelante() {
    this.activeDayIsOpen = false;
  }

  hoy() {
    this.activeDayIsOpen = false;
    console.log(this.events);
  }

  atras() {
    this.activeDayIsOpen = false;
  }

  dayClicked(dia) {
    console.log(dia.day.isPast);
    if (dia.day.isPast === true) {
      console.log('es un dia pasado');
    } else {
      this.viewDate = dia.day.date;
      this.view = CalendarView.Day;

    }
  }


  // dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
  //   console.log(date);
  //   if (isSameMonth(date, this.viewDate)) {
  //     this.viewDate = date;
  //     if (
  //       (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
  //       events.length === 0
  //     ) {
  //       this.activeDayIsOpen = false;
  //     } else {
  //       this.activeDayIsOpen = true;
  //     }
  //   }
  // }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    console.log('aqui');
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {

    console.log(action, event);
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
    this. activeDayIsOpen = false;
  }

  setView(view: CalendarView) {
    this.view = view;
  }


  closeOpenMonthViewDay() {
    this.activeDayIsOpen = true;
  }

  agregarCita() {

    console.log('aqui agregar cita');

    if (this.existe === 'false') {

      // if (!this.apellidos.valid) {
      //   console.log('apellido invalido');
      // } else if (!this.telefono.valid) {
      //   console.log('telefono invalido');
      // } else if (!this.fechaNacimiento.value) {
      //   console.log('fecha nacimiento invalido');
      // } else if (!this.nombre.valid) {
      //   console.log('nombre invalido');
      // }
      // cedula

      let date = moment(this.horarioCita).format('YYYY-M-DD') + ' ' + moment(this.horarioCita).format('h:mm:ss a');
      let datos = {  apellidos: this.apellidos.value, color : '#07a9df', existe : false, mascota: undefined,
                     servicio : this.serviciosSelect.value.id_servicios, fecha_nacimiento: this.fechaNacimiento.value,
                     start: date, contacto: this.telefono.value, nombres: this.nombre.value, usuario: this.cedula.value};

      console.log(datos);

    } else {

      let date = moment(this.horarioCita).format('YYYY-M-DD') + ' ' + moment(this.horarioCita).format('h:mm:ss a');
      let datos = { color : '#07a9df', existe : true, mascota: undefined, servicio : this.serviciosSelect.value.id_servicios,
                    start: date, usuario: this.datosUser.id};

      console.log(datos);
    }

     //  this.events = [
    //   ...this.events,
    //   {
    //     title: 'evento desde click',
    //     start: ev.date,
    //     end: ev.date,
    //     color: colors.red,
    //     draggable: true,
    //     resizable: {
    //       beforeStart: true,
    //       afterEnd: true
    //     }
    //   }
    // ];
  }

  hourSegmentClicked(ev) {


    // let today = moment(new Date().toISOString()).format('YYYY-M-DD HH:mm:ss');
    // let today2 = moment(today);
    // let f = moment(ev.date).format('YYYY-MM-DD HH:mm:ss ');
    // let st = moment(f);
    // let hours = st.diff(today2, 'days');
    console.log(ev);

    if (new Date() < ev.date) {
      // console.log('es futuro');

      this.horarioCita = ev.date;
      this.nombre.reset();
      this.apellidos.reset();
      // this.identificacion.reset();
      this.fechaNacimiento.reset();
      this.telefono.reset();
      this.cedula.reset();
      this.mostrar = false;
      let date = ev.date.toString();
      date = date.split(' ');
      date = date[0];
      // console.log(this.dias(date));
      // console.log(moment(ev.date).format('DD-MM-YYYY'));
      // console.log(moment(ev.date).format('h:mm:ss a'));
      this.dia = {dia: this.dias(date), fecha: moment(ev.date).format('DD-MM-YYYY'), hora: moment(ev.date).format('h:mm:ss a')};
      // console.log(this.dia);
      this.horarios(this.dias(date));

    } else {
      console.log('es pasado');
      this.status = true;
      this.statusText = 'No puedes elegir una hora o fecha que ya paso, por favor escoge otro horario';
      window.scroll(0, 0);
    }

  }

  horarios(dia) {

    let date = moment(this.horarioCita).format('YYYY-MM-D');
    var hora = moment(this.horarioCita).format('h:mm:ss a').toString();
    var h = hora.split(' ');
    var horaInicio;
    var horaFinal;

    console.log(h[1]);

    // console.log(date, this.serviciosSelect.value.id_servicios, this.serviciosSelect.value.id_categoria);
    this._provedorService.getHorario(date, this.serviciosSelect.value.id_servicios, this.serviciosSelect.value.id_categoria).
        subscribe((response) => {
          console.log(response);
          this.information = response;

        let bol = true;

        switch (bol === true) {
          case (this.information[0].maniana.length <= 1) && (this.information[1].tardes.length <= 1):

          this.status = true;
          this.statusText = 'El dia ' + dia + ' no tienes ningun horario de atencion.' ;

          break;

          case (this.information[0].maniana.length <= 1) && (this.information[1].tardes.length >= 1):
          console.log('Solo horario en la tarde');
          if (h[1] === 'am') {
            this.status = true;
            this.statusText = 'El dia ' + dia + ' Solo tienes horario en la tarde.';
            window.scroll(0, 0);
          } else {

            let num = this.information[1].tardes.length;
            horaInicio = this.information[1].tardes[0].hora;
            var coincide;

            for (let i = 0; i < this.information[1].tardes.length; i++) {

              if( parseInt(hora) === parseInt(this.information[1].tardes[i].hora)  ) {
                console.log('coincide', hora, this.information[1].tardes[i].hora);
                coincide = true;

                if ( this.information[1].tardes[i].disponible === true ) {
                  // console.log('puede sacar cita');
                  document.getElementById('openModalButton').click();

                } else {
                  this.status = true;
                  this.statusText = 'horario lleno no puede sacar cita a las ' + this.information[0].maniana[i].hora
                                    + ', por favor intenta en otra hora';

                }
              } else {
                coincide = false;
              }

              if (coincide === true) {
                break;
              }

              if (num = this.information[1].tardes.length) {
                horaFinal = this.information[1].tardes[i].hora;
              }
            }

            // console.log(horaInicio, horaFinal);

            if (coincide === false) {
              this.status = true;
              this.statusText = 'No se puede sacar cita por fuera del horario de atención de este servicio de '  + horaInicio + ' - '
              + horaFinal + ', por favor escoge otro horario';
              window.scroll(0, 0);
            }


          }

          break;

          case (this.information[0].maniana.length >= 1) && (this.information[1].tardes.length <= 1):
          console.log('Solo horario en la mañana');

          if (h[1] === 'am') {

            let num = this.information[0].maniana.length;
            horaInicio = this.information[0].maniana[0].hora;
            var coincide;

            for (let i = 0; i < this.information[0].maniana.length; i++) {

              if( parseInt(hora) === parseInt(this.information[0].maniana[i].hora)  ) {
                // console.log('coincide', hora, this.information[0].maniana[i].hora);
                coincide = true;

                if ( this.information[0].maniana[i].disponible === true ) {
                  // console.log('puede sacar cita');
                  document.getElementById('openModalButton').click();

                } else {
                  this.status = true;
                  this.statusText = 'horario lleno no puede sacar cita a las ' + this.information[0].maniana[i].hora
                                    + ', por favor intenta en otra hora';

                }
              } else {
                coincide = false;
              }

              if (coincide === true) {
                break;
              }

              if (num = this.information[0].maniana.length) {
                horaFinal = this.information[0].maniana[i].hora;
              }
            }

            // console.log(horaInicio, horaFinal);

            if (coincide === false) {
               this.status = true;
               this.statusText = 'No se puede sacar cita por fuera del horario de atención de este servicio de '  + horaInicio + ' - ' 
               + horaFinal + ', por favor escoge otro horario';
               window.scroll(0, 0);
            }


          } else {
            this.status = true;
            this.statusText = 'El dia ' + dia + ' Solo tienes horario en la mañana.';
            window.scroll(0, 0);
          }
          break;

          case (this.information[0].maniana.length >= 1) && (this.information[1].tardes.length >= 1):
          console.log('horario todo el dia');

          horaInicio = this.information[0].maniana[0].hora;

          if (h[1] === 'am') {

            let num = this.information[0].maniana.length;
            horaInicio = this.information[0].maniana[0].hora;
            var coincide;

            for (let i = 0; i < this.information[0].maniana.length; i++) {

              if( parseInt(hora) === parseInt(this.information[0].maniana[i].hora)  ) {
                // console.log('coincide', hora, this.information[0].maniana[i].hora);
                coincide = true;

                if ( this.information[0].maniana[i].disponible === true ) {
                  // console.log('puede sacar cita');
                  document.getElementById('openModalButton').click();

                } else {
                  this.status = true;
                  this.statusText = 'horario lleno no puede sacar cita a las ' + this.information[0].maniana[i].hora
                                    + ', por favor intenta en otra hora';

                }
              } else {
                coincide = false;
              }

              if (coincide === true) {
                break;
              }

              if (num = this.information[0].maniana.length) {
                horaFinal = this.information[0].maniana[i].hora;
              }
            }

            // console.log(horaInicio, horaFinal);

            if (coincide === false) {
               this.status = true;
               this.statusText = 'No se puede sacar cita por fuera del horario de atención de este servicio de'  + horaInicio + ' - '
               + horaFinal + ', por favor escoge otro horario';
               window.scroll(0, 0);
            }

          } else {

            let num = this.information[1].tardes.length;
            horaInicio = this.information[1].tardes[0].hora;
            var coincide;

            for (let i = 0; i < this.information[1].tardes.length; i++) {

              if( parseInt(hora) === parseInt(this.information[1].tardes[i].hora)  ) {
                console.log('coincide', hora, this.information[1].tardes[i].hora);
                coincide = true;

                if ( this.information[1].tardes[i].disponible === true ) {
                  // console.log('puede sacar cita');
                  document.getElementById('openModalButton').click();

                } else {
                  this.status = true;
                  this.statusText = 'horario lleno no puede sacar cita a las ' + this.information[0].maniana[i].hora
                                    + ', por favor intenta en otra hora';

                }
              } else {
                coincide = false;
              }

              if (coincide === true) {
                break;
              }

              if (num = this.information[1].tardes.length) {
                horaFinal = this.information[1].tardes[i].hora;
              }
            }

            // console.log(horaInicio, horaFinal);

            if (coincide === false) {
              this.status = true;
              this.statusText = 'No se puede sacar cita por fuera del horario de atención de este servicio de '  + horaInicio + ' - '
              + horaFinal + ', por favor escoge otro horario';
              window.scroll(0, 0);
            }

          }
          break;
        }

        }, (err) => {
          console.log(err);
        });

  }

  dias(dia): string {

    let bol = true;
    switch (bol === true) {

      case (dia === 'Mon'):
      return 'Lunes';
      break;

      case (dia === 'Sun'):
      return 'Domingo';
      break;

      case (dia === 'Tue'):
      return 'Martes';
      break;

      case (dia === 'Wed'):
      return 'Miércoles';
      break;

      case (dia === 'Thu'):
      return 'Jueves';
      break;

      case (dia === 'Fri'):
      return 'Viernes';
      break;

      case (dia === 'Sat'):
      return 'Sabado';
      break;
    }
  }

  buscarCedula() {
    // console.log(this.cedula.value);

    if (this.serviciosSelect.value.id_categoria === 20) {
      this.mostrar = false;
      this.existe = undefined;
      this.peludito.reset();
      this.mascotaSlt = undefined;
      this._provedorService.cedula(this.cedula.value, true).subscribe( (response) => {
        console.log(response);
        if (response === false) {
          this.mostrar = true;
          this.mascotas = 'false';
          this.datosUser.cedula = this.cedula.value;
        } else {
          this.mostrar = true;
          this.mascotas = 'true';
          this.datosUser = response[0];
          console.log(this.datosUser);
        }
      }, (err) => {
        console.log(err);
      });

    } else {

      this.mostrar = false;
      this.mascotas = undefined;
      this._provedorService.cedula(this.cedula.value, false).subscribe( (response) => {
      // console.log(response);
      if (response === false) {
        // this.valdiacionesExiste();
        this.existe = 'false';
        this.mostrar = true;
        this.datosUser = {nombre: '', apellidos: '', cedula: this.cedula.value, fecha_nacimiento: '', telefono: '', id: ''};
      } else {
        this.datosUser = response[0];
        this.existe = 'true';
        this.mostrar = true;
      }
    }, (err) => {
      console.log(err);
    });
    }
  }

  serviciosSelecionado(ev) {
    console.log(ev);
    this.serviciosSelect = ev;
    let date = new Date();
    this.viewDate = date;
    this.view = CalendarView.Month;
    // console.log(this.serviciosSelect.value.nombre);
  }

  mascotaSelect(ev) {
    console.log(ev.target.value);
    if (ev.target.value === 'agregarOtra') {
      this.mascotaSlt = ev.target.value;
    } else {
      this.mascotaSlt = ev.target.value;
    }

  }

  // metodo para agregar citas a servicios de veterianaria
  // parametro : tipo de cita, agregar, existe, nueva.
  agregarCitaMascota(tipo) {

    var date = moment(this.horarioCita).format('YYYY-M-DD') + ' ' + moment(this.horarioCita).format('h:mm:ss a');

    if (tipo === 'agregar') {
      let datos = {apellidos : this.datosUser.apellidos, color : '#07a9df', colorMascota : this.color.value,
                   contacto : this.datosUser.telefono , especie: this.especieMascota.value, esterilizado: this.esterilizado.value,
                   existe : true , existem : false, fecha_nacimiento : this.fechaNacimientoMascota.value, mascota : true,
                   nombreMascota : this.nombreMascota.value, nombres : this.datosUser.nombre, raza : this.raza.value,
                   servicio : this.serviciosSelect.value.id_servicios, sexo : this.sexoMascota.value, start : date,
                   usuario : this.datosUser.id};

      console.log(datos);
    }

    if (tipo === 'existe') {
      // tslint:disable-next-line:radix
      let id_mascota = parseInt(this.peludito.value);
      let datos = {apellidos: this.datosUser.apellidos, color: '#07a9df', contacto: this.datosUser.telefono, existe: true, existem: true,
                   id_mascota: id_mascota , mascota: true, nombres: this.datosUser.nombre,
                   servicio: this.serviciosSelect.value.id_servicios, start : date, usuario: this.datosUser.id};
      console.log(datos);

    }

    if (tipo === 'nueva') {
      let datos = {apellidos: this.apellidos.value, color : '#07a9df', contacto: this.telefono.value, especie: this.especieMascota.value,
                   esterilizado : this.esterilizado.value, existe : false, mascota : true, nombreMascota: this.nombreMascota.value,
                   nombres : this.nombre.value, servicio : this.serviciosSelect.value.id_servicios, sexo : this.sexoMascota.value,
                   start : date, usuario : this.datosUser.cedula};
      console.log(datos);
    }
  }

  cerrarAlerta() {
    this.status = false;
  }
}
