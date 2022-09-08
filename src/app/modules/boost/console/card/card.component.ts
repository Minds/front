import { BehaviorSubject } from 'rxjs';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ActivityV2ExperimentService } from '../../../experiments/sub-services/activity-v2-experiment.service';
import { BoostService } from '../../boost.service';
import { Reason, rejectionReasons } from '../../rejection-reasons';

@Component({
  moduleId: module.id,
  providers: [BoostService],
  selector: 'm-boost-console-card',
  templateUrl: 'card.component.html',
})
export class BoostConsoleCard implements OnInit {
  boost: any;
  type: string;

  public inProgress$: BehaviorSubject<boolean> = this.service.inProgress$;

  reasons: Array<Reason> = rejectionReasons;

  @HostBinding('class.m-boostConsoleCard--activityV2')
  activityV2Feature: boolean;

  constructor(
    public service: BoostService,
    private activityV2Experiment: ActivityV2ExperimentService
  ) {}

  @Input('boost')
  set _boost(boost: any) {
    this.boost = boost;
    this.type = this.service.getBoostType(this.boost) || '';
  }

  ngOnInit(): void {
    this.activityV2Feature = this.activityV2Experiment.isActive();
  }

  accept() {
    let agreed = true;

    if (this.boost.bidType === 'usd' && this.boost.postToFacebook) {
      agreed = confirm(
        `I accept a 5% transaction fee and agree not to delete this content from Facebook`
      );
    } else if (this.boost.bidType === 'usd') {
      agreed = confirm(`I accept a 5% transaction fee`);
    } else if (this.boost.postToFacebook) {
      agreed = confirm(`I agree not to delete this content from Facebook`);
    }

    if (!agreed) {
      return Promise.resolve(false);
    }

    return this.service.accept(this.boost);
  }

  canAccept() {
    return this.service.canAccept(this.boost);
  }

  reject() {
    return this.service.reject(this.boost);
  }

  canReject() {
    return this.service.canReject(this.boost);
  }

  revoke() {
    return this.service.revoke(this.boost);
  }

  canRevoke() {
    return this.service.canRevoke(this.boost);
  }

  isIncoming() {
    return this.service.isIncoming(this.boost);
  }

  findReason(code: number): Reason {
    return rejectionReasons.find((item: Reason) => {
      return item.code == code;
    });
  }
}
