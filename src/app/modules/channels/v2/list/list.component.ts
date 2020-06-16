import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FeedsService } from '../../../../common/services/feeds.service';

@Component({
  selector: 'm-channel__list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'list.component.html',
})
export class ChannelListComponent {
  /**
   * Feeds Service
   */
  @Input() feedsService: FeedsService;

  /**
   * Can the user search?
   */
  @Input() canSearch: boolean = false;

  /**
   * Search event
   */
  @Output('onSearch') onSearchEmitter: EventEmitter<string> = new EventEmitter<
    string
  >();

  /**
   * Search query
   */
  query: string = '';

  /**
   * Emit a search event
   */
  search(): void {
    this.onSearchEmitter.emit(this.query);
  }
}
