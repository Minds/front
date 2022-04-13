import { BehaviorSubject } from 'rxjs';
import { FeedsService } from './../../../../common/services/feeds.service';
import {
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  transition,
  animate,
  style,
  trigger,
  state,
} from '@angular/animations';

@Component({
  selector: 'm-seeLatestPostsButton',
  templateUrl: './see-latest-posts-button.component.html',
  styleUrls: ['./see-latest-posts-button.component.ng.scss'],
  animations: [
    trigger('slideIn', [
      state(
        'shown',
        style({
          transform: 'translateY(0px)',
        })
      ),
      state(
        'hidden',
        style({
          transform: 'translateY(-100px)',
        })
      ),
      transition('* => shown', [
        animate(
          '300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          style({
            transform: 'translateY(0px)',
          })
        ),
      ]),
      transition('* => dismissed', [
        animate(
          '450ms ease',
          style({
            transform: 'translateY(-100px)',
          })
        ),
      ]),
    ]),
  ],
})
export class SeeLatestPostsButtonComponent implements OnInit, OnDestroy {
  @Input()
  feedService: FeedsService;

  @Output('click')
  onClickEmitter = new EventEmitter();

  /**
   * removes the watcher interval
   */
  disposeWatcher?: () => void;

  constructor(@Inject(PLATFORM_ID) private platformId) {}

  ngOnInit(): void {
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.disposeWatcher?.();
  }

  /**
   * new posts count
   */
  get newPostsCount$(): BehaviorSubject<number> {
    return this.feedService.newPostsCount$;
  }

  /**
   * loading indicator for new posts
   */
  get loadingNewPosts$(): BehaviorSubject<boolean> {
    return this.feedService.countInProgress$;
  }

  /**
   * called when the see more button is clicked
   */
  async onClick(): Promise<void> {
    this.onClickEmitter.emit();
    await this.feedService.fetch(true);
  }

  /**
   * starts watching for new posts
   */
  private startPolling(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.disposeWatcher = this.feedService.watchForNewPosts();
  }
}
