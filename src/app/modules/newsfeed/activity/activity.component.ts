import {
  Component,
  Input,
  HostBinding,
  ElementRef,
  HostListener,
  Optional,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivityService as ActivityServiceCommentsLegacySupport } from '../../../common/services/activity.service';

import {
  ActivityService,
  ACTIVITY_FIXED_HEIGHT_RATIO,
} from './activity.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-activity',
  templateUrl: 'activity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ActivityService,
    ActivityServiceCommentsLegacySupport, // Comments service should never have been called this.
  ],
  host: {
    class: 'm-border',
  },
})
export class ActivityComponent {
  @Input() set entity(entity) {
    this.service.setEntity(entity);
  }

  @Input() set displayOptions(options) {
    this.service.setDisplayOptions(options);
  }

  @HostBinding('class.m-activity--fixedHeight')
  isFixedHeight: boolean;

  @HostBinding('class.m-activity--noOwnerBlock')
  noOwnerBlock: boolean;

  @HostBinding('style.height')
  heightPx: string;

  heightSubscription: Subscription;

  constructor(
    public service: ActivityService,
    private el: ElementRef,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isFixedHeight = this.service.displayOptions.fixedHeight;
    this.noOwnerBlock = !this.service.displayOptions.showOwnerBlock;
    this.heightSubscription = this.service.height$.subscribe(
      (height: number) => {
        if (!this.service.displayOptions.fixedHeight) return;
        this.heightPx = `${height}px`;
        this.cd.markForCheck();
        this.cd.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    this.heightSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    setTimeout(() => this.calculateHeight());
  }

  @HostListener('window:resize')
  calculateHeight(): void {
    if (!this.service.displayOptions.fixedHeight) return;
    const height =
      this.el.nativeElement.clientWidth / ACTIVITY_FIXED_HEIGHT_RATIO;
    this.service.height$.next(height);
  }
}
