import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { REASONS } from '../../../../services/list-options';

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
