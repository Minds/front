import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
} from '@angular/core';
import { CDN_ASSETS_URL } from '../../../common/injection-tokens/url-injection-tokens';

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
