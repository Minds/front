import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TrendingService } from '../service/trending.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigsService } from '../../../common/services/configs.service';

/**
 * Displays a list of trending hashtags and emits an action when a tag is clicked
 */
@Component({
  selector: 'm-hashtags__trending',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'trending.component.html',
})
export class TrendingComponent {
  @Input() decoration: boolean = true;

  @Output('onAction') onActionEmitter: EventEmitter<string> = new EventEmitter<
    string
  >();

  /**
   * Trending list
   */
  readonly trending$: Observable<string[]> = this.service.tags$.pipe(
    map(tags => tags.slice(0, 10))
  );

  /**
   * CDN assets URL
   */
  readonly cdnAssetsUrl: string;

  /**
   * Constructor
   * @param service
   * @param configs
   */
  constructor(protected service: TrendingService, configs: ConfigsService) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  /**
   * Initialization (load trending hashtags)
   */
  ngOnInit() {
    this.service.load();
  }

  /**
   *
   * @param tag
   */
  onAction(tag: string) {
    this.onActionEmitter.emit(tag);
  }
}
