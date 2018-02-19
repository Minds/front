import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../../../services/api/client';
import { Session } from '../../../../../services/session';

@Component({
  selector: 'm-token--onboarding--completed',
  templateUrl: 'completed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TokenCompletedOnboardingComponent {

  @Output() next: EventEmitter<any> = new EventEmitter();
  inProgress: boolean = false;
  error: string;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected router: Router,
  ) { 

  }

  detectChange() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
