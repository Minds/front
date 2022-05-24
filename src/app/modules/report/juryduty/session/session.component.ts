import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Session } from '../../../../services/session';

@Component({
  selector: 'm-juryduty__session',
  templateUrl: 'session.component.html',
})
export class JuryDutySessionComponent implements AfterViewInit {
  paramsSubscription;
  juryType: string = 'appeal';

  constructor(public route: ActivatedRoute, public session: Session) {}

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.juryType = params['jury'];
    });
  }

  ngAfterViewInit() {}
}
