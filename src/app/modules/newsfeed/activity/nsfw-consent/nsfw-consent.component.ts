import {
  Component,
  HostListener,
  ViewChild,
  Input,
  ElementRef,
} from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService, ActivityEntity } from '../activity.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Session } from '../../../../services/session';
import { MindsUser, MindsGroup } from '../../../../interfaces/entities';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { MediaModalComponent } from '../../../media/modal/modal.component';
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

  constructor(
    public service: ActivityService,
    private overlayModal: OverlayModalService,
    private router: Router
  ) {}

  onConsentedClick(e: MouseEvent): void {
    this.service.isNsfwConsented$.next(true);
  }
}
