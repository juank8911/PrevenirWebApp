import { Component,OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  // CalendarEventAction,
  // CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarMonthViewDay
} from 'angular-calendar';
import {
  startOfDay,
  addHours
} from 'date-fns';

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

// servicios
import { MedicoService } from '../../services/medico.service';
import { UserService } from '../../services/user.service';
import { PlatformLocation } from '@angular/common';


@Component({
  selector: 'app-historial-citas-medico',
  templateUrl: './historial-citas-medico.component.html',
  styleUrls: ['./historial-citas-medico.component.css'],
  providers : [MedicoService, UserService]
})
export class HistorialCitasMedicoComponent implements OnInit {

  // Variables calendario
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  selectedMonthViewDay: CalendarMonthViewDay;
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  activeDayIsOpen = false;
  locale = 'es';

  // variables app
  public servicios;
  public loading;
  public servicioSelect;
  public servicio;
  public medico_id;
  public resEventos;
  public infoPaciente;

  constructor(private _userService : UserService, private _medicoService : MedicoService, location: PlatformLocation){
    location.onPopState(() => {
      document.getElementById('btn-cerrar-modal-info').click();
    });
  }

  ngOnInit() {
    this.medico_id = this._userService.getIdentity().medico_id;
    this.getServiciosMedico(this.medico_id);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  getServiciosMedico(id) {
    this.loading = true;
    this._medicoService.getServicios(id).subscribe( (response) => {
      console.log(response);
      this.servicios = response;
      this.loading = false;
    }, (err) => {
      console.log(err);
      this.loading = false;
    });
  }

  serviciosSelecionado(ev) {
    this.servicioSelect = ev.value;
    console.log(this.servicioSelect);
  }

  servicioSelecionado(ev) {
    this.servicio = ev.value;
    console.log(this.servicio);
    let anio = moment(new Date).format('YYYY');
    let mes =  moment(new Date).format('M');

    this.getHistorial(this.servicio.categoria_idcategoria, this.servicio.id_servicios, anio, mes);
  }

  getHistorial(id_categoria, id_servicio, anio, mes) {
    
    this.loading = true;
    this.events = [];
    // console.log(mes, anio, id_categoria, id_servicio);

    this._medicoService.getHistorialCitasCalendar(mes, anio, this.medico_id, id_categoria, id_servicio).subscribe( (response) => {
      console.log(response);
      this.resEventos = response;

      if(this.resEventos.length >= 1) {

        for(let i = 0; i < this.resEventos.length; i++) {
          
          let title = this.resEventos[i].nombre + ' ' + this.resEventos[i].apellidos;

          let diaS = moment(this.resEventos[i].start).format('ddd');
              let mesS = moment(this.resEventos[i].start).format('MMM');
              let fechaS = moment(this.resEventos[i].start).format('DD-YYYY');
              let horaS = moment.utc(this.resEventos[i].start).format('h:mm:ss');
              let horaSs = moment.utc(this.resEventos[i].start).format('H');
              let start = diaS + ' ' + mesS + ' ' + fechaS + ' ' +  horaS;
              // d = horaS;

              let diaE = moment(this.resEventos[i].end).format('ddd');
              let mesE = moment(this.resEventos[i].end).format('MMM');
              let fechaE = moment(this.resEventos[i].end).format('DD-YYYY');
              let horaE = moment.utc(this.resEventos[i].end).format('h:mm:ss');
              let horaEe = moment.utc(this.resEventos[i].end).format('H');

              let end = diaE + ' ' + mesE + ' ' + fechaE + ' ' +  horaE;

          
          let info = {};

              let apellidos = this.resEventos[i].apellidos;
              let avatar = this.resEventos[i].avatar;
              let cedula = this.resEventos[i].cedula;
              let fecha_nacimiento = this.resEventos[i].fecha_nacimiento;
              let nombre = this.resEventos[i].nombre;
              let telefono = this.resEventos[i].telefono;
              let id_eventos = this.resEventos[i].id_eventos;

                info = {id : this.resEventos[i].id, tipo : 'usuario', apellidos : apellidos, avatar : avatar , cedula: cedula,
                        fecha_nacimiento: fecha_nacimiento, nombre: nombre, telefono: telefono, id_eventos: id_eventos} ;
              
                        this.addEvent(title, start, end, horaSs, horaEe, info);
        
        }
      }

      this.loading = false;
    }, (err) => { 
      console.log(err);
    });

  }

  closeOpenMonthViewDay(ev) {
    console.log(ev);
    // console.log(moment(ev).format('YYYY'), moment(ev).format('M'));
    this.getHistorial(this.servicio.categoria_idcategoria, this.servicio.id_servicios,moment(ev).format('YYYY') ,moment(ev).format('M'));
  }

  addEvent(title, start, end, horaInicio, horaFinal, info): void {
    this.loading = true;
    console.log('aqui');
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
    this.loading = false;
  }

  handleEvent(action: string, event: CalendarEvent): void {
    document.getElementById('btn-abrir-modal-info').click();

    this.infoPaciente = event;
    console.log(event);
  }
}
