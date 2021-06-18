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

  /**
   * Loads next elements in feed.
   * @returns { Promise<void> } - awaitable.
   */
  public async loadNext(): Promise<void> {
    if (
      this.feedsService.canFetchMore &&
      !this.feedsService.inProgress.getValue() &&
      (this.feedsService.offset.getValue() ||
        this.feedsService.offset.getValue() === 0)
    ) {
      this.feedsService.fetch(); // load the next 150 in the background
    }
    this.feedsService.loadMore();
  }
}
