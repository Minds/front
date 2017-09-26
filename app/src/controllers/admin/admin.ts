import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Client, Upload } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { Session, SessionFactory } from '../../services/session';

@Component({
  selector: 'minds-admin',
  template: `
    <minds-admin-analytics *ngIf="filter == 'analytics'"></minds-admin-analytics>
    <minds-admin-boosts *ngIf="filter == 'boosts'"></minds-admin-boosts>
    <minds-admin-pages *ngIf="filter == 'pages'"></minds-admin-pages>
    <minds-admin-reports *ngIf="filter == 'reports' || filter == 'appeals'"></minds-admin-reports>
    <minds-admin-monetization *ngIf="filter == 'monetization'"></minds-admin-monetization>
    <minds-admin-programs *ngIf="filter == 'programs'"></minds-admin-programs>
    <minds-admin-payouts *ngIf="filter == 'payouts'"></minds-admin-payouts>
    <minds-admin-featured *ngIf="filter == 'featured'"></minds-admin-featured>
    <minds-admin-tagcloud *ngIf="filter == 'tagcloud'"></minds-admin-tagcloud>
    <m-admin--verify *ngIf="filter == 'verify'"></m-admin--verify>
  `
})

export class Admin {

  filter: string = '';
  session: Session = SessionFactory.build();
  paramsSubscription: Subscription;

  constructor(private route: ActivatedRoute, public title: MindsTitle, public router: Router) {
  }

  ngOnInit() {

    if (!this.session.isAdmin()) {
      this.router.navigate(['/']);
    }

    this.title.setTitle('Admin');
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
