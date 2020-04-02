import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { ActivityService, ActivityEntity } from '../activity.service';
import { map } from 'rxjs/operators';
import { NSFW_REASONS } from '../../../../common/components/nsfw-selector/nsfw-selector.service';

@Component({
  selector: 'm-activity__nsfwConsent',
  templateUrl: 'nsfw-consent.component.html',
})
export class ActivityNsfwConsentComponent {
  reasonsLabel$: Observable<string> = this.service.entity$.pipe(
    map((entity: ActivityEntity) => {
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

  constructor(public service: ActivityService) {}

  onConsentedClick(e: MouseEvent): void {
    this.service.isNsfwConsented$.next(true);
  }
}
