import { Component, OnInit } from '@angular/core';
import { GiftCardClaimPanelService } from './panels/panel.service';
import { GiftCardClaimPanelEnum } from './panels/claim-panel.enum';
import { BehaviorSubject } from 'rxjs';
import { Session } from '../../../services/session';

/**
 * Root gift card claim component. Shows appropriate panel based on activePanel$.
 * Will set panel to LoggedOut if the user is logged-out.
 */
@Component({
  selector: 'm-giftCardClaim',
  templateUrl: 'claim.component.html',
  styleUrls: ['./claim.component.ng.scss'],
  host: { class: 'm-pageLayout__container' },
})
export class GiftCardClaimComponent implements OnInit {
  /** Enum as class variable for use in template. */
  public readonly GiftCardClaimPanelEnum: typeof GiftCardClaimPanelEnum = GiftCardClaimPanelEnum;

  /** Currently active panel. */
  public readonly activePanel$: BehaviorSubject<GiftCardClaimPanelEnum> = this
    .panelService.activePanel$;

  constructor(
    private panelService: GiftCardClaimPanelService,
    private session: Session
  ) {}

  ngOnInit(): void {
    // If not logged in set the panel to the LoggedOut panel.
    if (!this.session.isLoggedIn()) {
      this.panelService.activePanel$.next(GiftCardClaimPanelEnum.LoggedOut);
    }
  }
}
