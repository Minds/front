import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'm-wallet-token--101',
  templateUrl: '101.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletToken101Component {
  contributionValues = {
    comments: 2,
    reminds: 4,
    votes: 1,
    subscribers: 4,
    referrals: 50,
    referrals_welcome: 50,
    checkin: 2,
    jury_duty: 25
  };
}
