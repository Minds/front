import { Component, Inject, Input, OnInit } from '@angular/core';
import { CDN_URL } from '../../injection-tokens/url-injection-tokens';
import { SupportTier } from '../../../modules/wire/v2/support-tiers.service';

export type SelectableEntity = {
  guid: string;
  name: string;
  type: string;
  'members:count'?: number;
};

export type SelectableMonetization = SupportTier | 'plus';
/**
 * Small selectable card to display entities OR monetization tiers
 * selected state will cause the avatar to become a check mark.
 */
@Component({
  selector: 'm-selectableEntityCard',
  templateUrl: 'selectable-entity-card.component.html',
  styleUrls: ['selectable-entity-card.component.ng.scss'],
})
export class SelectableEntityCardComponent implements OnInit {
  /** entity to create card for */
  @Input() entity: SelectableEntity = null;

  /** use when the card is for selecting a monetization type
   * (e.g. Minds+ or a membership support tier)
   */
  @Input() monetization: SelectableMonetization;

  /** selected state - will replace avatar with checkmark when true */
  @Input() selected: boolean = false;

  // other template bound variables.
  public avatarSrc: string = null;
  public title: string = null;

  constructor(@Inject(CDN_URL) private cdnUrl: string) {}

  ngOnInit(): void {
    if (this.entity) {
      this.avatarSrc = this.getAvatarSrc();
      this.title = this.getTitle();
    }
  }

  /**
   * Get avatar src.
   * @returns { string } avatar src.
   */
  public getAvatarSrc(): string {
    return this.entity.type === 'user'
      ? `${this.cdnUrl}icon/${this.entity?.guid}/large/${Date.now()}`
      : `${this.cdnUrl}fs/v1/avatars/${this.entity?.guid}/${Date.now()}`;
  }

  /**
   * Gets title.
   * @returns { string } title / header for card.
   */
  public getTitle(): string {
    return this.entity && this.entity.type === 'user'
      ? 'My Channel'
      : this.entity.name ?? 'Unknown';
  }
}
