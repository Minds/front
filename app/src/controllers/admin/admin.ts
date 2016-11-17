import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Client, Upload } from '../../services/api';

@Component({
  selector: 'minds-admin',
  template: `
    <minds-admin-analytics *ngIf="filter == 'analytics'"></minds-admin-analytics>
    <minds-admin-boosts *ngIf="filter == 'boosts'"></minds-admin-boosts>
    <minds-admin-pages *ngIf="filter == 'pages'"></minds-admin-pages>
    <minds-admin-reports *ngIf="filter == 'reports'"></minds-admin-reports>
  `
})

export class Admin {

  filter : string = "";

  constructor(private route: ActivatedRoute){
  }

  paramsSubscription: Subscription;
  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params: any) => {
      if (params['filter']) {
        this.filter = params['filter'];
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }
}
