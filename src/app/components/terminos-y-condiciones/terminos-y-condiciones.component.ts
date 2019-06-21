import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-terminos-y-condiciones',
  templateUrl: './terminos-y-condiciones.component.html',
  styleUrls: ['./terminos-y-condiciones.component.css'],
  providers: [UserService]
})
export class TerminosYCondicionesComponent implements OnInit {
  public identity;

  constructor(private _userService: UserService) { }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
  }

}
