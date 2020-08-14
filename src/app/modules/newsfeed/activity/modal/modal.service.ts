import { Injectable, OnDestroy, Optional, SkipSelf } from '@angular/core';
import { HorizontalFeedService } from '../../../../common/services/horizontal-feed.service';
import { ActivityEntity, ActivityService } from '../activity.service';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { toggleFullscreen } from '../../../../helpers/fullscreen';
import { SiteService } from '../../../../common/services/site.service';
import { Location } from '@angular/common';
import { AnalyticsService } from '../../../../services/analytics';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';

@Injectable()
export class ActivityModalService {
  protected modalPager$: Subscription;
  protected asyncEntity$: Subscription;

  activityService: ActivityService;

  /**
   * The current activityService entity
   */
  entity: ActivityEntity;

  /**
   * Where the browser url will return to when user leaves modal
   */
  // sourceUrl: string;

  /**
   * Is the modal loading?
   */
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  /**
   * Whether the modal stage element is in fullscreen mode
   */
  isFullscreen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Whether the cursor is hovering over the fullscreen icon
   */
  fullscreenHovering$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  overlayVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  pagerVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private site: SiteService,
    private location: Location,
    private overlayModal: OverlayModalService
  ) {}

  /////////////////////////////////////////////////////////////////
  // UTILITY
  /////////////////////////////////////////////////////////////////

  // setSourceUrl(url: string): void {
  //   this.sourceUrl = url;
  // }

  setActivityService(activityService: ActivityService) {
    if (!this.activityService) {
      this.activityService = activityService;
    }
  }

  // Set entity on load or page
  setEntity(entity: ActivityEntity): void {
    this.entity = entity;

    this.activityService.setEntity(entity);

    // Todoojm integrate delete with pager/horizontal feed
  }

  // returnToSourceUrl(): void {
  // this.location.replaceState(this.sourceUrl);
  // }

  dismiss(): void {
    // this.returnToSourceUrl();
    this.activityService.displayOptions.isModal = false;
    this.overlayModal.dismiss();
  }

  ////////////////////////////////////////
  // FULL SCREEN
  ////////////////////////////////////////

  toggleFullscreen(): void {
    this.fullscreenHovering$.next(false);

    const el = document.querySelector('.m-activityModal__stageWrapper');
    if (el) {
      this.isFullscreen$.next(toggleFullscreen(el));
    }
  }

  /////////////////////////////////////////////////////////////////
  // KEYBOARD SHORTCUTS
  /////////////////////////////////////////////////////////////////
  shouldFilterOutKeyDownEvent($event: KeyboardEvent): Boolean {
    const missingEvent = !$event || !$event.target;

    const tagName = (
      ($event.target as HTMLElement).tagName || ''
    ).toLowerCase();
    const isContentEditable =
      ($event.target as HTMLElement).contentEditable === 'true';

    if (
      missingEvent ||
      tagName === 'input' ||
      tagName === 'textarea' ||
      isContentEditable ||
      ($event.key !== 'ArrowLeft' &&
        $event.key !== 'ArrowRight' &&
        $event.key !== 'Escape')
    ) {
      return true;
    }

    $event.stopPropagation();
    $event.preventDefault();
    return false;
  }
}
