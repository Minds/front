import {
  Component,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  SkipSelf,
} from '@angular/core';
import { GroupService } from './group.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GroupSeoService } from './services/seo.service';
import { Session } from '../../../services/session';
import { RecentService } from '../../../services/ux/recent';
import { ClientMetaDirective } from '../../../common/directives/client-meta.directive';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { PublisherSearchModalService } from '../../../common/services/publisher-search-modal.service';
import { MindsGroup } from './group.model';
import { GroupsSearchService } from '../profile/feed/search.service';

/**
 * Base container for all groupV2 page components
 */
@Component({
  selector: 'm-group',
  templateUrl: 'group.component.html',
  styleUrls: ['group.component.ng.scss'],
  providers: [GroupService, GroupSeoService],
})
export class GroupComponent implements OnInit, OnDestroy {
  protected currentGroup: MindsGroup;

  protected encodedQuery: string;

  private subscriptions: Subscription[] = [];

  constructor(
    public service: GroupService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected session: Session,
    protected seo: GroupSeoService,
    protected recent: RecentService,
    @Optional() @SkipSelf() protected parentClientMeta: ClientMetaDirective,
    protected clientMetaService: ClientMetaService,
    protected toasterService: ToasterService,
    protected injector: Injector,
    protected publisherSearchModal: PublisherSearchModalService,
    protected v1SearchService: GroupsSearchService
  ) {}

  /**
   * Component initialization
   */
  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        // Get group guid, view and filter from url
        if (params['guid'] && params['guid'] !== this.currentGroup?.guid) {
          this.service.guid$.next(params['guid']);
        }
        if (params['view']) {
          this.service.view$.next(params['view']);
        }
        if (params['filter']) {
          if (params['view'] && params['view'] === 'feed') {
            this.service.filter$.next(params['filter']);
          }
        }
      }),
      this.route.queryParamMap.subscribe((params: ParamMap) => {
        if (params.has('editing')) {
          // Reset editing$ subject after we're done editing
          this.service.editing$.next(params['editing']);
        }

        // Handle search query param when provided via url
        let query = '';
        if (params.has('query')) {
          query = decodeURIComponent(params.get('query'));
        }

        this.service.query$.next(query);
      }),

      this.service.query$.subscribe(query => {
        this.encodedQuery = query.length ? encodeURIComponent(query) : null;

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            query: this.encodedQuery,
          },
          queryParamsHandling: 'merge',
        });

        // Allows legacy feed service to search with a query param
        this.v1SearchService.query$.next(query);
      }),

      this.service.group$.subscribe(group => {
        if (group) {
          this.currentGroup = group;
          this.seo.set(group);
        }
      }),

      this.service.editing$.subscribe(editing => {
        // Go back to v1 groups for editing until we make a new design
        if (editing) {
          this.router.navigate(
            ['groups', 'profile', this.currentGroup?.guid, 'feed'],
            { queryParams: { editing: true } }
          );
        }
      })
    );
  }

  /**
   * Opens search modal
   */
  async openSearchModal(event): Promise<void> {
    const query = await this.publisherSearchModal.pick(
      this.injector,
      this.currentGroup
    );

    if (query) {
      this.service.query$.next(query);
    }
  }

  /**
   * Component destruction
   */
  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Can navigate away?
   */
  canDeactivate(): boolean {
    return true;
  }
}
