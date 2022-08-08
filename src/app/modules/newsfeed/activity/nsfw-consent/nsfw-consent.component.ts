import { Component, HostBinding, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { ActivityService, ActivityEntity } from '../activity.service';
import { map } from 'rxjs/operators';
import { NSFW_REASONS } from '../../../../common/components/nsfw-selector/nsfw-selector.service';

/**
 * A panel that obscures the activity post if it has been tagged as NSFW.
 * Users must click to reveal the post. Used at the 'm-activity' level.
 */
@Component({
  selector: 'm-activity__nsfwConsent',
  templateUrl: 'nsfw-consent.component.html',
})
export class ActivityNsfwConsentComponent {
  entity: any;

  reasonsLabel$: Observable<string> = this.service.entity$.pipe(
    map((entity: ActivityEntity) => {
      this.entity = entity;
      const reasons = NSFW_REASONS.filter(
        reason => entity.nsfw.indexOf(reason.value) > -1
      );
      if (reasons.length === 1) {
        return reasons[0].label;
      }
      if (reasons.length === 2) {
        return reasons.map(reason => reason.label).join(' & ');
      }
      if (reasons.length > 2) {
        return (
          reasons
            .slice(0, reasons.length - 1)
            .map(reason => reason.label)
            .join(', ') +
          ' & ' +
          reasons[reasons.length - 1].label
        );
      }
      return '';
    })
  );

  @HostBinding('class.m-activityNsfwConsent--minimalMode') get minimalMode() {
    return this.service.displayOptions.minimalMode;
  }

  constructor(public service: ActivityService) {}

  onConsentedClick(e: MouseEvent): void {
    this.service.isNsfwConsented$.next(true);
  }
}
