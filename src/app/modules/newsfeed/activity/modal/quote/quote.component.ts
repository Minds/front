import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Self,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

import {
  ActivityEntity,
  ActivityService,
  ACTIVITY_FIXED_HEIGHT_RATIO,
} from '../../activity.service';

/**
 * DEPRECATED because modal only shows images and video posts.
 *
 * Displays quote posts in the media modal.
 */
@Component({
  selector: 'm-activity__modalQuote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.ng.scss'],
  providers: [ActivityService],
})
export class ActivityModalQuoteComponent implements OnInit {
  entitySubscription: Subscription;
  _entity;

  canonicalUrlSubscription: Subscription;
  canonicalUrl: string;

  @ViewChild('quoteEl')
  quoteEl: ElementRef;

  @Input() set entity(entity: ActivityEntity) {
    if (!entity) {
      return;
    }
    this._entity = entity;
    this.activityService.setEntity(entity);
  }

  constructor(@Self() public activityService: ActivityService) {}

  ngOnInit() {
    this.canonicalUrlSubscription = this.activityService.canonicalUrl$.subscribe(
      canonicalUrl => {
        if (!this._entity) return;
        this.canonicalUrl = canonicalUrl;
      }
    );
  }
  activityClick($event: MouseEvent) {
    if (!$event) {
      return;
    }
    $event.stopPropagation();
  }

  get height(): number {
    if (!this.quoteEl) {
      return;
    }
    const height =
      this.quoteEl.nativeElement.clientWidth / ACTIVITY_FIXED_HEIGHT_RATIO;

    return Math.max(500, height);
  }
}
