import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { AnalyticsService } from '../../../services/analytics';
import { SupermindBannerPopupService } from './supermind-banner-popup.service';

export type SupermindBannerType = 'repliesFromCreators' | 'upgradeComment';
/**
 * Banner that prompts users to upgrade to a supermind
 *
 * See it: as an experimental alternative to the giant supermind
 * button on single activity pages, or as an experimental popup in the comment poster
 */
@Component({
  selector: 'm-supermind__banner',
  templateUrl: './supermind-banner.component.html',
  styleUrls: ['./supermind-banner.component.ng.scss'],
})
export class SupermindBannerComponent implements OnInit {
  /**
   * The entity that will be used to populate the supermind composer
   * when the supermind button is pressed
   *
   * Can be an activity or a user
   */
  @Input() entity: any;

  /**  */
  @Input() type: SupermindBannerType = 'repliesFromCreators';

  /**
   * For 'upgradeComment' type, we want to pass whatever comment
   * text input the user has already entered to the composer
   */
  @Input() message: string;

  displayName: string;

  constructor(
    private analytics: AnalyticsService,
    private supermindBannerPopup: SupermindBannerPopupService
  ) {}

  ngOnInit(): void {
    if (!this.entity) {
      console.error('Entity is required for m-supermind__banner');
      return;
    }

    // entity is activity
    let ownerObj = this.entity.ownerObj;

    // Entity is user
    if (this.entity.type && this.entity.type === 'user') {
      ownerObj = this.entity;
    }

    if (ownerObj && ownerObj.name) {
      this.displayName = ownerObj.name;
    }
  }

  /**
   * Tracks click event.
   */
  public trackClick(clickEventKey): void {
    this.analytics.trackClick(clickEventKey, [
      this.analytics.buildEntityContext(this.entity),
    ]);
  }

  /**
   * Called when the supermind button is clicked
   */
  onClickSupermindButton(clickEventKey): void {
    this.trackClick(clickEventKey);

    if (this.type === 'upgradeComment') {
      // Hide the banner after it has been interacted with
      this.supermindBannerPopup.visible$.next(false);
    }
  }
  /**
   * Called when a supermind is posted via the supermind button
   */
  supermindPosted(): void {
    console.log('ojm BANNER supermindPosted$ was emitted and caught');
    if (this.type === 'upgradeComment') {
      this.supermindBannerPopup.supermindPosted$.next(true);
    }
  }
}
