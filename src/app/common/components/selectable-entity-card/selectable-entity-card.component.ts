import { Component, Inject, Input, OnInit } from '@angular/core';
import { CDN_URL } from '../../injection-tokens/url-injection-tokens';

export type SelectableEntity = {
  guid: string;
  name: string;
  type: string;
  'members:count'?: number;
};

/**
 * Small selectable card to display entities - selected state will cause
 * the avatar to become a check mark.
 */
@Component({
  selector: 'm-selectableEntityCard',
  templateUrl: 'selectable-entity-card.component.html',
  styleUrls: ['selectable-entity-card.component.ng.scss'],
})
export class SelectableEntityCardComponent implements OnInit {
  /** entity to create card for */
  @Input() entity: SelectableEntity = null;

  /** selected state - will replace avatar with checkmark when true */
  @Input() selected: boolean = false;

  // other template bound variables.
  public avatarSrc: string = null;
  public title: string = null;
  public subtext: string = null;

  constructor(@Inject(CDN_URL) private cdnUrl: string) {}

  ngOnInit(): void {
    this.avatarSrc = this.getAvatarSrc();
    this.title = this.getTitle();
    this.subtext = this.getSubtext();
  }

  /**
   * Get avatar src.
   * @returns { string } avatar src.
   */
  public getAvatarSrc(): string {
    return `${this.cdnUrl}icon/${this.entity?.guid}/large/${Date.now()}`;
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

  /**
   * Gets subtext.
   * @returns { string } subtext / subheader for card.
   */
  public getSubtext(): string {
    if (this.entity && this.entity['members:count']) {
      return `${this.entity['members:count']} Members`;
    }
  }
}
