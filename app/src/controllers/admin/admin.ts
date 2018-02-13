import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Client, Upload } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { Session } from '../../services/session';

@Component({
  selector: 'minds-admin',
  templateUrl: 'admin.html'
})

export class Admin {

  filter: string = '';
  paramsSubscription: Subscription;

  constructor(public session: Session, private route: ActivatedRoute, public title: MindsTitle, public router: Router) {
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
