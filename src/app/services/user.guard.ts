import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../services/user.service';
import { iif } from 'rxjs';
import { ignoreElements } from 'rxjs/operators';

@Injectable()
export class UserGuard implements CanActivate {

    constructor(private _userService: UserService, private _router: Router) {

    }

    canActivate() {
        let identity = this._userService.getIdentity();
        let confirmar = JSON.parse(localStorage.getItem('confirmar'));

        if (identity && confirmar === true) {
            return true;
        }

        if (identity && confirmar === false) {
            this._router.navigate(['/confirmar-cuenta']);
            return false;
        }

        if (identity === undefined) {
            this._router.navigate(['/login']);
            return false;
        }
    }
 }

