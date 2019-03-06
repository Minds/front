import { 
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef, 
} from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../common/api/client.service';


@Component({
  selector: 'm-reports__marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ReportsMarketingComponent {

  user = window.Minds.user;
  minds = window.Minds;

  constructor(
    private client: Client,
    private cd: ChangeDetectorRef,
    private router: Router,
  ) {
  }

  startJuryDuty() {
    this.router.navigate(['/moderation/juryduty/appeals']);
  }

}
