import { Component } from '@angular/core';
import { CORE_DIRECTIVES, Location } from '@angular/common';
import { Router, RouteParams, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { Client, Upload } from '../../services/api';
import { Material } from '../../directives/material';

import { AdminAnalytics } from './analytics/analytics';
import { AdminBoosts } from './boosts/boosts';
import { AdminPages } from './pages/pages';
import { AdminReports } from './reports/reports';


@Component({
  selector: 'minds-admin',
  template: `
    <minds-admin-analytics *ngIf="filter == 'analytics'"></minds-admin-analytics>
    <minds-admin-boosts *ngIf="filter == 'boosts'"></minds-admin-boosts>
    <minds-admin-pages *ngIf="filter == 'pages'"></minds-admin-pages>
    <minds-admin-reports *ngIf="filter == 'reports'"></minds-admin-reports>
  `,
  directives: [ CORE_DIRECTIVES, Material, ROUTER_DIRECTIVES, AdminAnalytics, AdminBoosts, AdminPages, AdminReports ]
})

export class Admin {

  filter : string = "";

  constructor(public params : RouteParams){
    if(params.params['filter'])
      this.filter = params.params['filter']
  }

}
