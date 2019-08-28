import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MindsTitle } from '../../../../services/ux/title';
import { Session } from '../../../../services/session';

@Component({
  selector: 'm-referrals',
  templateUrl: 'referrals.component.html',
})
export class ReferralsComponent implements OnInit {
  constructor(
    public session: Session,
    public title: MindsTitle,
    public route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      return this.router.navigate(['/login']);
    }

    this.title.setTitle('Referrals');
  }
}
