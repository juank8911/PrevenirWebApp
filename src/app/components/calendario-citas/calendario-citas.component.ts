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
  }, prevenir: {
    primary: '#00AEEF',
    secondary: '#75c6e6'
  }
};

// Validaciones
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';

// Servicios
import { ApplicationService } from '../../services/app.service';
import { UserService } from '../../services/user.service';
import { ProvedorService } from '../../services/provedor.service';
import { MedicoService } from '../../services/medico.service';
// import { start } from 'repl';

@Component({
  selector: 'app-calendario-citas',
  templateUrl: './calendario-citas.component.html',
  styleUrls: ['./calendario-citas.component.css'],
  providers : [ApplicationService, UserService, MedicoService]
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
  statusT;
  statusText;
  public loading = false;
  info;
  mascota: any = false;
  eliminar = false;
  public medico;

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
              private _provedorService: ProvedorService, private _medicoService: MedicoService) {

  }

  ngOnInit() {

    let identity = this._userService.getIdentity().medico_id;
    if (identity !== undefined) {
      this.medico = true;
      this.getEventos();
    } else {
      this.medico = false;
      this.getPublicacionesProvedor();
    }

  }

  getPublicacionesProvedor() {
    this.loading = true;
    let identity = this._userService.getIdentity();
    this._aplicatioService.getPublicacionesProveedor(identity.id_provedor).subscribe( (response) => {
      this.loading = false;
      if (response[0].vacio === true) {
        console.log('vacio');
      } else {
        this.servicios = response;
        // console.log(this.servicios);
      }

    }, (err) => {
      this.status = true;
            this.statusText = 'Error en la conexión, intentalo mas tarde o revisa tu conexión.';
      this.loading = false;
      console.log(err);
    });
  }


  getServiciosMedico(id) {
    this._medicoService.getServicios(id).subscribe( (response) => {
      console.log(response);
      this.loading = false;
    }, (err) => {
      console.log(err);
      this.loading = false;
    });
  }

  // adelante() {
  //   this.activeDayIsOpen = false;
  // }

  // hoy() {
  //   this.activeDayIsOpen = false;
  //   // console.log(this.events);
  // }

  // atras() {
  //   this.activeDayIsOpen = false;
  // }

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

  // eventTimesChanged({
  //   event,
  //   newStart,
  //   newEnd
  // }: CalendarEventTimesChangedEvent): void {
  //   console.log('aqui');
  //   this.events = this.events.map(iEvent => {
  //     if (iEvent === event) {
  //       return {
  //         ...event,
  //         start: newStart,
  //         end: newEnd
  //       };
  //     }
  //     return iEvent;
  //   });
  //   // this.handleEvent('Dropped or resized', event);
  // }


  // Metodo pcuando se clikea un evento
  handleEvent(action: string, event: CalendarEvent): void {

    // console.log(action, event);
    this.eliminar = false;
    this.info = event.id;
    this.status = false;
    this.statusT = false;

    if (this.info.tipo === 'mascota') {
      this._provedorService.getMascotaInfo(this.info.id).subscribe((response) => {
        this.mascota = response[0];
        this.mascota.dueno = this.mascota.dueño;
        this.mascota.id_eventos = this.info.id_eventos;
        console.log(this.mascota);
      }, (err) => {
        console.log(err);
      });
      document.getElementById('btn-modal-evento').click();
    } else {
      this.mascota = false;
      document.getElementById('btn-modal-evento').click();
    }

  }

  addEvent(title, start, end, horaInicio, horaFinal, info): void {
    // console.log('aqui');
    this.events = [
      ...this.events,
      {
        title: title,
        start:  addHours(startOfDay(start), horaInicio),
        end:  addHours(startOfDay(end), horaFinal),
        color: colors.prevenir,
        id : info,
        draggable: false,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];


    // this.events = [
    //   ...this.events,
    //   {
    //     title: 'New event',
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


    console.log(this.events);
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
    this. activeDayIsOpen = false;
  }

  setView(view: CalendarView) {
    this.view = view;
  }


  agregarCita() {
    this.status = null;
    this.statusT = null;
    this.loading = true;
    var token = this._userService.getToken();

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
      this.loading = true;
      this._provedorService.postCitasProvedor(datos, token).subscribe ((response) => {
        console.log(response);
        this.loading = false;
        if (response[0].agregado !== undefined && response[0].agregado === true) {
            this.getEventos();
            this.statusT = true;
            this.statusText = 'Cita agregado con exito.';
            window.scroll(0, 0);
            this.loading = false;
        } else {
            this.status = true;
            this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
            window.scroll(0, 0);
            this.loading = false;
        }

        if (response[0].reservado !== undefined && response[0].reservado === true) {
          this.status = true;
          this.statusText = 'No se puede sacar la cita, el usuario ' + this.nombre.value + ' '
                             + this.apellidos.value + ' ya tiene una cita reservada para este dia.';
          window.scroll(0, 0);
          this.loading = false;
        }
      }, (err) => {
        console.log(err);
        this.status = true;
        this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
        window.scroll(0, 0);
        this.loading = false;
      });

    } else {

      let date = moment(this.horarioCita).format('YYYY-M-DD') + ' ' + moment(this.horarioCita).format('h:mm:ss a');
      let datos = { color : '#07a9df', existe : true, mascota: undefined, servicio : this.serviciosSelect.value.id_servicios,
                    start: date, usuario: this.datosUser.id};

      console.log(datos);
      this._provedorService.postCitasProvedor(datos, token).subscribe ((response) => {
        console.log(response);
        if ( response[0].agregado !== undefined && response[0].agregado === true) {
            this.getEventos();
            this.statusT = true;
            this.statusText = 'Cita agregado con exito.';
            window.scroll(0, 0);
            this.loading = false;
        } else {
            this.status = true;
            this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
            window.scroll(0, 0);
            this.loading = false;
        }

        if (response[0].reservado !== undefined && response[0].reservado === true) {
          this.status = true;
          this.statusText = 'No se puede sacar la cita, el usuario ' + this.datosUser.nombre + ' '
                          + this.datosUser.apellidos + ' ya tiene una cita reservada para este dia.';
          window.scroll(0, 0);
          this.loading = false;
        }
      }, (err) => {
        console.log(err);
        this.status = true;
        this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
        window.scroll(0, 0);
        this.loading = false;
      });

    }
  }

  hourSegmentClicked(ev) {

    if (this.medico === false) {
      window.scroll(0, 0);

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
  }

  horarios(dia) {

    this.loading = true;
    let date = moment(this.horarioCita).format('YYYY-MM-D');
    var hora = moment(this.horarioCita).format('h:mm:ss a').toString();
    console.log(hora);
    var h = hora.split(' ');
    var horaInicio;
    var horaFinal;

    console.log(h[1]);

    // console.log(date, this.serviciosSelect.value.id_servicios, this.serviciosSelect.value.id_categoria);
    this._provedorService.getHorario(date, this.serviciosSelect.value.id_servicios, this.serviciosSelect.value.id_categoria).
        subscribe((response) => {
          console.log('horariosssssss');
          console.log(response);
          this.information = response;
          this.loading = false;
        let bol = true;

        switch (bol === true) {
          case (this.information[0].maniana.length <= 1) && (this.information[1].tardes.length <= 1):

          this.status = true;
          this.statusText = 'El dia ' + dia + ' no tienes ningun horario de atencion.' ;
          window.scroll(0, 0);
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

              if (parseInt(hora) === parseInt(this.information[1].tardes[i].hora)  ) {
                console.log('coincide', hora, this.information[1].tardes[i].hora);
                coincide = true;

                if ( this.information[1].tardes[i].disponible === true ) {
                  // console.log('puede sacar cita');
                  document.getElementById('openModalButton').click();

                } else {
                  this.status = true;
                  this.statusText = 'horario lleno no puede sacar cita a las ' + this.information[1].tardes[i]
                                    + ', por favor intenta en otra hora';
                                    window.scroll(0, 0);
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

          this.loading = false;
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
                  window.scroll(0, 0);
                }
              } else {
                coincide = false;
              }

              if (coincide === true) {
                this.loading = false;
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
          this.loading = false;
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
                  window.scroll(0, 0);

                }
              } else {
                coincide = false;
              }

              if (coincide === true) {
                this.loading = false;
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
                  this.statusText = 'horario lleno no puede sacar cita a las ' + this.information[1].tardes[i].hora
                                    + ', por favor intenta en otra hora';

                }
              } else {
                coincide = false;
              }

              if (coincide === true) {
                this.loading = false;
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
          this.loading = false;
          break;
        }

        }, (err) => {
          this.loading = false;
          console.log(err);
          this.status = true;
          this.statusText = 'Error en la conexion, por favor revisa tu conexion o intentalo mas tarde.';
          window.scroll(0, 0);
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
    this.status = null;

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
          console.log('aqui');
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
      console.log(response);
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

    // console.log(ev);
    this.events = [];
    this.serviciosSelect = ev;
    let date = new Date();
    this.viewDate = date;
    this.view = CalendarView.Month;
    this.status = false;
    this.statusT = false;
    this.getEventos();

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
    window.scroll(0, 0);
    var date = moment(this.horarioCita).format('YYYY-M-DD') + ' ' + moment(this.horarioCita).format('h:mm:ss a');
    var token = this._userService.getToken();

    if (tipo === 'agregar') {
      let datos = {apellidos : this.datosUser.apellidos, color : '#07a9df', colorMascota : this.color.value,
                   contacto : this.datosUser.telefono , especie: this.especieMascota.value, esterilizado: this.esterilizado.value,
                   existe : true , existem : false, fecha_nacimiento : this.fechaNacimientoMascota.value, mascota : true,
                   nombreMascota : this.nombreMascota.value, nombres : this.datosUser.nombre, raza : this.raza.value,
                   servicio : this.serviciosSelect.value.id_servicios, sexo : this.sexoMascota.value, start : date,
                   usuario : this.datosUser.id};

      console.log(datos);
      this.loading = true;
      this._provedorService.postCitasProvedor(datos, token).subscribe ((response) => {
        console.log(response);

        if (response[0].agregado === true) {
            this.statusT = true;
            this.statusText = 'Cita agregado con exito.';
            this.getEventos();
            this.loading = false;
        } else {
            this.status = true;
            this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
            this.loading = false;
        }
      }, (err) => {
        this.status = true;
        this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
        this.loading = false;
        console.log(err);
      });
    }

    if (tipo === 'existe') {
      // tslint:disable-next-line:radix
      let id_mascota = parseInt(this.peludito.value);
      let datos = {apellidos: this.datosUser.apellidos, color: '#07a9df', contacto: this.datosUser.telefono, existe: true, existem: true,
                   id_mascota: id_mascota , mascota: true, nombres: this.datosUser.nombre,
                   servicio: this.serviciosSelect.value.id_servicios, start : date, usuario: this.datosUser.id};
      console.log(datos);
      this.loading = true;
      this._provedorService.postCitasProvedor(datos, token).subscribe ((response) => {
        console.log(response);

        if (response[0].agregado === true) {
            this.statusT = true;
            this.statusText = 'Cita agregado con exito.';
            this.getEventos();
            this.loading = false;
        } else {
            this.status = true;
            this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
            this.loading = false;
        }
      }, (err) => {
        this.status = true;
        this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
        this.loading = false;
        console.log(err);
      });

    }

    if (tipo === 'nueva') {
      let datos = {apellidos: this.apellidos.value, color : '#07a9df', contacto: this.telefono.value, especie: this.especieMascota.value,
                   esterilizado : this.esterilizado.value, existe : false, mascota : true, nombreMascota: this.nombreMascota.value,
                   nombres : this.nombre.value, servicio : this.serviciosSelect.value.id_servicios, sexo : this.sexoMascota.value,
                   start : date, usuario : this.datosUser.cedula};
      console.log(datos);
      this.loading = true;
      this._provedorService.postCitasProvedor(datos, token).subscribe ((response) => {
        console.log(response);
        if (response[0].agregado === true) {
            this.statusT = true;
            this.statusText = 'Cita agregado con exito.';
            this.getEventos();
            this.loading = false;
        } else {
            this.status = true;
            this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
            this.loading = false;
        }
      }, (err) => {
        this.status = true;
            this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
        this.loading = false;
        console.log(err);
      });
    }
  }

  cerrarAlerta() {
    this.status = false;
    this.statusT = false;
  }

  getEventos () {
    console.log('aqui');
    this.events = [];
    let anio = moment(new Date).format('YYYY');
    let mes =  moment(new Date).format('M');
    var id_servicios;
    var id_categoria;

    if (this.medico === true) {
        let inf = localStorage.getItem('calendar-medico');
        let jinf = JSON.parse(inf);
        id_servicios = jinf.id_servicios;
        id_categoria = jinf.id_categoria;
    } else {
      id_servicios = this.serviciosSelect.value.id_servicios;
      id_categoria =  this.serviciosSelect.value.id_categoria;
    }


    // console.log(this.serviciosSelect);
    // console.log(anio, mes);

    this._provedorService.getEventos(mes, anio, id_servicios , id_categoria)
        .subscribe( (response) => {
          console.log('aqui 2, eventos');
          console.log(response);
          var respuesta = response;

          if (respuesta.length <= 0) {
            console.log('no hay eventos');
          }  else {
            var d;
            for (let i = 0; i < respuesta.length; i++) {

              let title = respuesta[i].title;

              let diaS = moment(respuesta[i].start).format('ddd');
              let mesS = moment(respuesta[i].start).format('MMM');
              let fechaS = moment(respuesta[i].start).format('DD-YYYY');
              let horaS = moment.utc(respuesta[i].start).format('h:mm:ss');
              let horaSs = moment.utc(respuesta[i].start).format('H');
              let start = diaS + ' ' + mesS + ' ' + fechaS + ' ' +  horaS;
              // d = horaS;

              let diaE = moment(respuesta[i].end).format('ddd');
              let mesE = moment(respuesta[i].end).format('MMM');
              let fechaE = moment(respuesta[i].end).format('DD-YYYY');
              let horaE = moment.utc(respuesta[i].end).format('h:mm:ss');
              let horaEe = moment.utc(respuesta[i].end).format('H');

              let end = diaE + ' ' + mesE + ' ' + fechaE + ' ' +  horaE;
              let id_eventos = respuesta[i].id_eventos;
              let info = {};


              if (respuesta[i].id_mascotas) {

              let id_usuarios = respuesta[i].id_usuarios;
              let color = respuesta[i].color;
              let especie = respuesta[i].especie;
              let esterilizado = respuesta[i].esterilizado;
              let fecha_nacimineto = respuesta[i].fecha_nacimineto;
              let nombre = respuesta[i].nombre ;
              let raza = respuesta[i].raza;
              let sexo = respuesta[i].sexo;
              let avatar = response[i].avatar;

                 info = {id : respuesta[i].id_mascotas , tipo : 'mascota' , id_usuarios : id_usuarios, color: color , especie: especie,
                 esterilizado : esterilizado, fecha_nacimineto : fecha_nacimineto, nombre: nombre, raza: raza, sexo: sexo, avatar: avatar,
                 id_eventos: id_eventos};
                 this.addEvent(title, start, end, horaSs, horaEe, info);
              } else {

              let apellidos = response[i].apellidos;
              let avatar = response[i].avatar;
              let cedula = response[i].cedula;
              let fecha_nacimiento = response[i].fecha_nacimiento;
              let nombre = response[i].nombre;
              let telefono = response[i].telefono;

                info = {id : respuesta[i].usuarios_id, tipo : 'usuario', apellidos : apellidos, avatar : avatar , cedula: cedula,
                        fecha_nacimiento: fecha_nacimiento, nombre: nombre, telefono: telefono, id_eventos: id_eventos} ;
                 this.addEvent(title, start, end, horaSs, horaEe, info);
              }

            }
            // console.log(d);
          }

          // this.addEvent();
        }, (err) => {
          console.log(err);
        });
  }

  eliminarCitaConfirmacion(bol) {
    this.eliminar = true;
  }

  cancelarEliminarCita() {
    this.eliminar = false;
  }

  eliminarCita(bol, id_eventos) {

    let token = this._userService.getToken();
    var usuarios_id;

    if (this.medico === true) {
      usuarios_id = this._userService.getIdentity().medico_id;
    } else {
      usuarios_id = this._userService.getIdentity().id_provedor;
    }

    if (bol === true ) {
      // es una mascota
        this._provedorService.dltCitaProvedor(id_eventos, usuarios_id, 20, token).subscribe( (response) => {
          console.log(response);
          if (response[0].borrado === true) {
            this.getEventos();
            this.statusT = true;
            this.statusText = 'La cita fue elimina con exito.';
            window.scroll(0 , 0);
          } else {
            this.status = true;
            this.statusText = 'La cita no se puede eliminar, por favor revisa tu conexión o intentalo más tarde.';
            window.scroll(0 , 0);
          }
        }, (err) => {
          console.log(err);
           this.status = true;
           this.statusText = 'La cita no se puede eliminar, por favor revisa tu conexión o intentalo más tarde.';
           window.scroll(0 , 0);
        });
    } else {
      // es un usuario
      this._provedorService.dltCitaProvedor(id_eventos,  usuarios_id, 0, token).subscribe( (response) => {
        console.log(response);

        if (response[0].borrado === true) {
          this.getEventos();
          this.statusT = true;
          this.statusText = 'La cita fue elimina con exito.';
          window.scroll(0 , 0);

        } else {
          this.status = true;
          this.statusText = 'La cita no se puede eliminar, por favor revisa tu conexión o intentalo más tarde.';
          window.scroll(0 , 0);
        }
      }, (err) => {
        console.log(err);
        this.status = true;
        this.statusText = 'La cita no se puede eliminar, por favor revisa tu conexión o intentalo más tarde.';
        window.scroll(0 , 0);
      });

    }
  }

}
