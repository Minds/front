import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Output,
} from '@angular/core';
import { map, take } from 'rxjs/operators';
import { ActivityService } from '../../../activity/activity.service';
import getMetaAutoCaption from '../../../../../helpers/meta-auto-caption';

@Component({
  selector: 'm-activityContent__multiImage',
  templateUrl: './multi-image.component.html',
  styleUrls: ['./multi-image.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityMultiImageComponent {
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  images$ = this.service.entity$.pipe(map((entity) => entity.custom_data));

  count$ = this.images$.pipe(map((images) => images.length));

  entity$ = this.service.entity$.pipe(take(1));

  constructor(public service: ActivityService) {}

  @HostBinding('class.m-activityMultiImage--minimalMode')
  get isMinimalMode(): boolean {
    return this.service.displayOptions.minimalMode;
  }

  onClickImage($event, index: number = 0): void {
    $event.preventDefault();
    $event.stopPropagation();

    this.service.activeMultiImageIndex$.next(index);
    this.onClick.emit($event);
  }

  /**
   * Improves the  performance
   */
  trackByFn(i: number, image) {
    return image.src;
  }

  /**
   * Add the AI caption as an alt tag for SEO
   */
  getAltTag(entity, index): string {
    let caption = getMetaAutoCaption(entity, index);
    if (caption) {
      return `AI caption: ${caption}`;
    }
    return '';
  }
}
