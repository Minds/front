//
import {
  Component,
  ComponentFactoryResolver,
  ViewRef,
  ChangeDetectorRef,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedsService } from '../../../../common/services/feeds.service';
import { BoostConsoleType } from '../console.component';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * The component for the boost console.
 * Route: /create
 */
@Component({
  selector: 'm-boost-console-booster',
  templateUrl: 'booster.component.html',
  providers: [FeedsService],
})
export class BoostConsoleBooster {
  /* type of the feed to display */
  @Input('type') type: BoostConsoleType;

  /* poster component */
  @ViewChild('poster', { read: ViewContainerRef })
  poster: ViewContainerRef;

  feed$: Observable<BehaviorSubject<Object>[]>;
  componentRef;
  inProgress = true;
  loaded = false;
  noContent = false;

  constructor(
    public client: Client,
    public session: Session,
    private route: ActivatedRoute,
    public feedsService: FeedsService,
    private cd: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  /**
   * subscribes to route parent url and loads component.
   */
  ngOnInit() {
    this.loaded = false;
    this.route.parent.url.subscribe(segments => {
      this.type = <BoostConsoleType>segments[0].path;
      this.load(true);
      this.loaded = true;
    });
  }

  /**
   * Loads the infinite feed for the respective parent route.
   * @param { boolean } refresh - is the state refreshing?
   */
  load(refresh?: boolean) {
    if (!refresh) {
      return;
    }

    if (refresh) {
      this.feedsService.clear();
    }

    this.inProgress = true;
    this.feedsService
      .setEndpoint(
        this.type === 'content'
          ? `api/v2/feeds/container/${
              this.session.getLoggedInUser().guid
            }/objects`
          : `api/v2/feeds/container/${
              this.session.getLoggedInUser().guid
            }/activities`
      )
      .setParams({ sync: true })
      .setLimit(12)
      .fetch();
    this.feed$ = this.feedsService.feed;
    this.inProgress = false;
    this.loaded = true;
    this.feed$.subscribe(feed => (this.noContent = feed.length > 0));
  }

  /**
   * Loads next data in feed.
   * @param feed - the feed to reload.
   */
  loadNext() {
    if (
      this.feedsService.canFetchMore &&
      !this.feedsService.inProgress.getValue() &&
      this.feedsService.offset.getValue()
    ) {
      this.feedsService.fetch(); // load the next 150 in the background
    }
    this.feedsService.loadMore();
  }

  /**
   * Detects changes if view is not destroyed.
   */
  detectChanges() {
    if (!(this.cd as ViewRef).destroyed) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }

  /**
   * Detaches change detector on destroy
   */
  ngOnDestroy = () => this.cd.detach();
}
