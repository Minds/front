import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { AnalyticsService } from '../../../services/analytics';

export type SupermindBannerType = 'repliesFromCreators';
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

  /** The content/context of the banner */
  @Input() type: SupermindBannerType = 'repliesFromCreators';

  /**
   * Optional text to pre-fill composer with.
   */
  @Input() message: string;

  displayName: string;

  constructor(private analytics: AnalyticsService) {}

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
  }
}
