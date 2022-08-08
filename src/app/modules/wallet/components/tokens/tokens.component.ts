import {
  Component,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Session } from '../../../../services/session';

/**
 * Base component for wallet pages that relate to tokens
 */
@Component({
  selector: 'm-walletV2__tokens',
  templateUrl: './tokens.component.html',
})
export class WalletV2TokensComponent {
  @ViewChild('dashboardViews') dashboardView: ElementRef;

  phoneVerified: boolean;
  hasOnchainAddress: boolean;
  tokenOnboardingComplete = false;

  constructor(private session: Session, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.phoneVerified = this.session.getLoggedInUser().rewards;
    this.hasOnchainAddress = this.session.getLoggedInUser().eth_wallet;
    if (this.phoneVerified && this.hasOnchainAddress) {
      this.tokenOnboardingComplete = true;
    }
  }

  onTokenOnboardingCompleted(): void {
    this.tokenOnboardingComplete = true;
    this.detectChanges();
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
