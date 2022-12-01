import { isPlatformBrowser } from '@angular/common';
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
  ViewChild,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { ActivityService as ActivityServiceCommentsLegacySupport } from '../../../common/services/activity.service';

import {
  ActivityService,
  ACTIVITY_FIXED_HEIGHT_RATIO,
  ActivityEntity,
} from './activity.service';
import {
  Subscription,
  Observable,
  BehaviorSubject,
  combineLatest,
  Subject,
} from 'rxjs';
import { ComposerService } from '../../composer/services/composer.service';
import { ElementVisibilityService } from '../../../common/services/element-visibility.service';
import { NewsfeedService } from '../services/newsfeed.service';
import { ClientMetaDirective } from '../../../common/directives/client-meta.directive';

/**
 * Base component for activity posts (excluding activities displayed in a modal)
 */
@Component({
  selector: 'm-activity',
  templateUrl: 'activity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ActivityService,
    ActivityServiceCommentsLegacySupport, // Comments service should never have been called this.
    ComposerService,
    ElementVisibilityService, // MH: There is too much analytics logic in this entity component. Refactor at a later date.
  ],
  host: {
    class: 'm-border',
    '[class.m-activity--minimalMode]':
      'this.service.displayOptions.minimalMode',
  },
})
export class ActivityComponent implements OnInit, AfterViewInit, OnDestroy {
  entity$: Observable<ActivityEntity> = this.service.entity$;

  @Input() set canDelete(value: boolean) {
    this.service.canDeleteOverride$.next(value);
  }

  @Input() set entity(entity) {
    this.service.setEntity(entity);
    this.isBoost = entity.boosted;
  }

  @Input() set displayOptions(options) {
    this.service.setDisplayOptions(options);
  }

  @Input() slot: number = -1;

  /**
   * Whether or not autoplay is allowed (this is used for single entity view, media modal and media view)
   */
  @Input() set autoplayVideo(autoplay: boolean) {
    this.service.displayOptions.autoplayVideo = autoplay;
  }

  @Input() canRecordAnalytics: boolean = true;

  @Output() deleted: Subject<boolean> = this.service.onDelete$;

  @HostBinding('class.m-activity--boost')
  isBoost = false;

  @HostBinding('class.m-activity--fixedHeight')
  isFixedHeight: boolean;

  @HostBinding('class.m-activity--fixedHeightContainer')
  isFixedHeightContainer: boolean;

  @HostBinding('class.m-activity--noOwnerBlock')
  noOwnerBlock: boolean;

  @HostBinding('class.m-activity--v2')
  isV2: boolean;

  @HostBinding('style.height')
  heightPx: string;

  @HostBinding('class.m-activity--minimalRemind')
  isMinimalRemind: boolean = false;

  heightSubscription: Subscription;
  remindSubscription: Subscription;

  @ViewChild(ClientMetaDirective) clientMeta: ClientMetaDirective;

  @Output() previousBoost: EventEmitter<any> = new EventEmitter();
  @Output() nextBoost: EventEmitter<any> = new EventEmitter();

  constructor(
    public service: ActivityService,
    private el: ElementRef,
    private cd: ChangeDetectorRef,
    private elementVisibilityService: ElementVisibilityService,
    private newsfeedService: NewsfeedService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.isV2 = this.service.displayOptions.isV2; // ojm

    this.isFixedHeight =
      this.service.displayOptions.fixedHeight &&
      !this.service.displayOptions.isV2;

    this.isFixedHeightContainer =
      this.service.displayOptions.fixedHeightContainer &&
      !this.service.displayOptions.isV2;

    this.noOwnerBlock = !this.service.displayOptions.showOwnerBlock;

    this.heightSubscription = this.service.height$.subscribe(
      (height: number) => {
        if (!this.service.displayOptions.fixedHeight) return;
        if (this.service.displayOptions.fixedHeightContainer) return;
        this.heightPx = `${height}px`;
        this.cd.markForCheck();
        this.cd.detectChanges();
      }
    );

    this.remindSubscription = this.service.isRemind$.subscribe(isRemind => {
      if (isRemind && this.service.displayOptions.minimalMode) {
        this.service.displayOptions.showOwnerBlock = true;
        this.isMinimalRemind = true;
      } else {
        this.isMinimalRemind = false;
      }
    });
  }

  ngOnDestroy() {
    this.heightSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    if (!this.isV2) {
      setTimeout(() => this.calculateHeight());
      if (this.canRecordAnalytics) {
        this.elementVisibilityService
          .setEntity(this.service.entity$.value)
          .setElementRef(this.el)
          .onView((entity: ActivityEntity) => {
            if (!entity) return;

            this.newsfeedService.recordView(
              entity,
              true,
              null,
              this.clientMeta.build({
                campaign: entity.boosted_guid ? entity.urn : '',
                position: this.slot,
              })
            );
          });
        this.elementVisibilityService.checkVisibility();
      }
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.calculateHeight();
  }

  calculateHeight(): void {
    if (!this.service.displayOptions.fixedHeight) return;
    if (this.service.displayOptions.fixedHeightContainer) return;
    const height =
      this.el.nativeElement.clientWidth / ACTIVITY_FIXED_HEIGHT_RATIO;
    this.service.height$.next(height);
  }

  delete() {
    this.deleted.next(this.service.entity$.value);
  }

  /**
   * Keep scroll position when comments height changes
   */
  onCommentsHeightChange({ newHeight, oldHeight }): void {
    if (!isPlatformBrowser(this.platformId)) return;

    window.scrollTo({
      top: window.pageYOffset + (newHeight - oldHeight),
    });
  }
}
