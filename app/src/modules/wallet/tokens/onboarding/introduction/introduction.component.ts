import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../../../services/api/client';
import { Session } from '../../../../../services/session';

@Component({
  selector: 'm-token--onboarding--introduction',
  templateUrl: 'introduction.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TokenIntroductionOnboardingComponent {

  inProgress: boolean = false;
  error: string;
  minds = window.Minds;

  @Output() next: EventEmitter<any> = new EventEmitter();

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
