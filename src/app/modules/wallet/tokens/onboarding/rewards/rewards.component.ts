import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../../../services/api/client';
import { Session } from '../../../../../services/session';
import { ConfigsService } from '../../../../../common/services/configs.service';

@Component({
  selector: 'm-token--onboarding--rewards',
  templateUrl: 'rewards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenRewardsOnboardingComponent {
  @Input() skippable: boolean = true;
  @Output() next: EventEmitter<any> = new EventEmitter();

  confirming: boolean = false;
  number: number;
  code: number;
  secret: string;
  inProgress: boolean = false;
  error: string;
  readonly cdnAssetsUrl: string;
  plusPrompt: boolean = false;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected router: Router,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    //already completed step
    if (this.session.getLoggedInUser().rewards) {
      this.next.next();
    }
  }

  async verify() {
    this.inProgress = true;
    this.error = null;
    try {
      let response: any = await this.client.post(
        'api/v2/blockchain/rewards/verify',
        {
          number: this.number,
        }
      );
      this.secret = response.secret;
      this.confirming = true;
    } catch (e) {
      this.error = e.message;
    }
    this.inProgress = false;

    this.detectChange();
  }

  cancel() {
    this.confirming = false;
    this.code = null;
    this.secret = null;
    this.inProgress = false;
    this.error = null;
    this.detectChange();
  }

  async confirm() {
    this.inProgress = true;
    this.error = null;
    try {
      let response: any = await this.client.post(
        'api/v2/blockchain/rewards/confirm',
        {
          number: this.number,
          code: this.code,
          secret: this.secret,
        }
      );

      this.session.getLoggedInUser().rewards = true;
      this.join();
    } catch (e) {
      this.error = e.message;
    }

    this.inProgress = false;
    this.detectChange();
  }

  join() {
    this.next.next();
  }

  detectChange() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
