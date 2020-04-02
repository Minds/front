import {
  Component,
  Input,
  HostBinding,
  ElementRef,
  HostListener,
  Optional,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { ActivityService as ActivityServiceCommentsLegacySupport } from '../../../common/services/activity.service';

import {
  ActivityService,
  ACTIVITY_FIXED_HEIGHT_RATIO,
  ActivityEntity,
} from './activity.service';
import { Subscription, Observable } from 'rxjs';
import { ComposerService } from '../../composer/services/composer.service';

@Component({
  selector: 'm-activity',
  templateUrl: 'activity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ActivityService,
    ActivityServiceCommentsLegacySupport, // Comments service should never have been called this.
    ComposerService,
  ],
  host: {
    class: 'm-border',
  },
})
export class ActivityComponent implements OnInit, AfterViewInit, OnDestroy {
  entity$: Observable<ActivityEntity> = this.service.entity$;

  @Input() set entity(entity) {
    this.service.setEntity(entity);
    this.isBoost = entity.boosted;
  }

  @Input() set displayOptions(options) {
    this.service.setDisplayOptions(options);
  }

  /**
   * Whether or not we allow autoplay on scroll
   */
  @Input() allowAutoplayOnScroll: boolean = false;

  /**
   * Whether or not autoplay is allowed (this is used for single entity view, media modal and media view)
   */
  @Input() autoplayVideo: boolean = false;

  @Output() deleted: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('class.m-activity--boost')
  isBoost = false;

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
  onResize(): void {
    this.calculateHeight();
  }

  calculateHeight(): void {
    if (!this.service.displayOptions.fixedHeight) return;
    const height =
      this.el.nativeElement.clientWidth / ACTIVITY_FIXED_HEIGHT_RATIO;
    this.service.height$.next(height);
  }

  delete() {
    this.deleted.emit(this.entity);
  }
}
