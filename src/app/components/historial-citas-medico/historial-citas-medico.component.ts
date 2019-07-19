import { Component,OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  // CalendarEventAction,
  // CalendarEventTimesChangedEvent,
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

// servicios
import { MedicoService } from '../../services/medico.service';
import { UserService } from '../../services/user.service';


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

  constructor(private _userService : UserService, private _medicoService : MedicoService){
    
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

    this.getHistorial(this.servicio.categoria_idcategoria, this.servicio.id_servicios);
  }

  getHistorial(id_categoria, id_servicio) {
    let anio = moment(new Date).format('YYYY');
    let mes =  moment(new Date).format('M');

    console.log(mes, anio, id_categoria, id_servicio);

    this._medicoService.getHistorialCitasCalendar(mes, anio, this.medico_id, id_categoria, id_servicio).subscribe( (response) => {
      console.log(response);
    }, (err) => { 
      console.log(err);
    });

  }

  closeOpenMonthViewDay(ev) {
    console.log(ev);
  }
}
