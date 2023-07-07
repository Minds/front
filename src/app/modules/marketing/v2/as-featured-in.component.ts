import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * A collection of images related to news media outlets
 * that have featured Minds
 */
@Component({
  selector: 'm-marketing__asFeaturedInV2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'as-featured-in.component.html',
  styleUrls: ['as-featured-in.component.ng.scss'],
})
export class MarketingAsFeaturedInV2Component {
  @Input() inThePress: boolean = false;
}
