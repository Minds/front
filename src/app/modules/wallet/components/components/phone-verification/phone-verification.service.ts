import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Session } from '../../../../../services/session';
import { WalletPhoneVerificationComponent } from './phone-verification.component';
import { ModalService } from '../../../../../services/ux/modal.service';

/**
 * Global service to open a phone verification modal
 */
@Injectable({ providedIn: 'root' })
export class PhoneVerificationService {
  /**
   * phoneVerified subject
   */
  phoneVerified$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(private modalService: ModalService, private session: Session) {
    if (this.session.getLoggedInUser().rewards) {
      this.phoneVerified$.next(true);
    }
  }

  async open(): Promise<void> {
    if (this.phoneVerified$.getValue()) {
      return;
    }

    const modal = this.modalService.present(WalletPhoneVerificationComponent, {
      data: {
        onComplete: () => {
          this.phoneVerified$.next(true);
          modal.close();
        },
      },
    });

    return modal.result;
  }
}
