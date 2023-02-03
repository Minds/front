import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../../../services/api/client';
import { Session } from '../../../../../services/session';
import { Storage } from '../../../../../services/storage';

/**
 * DEPRECATED
 */
@Component({
  selector: 'm-token--onboarding--completed',
  templateUrl: 'completed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenCompletedOnboardingComponent {
  @Output() next: EventEmitter<void> = new EventEmitter();
  inProgress: boolean = false;
  error: string;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected router: Router,
    protected storage: Storage
  ) {}

  complete() {
    this.storage.set('walletOnboardingComplete', true);
    this.next.next();
  }

  detectChange() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
