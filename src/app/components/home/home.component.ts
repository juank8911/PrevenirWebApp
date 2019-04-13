import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProvedorService } from '../../services/provedor.service';
import { Global } from '../../services/global';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ProvedorService, Global, UserService]
})
export class HomeComponent implements OnInit {
  public admin: string;
  public data_provedor;

  constructor(private _route: ActivatedRoute, private _router: Router, public _provedorService: ProvedorService, public global: Global,
              public _userService: UserService) {}

  ngOnInit() {

  }

}
