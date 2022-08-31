import { Component, EventEmitter, Output } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivityService } from '../../../activity/activity.service';

@Component({
  selector: 'm-activityV2Content__multiImage',
  templateUrl: './multi-image.component.html',
  styleUrls: ['./multi-image.component.ng.scss'],
})
export class ActivityV2MultiImageComponent {
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  images$ = this.service.entity$.pipe(map(entity => entity.custom_data));

  count$ = this.images$.pipe(map(images => images.length));

  constructor(public service: ActivityService) {}

  onClickImage($event, index: number = 0): void {
    $event.preventDefault();
    $event.stopPropagation();

    this.service.activeMultiImageIndex$.next(index);
    this.onClick.emit($event);
  }
}
