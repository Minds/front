import { Component, Input } from '@angular/core';
import {
  StrapiAction,
  StrapiActionButton,
  StrapiActionResolverService,
} from '../../../common/services/strapi/strapi-action-resolver.service';

/**
 * General marketing section component.
 */
@Component({
  selector: 'm-marketing__generalSection',
  templateUrl: 'general-section.component.html',
  styleUrls: ['./general-section.component.ng.scss'],
})
export class MarketingGeneralSectionComponent {
  @Input() title: string; // title for section.
  @Input() body: string; // main body of text, markdown supported.
  @Input() leftAligned: boolean; // whether section is to be left aligned.
  @Input() imageUrl: string; // image url
  @Input() imageOverlayUrl: string; // image overlay url. optional, shows above main image.
  @Input() actionButtons: StrapiActionButton[]; // action buttons to be shown at bottom of section.
  @Input() showBodyBackground: boolean = true; // for left aligned only, background can be remove (right does not have one).
  @Input() showBackgroundEffects: boolean = true; // whether background effects (pseudo-element effects) should be added.

  constructor(private strapiActionResolver: StrapiActionResolverService) {}

  /**
   * Handle action button clicks.
   * @param { StrapiAction } action - action to handle.
   * @returns { void }
   */
  public onActionButtonClick(action: StrapiAction): void {
    this.strapiActionResolver.resolve(action);
  }
}
