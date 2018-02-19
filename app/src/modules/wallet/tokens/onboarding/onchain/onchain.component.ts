import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../../../services/api/client';
import { Session } from '../../../../../services/session';

@Component({
  selector: 'm-token--onboarding--onchain',
  templateUrl: 'onchain.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TokenOnChainOnboardingComponent {

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

  ngOnInit() {
    //already completed step
    if (this.session.getLoggedInUser().eth_wallet) {
      this.next.next();
    }
  }

  detectChange() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
