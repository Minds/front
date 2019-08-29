import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'm-wallet-token--101',
  templateUrl: '101.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    jury_duty: 25,
  };

  userStates = [
    { userState: 'new', rewardFactor: 1.25 },
    { userState: 'curious', rewardFactor: 1 },
    { userState: 'casual', rewardFactor: 1.1 },
    { userState: 'core', rewardFactor: 1.25 },
    { userState: 'cold', rewardFactor: 0.5 },
    { userState: 'resurrected', rewardFactor: 1.25 },
  ];

  minds = window.Minds;
}
