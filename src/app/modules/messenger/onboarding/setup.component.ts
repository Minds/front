import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { MessengerEncryptionService } from '../encryption/encryption.service';
import { FormToastService } from '../../../common/services/form-toast.service';

/**
 * DEPRECATED
 * Messenger was replaced with Minds Chat
 */
@Component({
  selector: 'm-messenger--onboarding--setup',
  templateUrl: 'setup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessengerOnboardingSetupComponent {
  @Input() skippable: boolean = true;
  @Output() next: EventEmitter<any> = new EventEmitter();

  inProgress: boolean = false;
  error: string;
  password: string;
  password2: string;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected router: Router,
    private encryption: MessengerEncryptionService,
    protected toasterService: FormToastService
  ) {}

  setup() {
    if (this.inProgress) return;
    this.inProgress = true;
    this.encryption
      .doSetup(this.password2)
      .then(() => {
        this.next.next(true);
        this.inProgress = false;
      })
      .catch(() => {
        this.error = 'Sorry, there was a problem.';
        this.toasterService.error(this.error);
        this.inProgress = false;
      });

    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
