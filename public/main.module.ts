//Auth examples from: https://github.com/auth0-blog/angular2-authentication-sample
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AUTH_PROVIDERS } from 'angular2-jwt';

import { AuthGuard } from './common/auth.guard';
import { Home } from './home/home';
import { Login } from './login/login';
import { App } from './app/app';

import { routes } from './app/app.routes';
//
import { SnmpDeviceCfgComponent } from './home/snmpdevicecfg.component';
//import { DropdownModule, PaginationModule ,AccordionModule } from 'ng2-bootstrap/ng2-bootstrap';
// http://valor-software.com/ng2-bootstrap/#/accordion
// https://github.com/valor-software/angular2-quickstart

import { AccordionModule } from 'ng2-bootstrap/ng2-bootstrap';


@NgModule({
  bootstrap: [App],
  declarations: [
    //DropdownModule, PaginationModule ,AccordionModule,
    SnmpDeviceCfgComponent,
    Home,
    Login,
    App,
  ],
  imports: [
    HttpModule, BrowserModule, FormsModule, ReactiveFormsModule, AccordionModule,
    RouterModule.forRoot(routes, {
    //  useHash: true
    })
  ],
  providers: [
    AuthGuard, ...AUTH_PROVIDERS
  ]
})
export class AppModule {}
