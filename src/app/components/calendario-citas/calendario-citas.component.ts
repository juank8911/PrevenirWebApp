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
  // serviciosSelect = new FormControl ('');
  serviciosSelect;
  nombre = new FormControl('', [Validators.required, Validators.pattern('[A-Za-z]')]);
  apellidos = new FormControl('', [Validators.required, Validators.pattern('[A-Za-z]')]);
  identificacion = new FormControl('', [Validators.required, Validators.min(6), Validators.pattern('[0-9]*')]);
  cedula = new FormControl('', [Validators.required, Validators.min(6), Validators.pattern('[0-9]*')]);
  fechaNacimiento = new FormControl('', Validators.required);
  telefono = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
  servicios: any;
  datosUser = {nombre: '', apellidos: '', cedula: '', fecha_nacimiento: '', telefono: ''};
  existe: boolean;
  mostrar = false;

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

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log(date);
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

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


    // this.events = [
    //   ...this.events,
    //   {
    //     title: titulo,
    //     start: startOfDay(new Date()),
    //     end: endOfDay(new Date()),
    //     color: colors.red,
    //     draggable: true,
    //     resizable: {
    //       beforeStart: true,
    //       afterEnd: true
    //     }
    //   }
    // ];
  }

  cita(html) {
    console.log(html);
    if (html) {
      console.log('aqui');
    }
  }

  hourSegmentClicked(ev) {

    this.nombre.reset();
    this.apellidos.reset();
    this.identificacion.reset();
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
    console.log(this.dia);
    document.getElementById('openModalButton').click();


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
    console.log(this.cedula.value);

    this.mostrar = false;
    this._provedorService.cedula(this.cedula.value, false).subscribe( (response) => {
      console.log(response);
      if (response === false) {
        // this.valdiacionesExiste();
        this.existe = false;
        this.mostrar = true;
        this.datosUser = {nombre: '', apellidos: '', cedula: '', fecha_nacimiento: '', telefono: ''};
      } else {
        this.datosUser = response[0];
        this.existe = true;
        this.mostrar = true;
      }
    }, (err) => {
      console.log(err);
    });
  }

  serviciosSelecionado(ev) {
    console.log(ev);
    this.serviciosSelect = ev;
    console.log(this.serviciosSelect.value.nombre);

  }

  // valdiacionesExiste() {
  //   console.log(this.datosUser);
  //   this.datos = this.formBuilder.group({
  //     nombres: [this.datosUser.nombre , [Validators.required, Validators.minLength(4),
  //               Validators.maxLength(60), Validators.pattern('[A-Za-z]')]],
  //     apellidos : [ this.datosUser.apellidos , [Validators.required, Validators.max(60), Validators.min(15),
  //                   Validators.pattern('[A-Za-z]')]],
  //     fecha: [this.datosUser.fecha_nacimiento],
  //     telefono: [this.datosUser.telefono , [Validators.max(15), Validators.min(7), Validators.pattern('[0-9]*')]],
  //   });
  // }

  // valdiacionesExiste() {
  //   this.datos = this.formBuilder.group({
  //     nombres: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60), Validators.pattern('[A-Za-z]')]],
  //     apellidos : ['', [Validators.required, Validators.max(60), Validators.min(15), Validators.pattern('[A-Za-z]')]],
  //     fecha: [''],
  //     telefono: ['', [Validators.max(15), Validators.min(7), Validators.pattern('[0-9]*')]],
  //   });
  // }

}
