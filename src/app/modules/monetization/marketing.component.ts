import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

import { Client } from '../../common/api/client.service';
import { ConfigsService } from '../../common/services/configs.service';
import { Session } from '../../services/session';

@Component({
  selector: 'm-monetization--marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonetizationMarketingComponent {
  readonly cdnAssetsUrl: string;
  user;
  showOnboardingForm: boolean = false;

  constructor(
    private client: Client,
    private cd: ChangeDetectorRef,
    configs: ConfigsService,
    private session: Session
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
    if (this.user) this.load();
  }

  load(): Promise<any> {
    return this.client
      .get('api/v1/merchant/status')
      .then((response: any) => {
        console.log(response);
        return response;
      })
      .catch(e => {
        throw e;
      });
  }

  isMonetized() {
    if (this.user && this.user.merchant.id) return true;
    return false;
  }

  onboard() {
    this.showOnboardingForm = true;
    this.detectChanges();
  }

  onboardCompleted(response) {
    this.user.merchant = {
      id: response.id,
      service: 'stripe',
      status: 'awaiting-document',
      exclusive: {
        enabled: true,
        amount: 10,
      },
    };

    this.showOnboardingForm = false;

    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
