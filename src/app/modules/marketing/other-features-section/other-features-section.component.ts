import { Component, Input } from '@angular/core';

/**
 * Bottom section for marketing pages that contains information on
 * other features, in a 3 column layout.
 */
@Component({
  selector: 'm-marketing__otherFeaturesSection',
  templateUrl: 'other-features-section.component.html',
})
export class MarketingOtherFeaturesSectionComponent {
  @Input() title: string; // title to be displayed above comments.
  @Input() column1Title: string; // column 1 title
  @Input() column1Body: string; // column 1 title, markdown supported.
  @Input() column2Title: string; // column 2 title
  @Input() column2Body: string; // column 2 title, markdown supported.
  @Input() column3Title: string; // column 3 title
  @Input() column3Body: string; // column 3 title, markdown supported.
}
