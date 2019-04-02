import { Component, OnInit, Input } from '@angular/core';
import { Publicacion } from 'src/app/models/publicacion';

@Component({
  selector: 'app-modal-ver-publicacion',
  templateUrl: './modal-ver-publicacion.component.html',
  styleUrls: ['./modal-ver-publicacion.component.css']
})
export class ModalVerPublicacionComponent implements OnInit {

  @Input() publicacion;

  constructor() {
  }

  ngOnInit() {
    //
  }

}
