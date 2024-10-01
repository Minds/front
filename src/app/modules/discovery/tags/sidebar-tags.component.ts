import { Component, OnInit, OnDestroy, Input, Injector } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  map,
} from 'rxjs';
import { DiscoveryTagsService } from './tags.service';
import { Session } from '../../../services/session';
import { ComposerModalService } from '../../composer/components/modal/modal.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { PermissionsService } from '../../../common/services/permissions.service';

/**
 * Display tags 'for you', trending Minds+, or related to an activity post
 */
export type DiscoverySidebarTagsContext = 'user' | 'plus' | 'activity';

/**
 * The source of tags that will be displayed
 */
export type DiscoverySidebarTagsSource = 'trending' | 'activityRelated';

@Component({
  selector: 'm-discovery__sidebarTags',
  templateUrl: './sidebar-tags.component.html',
  styleUrls: ['./sidebar-tags.component.ng.scss'],
})
export class DiscoverySidebarTagsComponent implements OnInit, OnDestroy {
  @Input() set context(value: DiscoverySidebarTagsContext) {
    if (value) {
      this._context = value;
    }
  }

  @Input() entityGuid: string;

  /**
   * What is the source/category of the tags we want to display
   */
  protected source$: BehaviorSubject<DiscoverySidebarTagsSource> =
    new BehaviorSubject<DiscoverySidebarTagsSource>(null);

  /**
   * Do we have tags to display?
   */
  protected hasTags$: Observable<boolean>;

  /**
   * Should we show the widget at all?
   */
  visible$: Observable<boolean>;

  public _context: DiscoverySidebarTagsContext;

  readonly DEFAULT_DISCOVERY_SIDEBAR_TAGS_LIMIT: number = 5;
  limit: number = this.DEFAULT_DISCOVERY_SIDEBAR_TAGS_LIMIT;

  inProgress$: Observable<boolean> = this.tagsService.inProgress$;

  trending$: Observable<any> = this.tagsService.trending$;
  activityRelated$: Observable<any> = this.tagsService.activityRelated$;

  parentPath: string = '/';

  isLoggedInSubscription: Subscription;

  isPlusPage: boolean = false;

  /** Whether the user has permission to moderate content. */
  protected readonly canModerateContent$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    public tagsService: DiscoveryTagsService,
    private session: Session,
    private composerModal: ComposerModalService,
    private injector: Injector,
    private toaster: ToasterService,
    protected permissions: PermissionsService
  ) {}

  ngOnInit() {
    if (!this._context) {
      this._context = 'user';
    }

    if (this.entityGuid) {
      this.tagsService.loadTags(true, this.entityGuid);
      this.source$.next('activityRelated');
    } else if (!this.tagsService.trending$.value.length) {
      this.tagsService.loadTags();
      this.source$.next('trending');
    }

    /**
     * Do we have any tags to show
     */
    this.hasTags$ = combineLatest([
      this.source$,
      this.activityRelated$,
      this.trending$,
    ]).pipe(
      map(([source, activityRelated, trending]) => {
        if (source === 'activityRelated') {
          return activityRelated.length > 0;
        } else {
          return trending.length > 0;
        }
      })
    );

    /**
     * Hide the widget if we are in an activity context and
     * there aren't any activity related tags
     */
    this.visible$ = combineLatest([this.source$, this.hasTags$]).pipe(
      map(([source, hasTags]) => {
        if (source === 'activityRelated') {
          return hasTags;
        } else {
          return true;
        }
      })
    );

    if (!this.session.isLoggedIn()) {
      this.limit = 12;
    }

    this.isLoggedInSubscription = this.session.loggedinEmitter.subscribe(
      (is) => {
        if (is) {
          this.limit = this.DEFAULT_DISCOVERY_SIDEBAR_TAGS_LIMIT;
        }

        this.canModerateContent$.next(
          is && this.permissions.canModerateContent()
        );
      }
    );

    this.canModerateContent$.next(this.permissions.canModerateContent());
  }

  ngOnDestroy() {
    this.isLoggedInSubscription?.unsubscribe();
  }

  seeMore() {
    this.limit = 20;
  }

  /**
   * Open composer modal
   * @returns { Promise<void> } - awaitable.
   */
  public async openComposerModal(): Promise<void> {
    try {
      await this.composerModal
        .setInjector(this.injector)
        .onPost((activity) => {
          if (this.source$.value === 'trending') {
            this.toaster.success(
              "Nice! If you added hashtags to your post, they'll show up in the sidebar in a few minutes"
            );
          }
        })
        .present();
    } catch (e) {
      console.error(e);
    }
  }

  get title(): string {
    switch (this._context) {
      case 'plus':
        return 'Trending Minds+ Tags';
      case 'activity':
        return 'Related tags';
      default:
        return 'Trending tags';
    }
  }
}
