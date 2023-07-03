import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthModalService } from '../../../../auth/modal/auth-modal.service';
import { GiftCardClaimPanelService } from '../panel.service';
import { GiftCardClaimPanelEnum } from '../claim-panel.enum';
import { Session } from '../../../../../services/session';
import { Subscription, filter } from 'rxjs';

/**
 * Panel for logged out state when trying to claim. On login will
 * redirect to the redeem panel.
 */
@Component({
  selector: 'm-giftCardClaimPanel__loggedOut',
  templateUrl: 'logged-out-panel.component.html',
  styleUrls: ['./logged-out-panel.component.ng.scss'],
})
export class GiftCardClaimLoggedOutPanelComponent implements OnInit, OnDestroy {
  // subscription to a user logging in / registering.
  private loginSubscription: Subscription;

  constructor(
    private authModal: AuthModalService,
    private panelService: GiftCardClaimPanelService,
    private session: Session
  ) {}

  ngOnInit(): void {
    // when the user logs in, redirect to the redeem panel.
    this.loginSubscription = this.session.loggedinEmitter
      .pipe(filter(Boolean))
      .subscribe((_: boolean): void => {
        this.panelService.activePanel$.next(GiftCardClaimPanelEnum.Redeem);
      });
  }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }

  /**
   * Open auth modal with the passed form.
   * @param { 'login' | 'register' } formDisplay - form to display in modal.
   * @returns { void }
   */
  public openAuthModal(formDisplay: 'login' | 'register'): void {
    this.authModal.open({ formDisplay: formDisplay });
  }
}
