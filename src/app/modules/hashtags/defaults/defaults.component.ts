import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigsService } from '../../../common/services/configs.service';
import { HashtagDefaultsService } from '../service/defaults.service';

/**
 * Default hashtags service
 */
@Component({
  selector: 'm-hashtags__defaults',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'defaults.component.html',
  providers: [HashtagDefaultsService],
})
export class HashtagsDefaultComponent {
  /**
   * Should have flame decoration icon?
   */
  @Input() decoration: boolean = true;

  /**
   * Action event
   */
  @Output('onAction') onActionEmitter: EventEmitter<string> = new EventEmitter<
    string
  >();

  /**
   * CDN assets URL
   */
  readonly cdnAssetsUrl: string;

  /**
   * Tags list
   */
  readonly tags$: Observable<Array<string>>;

  /**
   * Constructor. Sets CDN assets URL.
   * @param service
   * @param configs
   */
  constructor(
    protected service: HashtagDefaultsService,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');

    // Observable
    this.tags$ = this.service.tags$.pipe(
      map(tags => [...tags].sort(() => 0.5 - Math.random()).slice(0, 5))
    );
  }

  /**
   *
   * @param tag
   */
  onAction(tag: string) {
    this.onActionEmitter.emit(tag);
  }
}
