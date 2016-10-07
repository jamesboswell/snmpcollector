import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    console.log('check canActivate:'+tokenNotExpired())
    if (tokenNotExpired()) {
      return true;
    }

    this.router.navigate(['Login']);
    return false;
  }
}
