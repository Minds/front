import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FeedsService } from '../../../../common/services/feeds.service';

/**
 * Contains lists of items available in the channel 'about' section.
 * Includes tabs to toggle between lists and text filter.
 */
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

  /**
   * Loads the next elements in feed.
   * @returns { Promise<void> } - awaitable.
   */
  public async loadNext(): Promise<void> {
    this.feedsService.loadNext();
  }
}
