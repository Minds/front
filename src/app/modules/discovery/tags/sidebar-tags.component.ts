import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DiscoveryTagsService } from './tags.service';
import { DiscoveryService } from '../discovery.service';

/**
 * Display tags 'for you', trending Minds+, or related to an activity post
 */
export type DiscoverySidebarTagsContext = 'user' | 'plus' | 'activity';
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

  public _context: DiscoverySidebarTagsContext;

  visible = true;
  limit = 5;
  trending$: Observable<any> = this.service.trending$;
  foryou$: Observable<any> = this.service.foryou$;
  activityRelated$: Observable<any> = this.service.activityRelated$;
  inProgress$: Observable<boolean> = this.service.inProgress$;

  parentPathSubscription: Subscription;
  parentPath: string = '/discovery';

  activityRelatedTagsSubscription: Subscription;

  isPlusPage: boolean = false;

  constructor(
    private service: DiscoveryTagsService,
    private discoveryService: DiscoveryService,
    public tagsService: DiscoveryTagsService
  ) {}

  ngOnInit() {
    if (!this._context) {
      this._context = 'user';
    }

    if (this.entityGuid) {
      this.service.loadTags(true, this.entityGuid);
    } else if (!this.service.trending$.value.length) {
      this.service.loadTags();
    }

    this.activityRelatedTagsSubscription = this.tagsService.activityRelated$.subscribe(
      tags => {
        if (this.entityGuid) {
          this.visible = tags && tags.length > 0 ? true : false;
        } else {
          this.visible = true;
        }
      }
    );

    this.parentPathSubscription = this.discoveryService.parentPath$.subscribe(
      parentPath => {
        // TODOPLUS uncomment this when we're ready to handle plus tags
        // this.parentPath = parentPath;
        // this.isPlusPage = parentPath === '/discovery/plus' ? true : false;
        // if (this.isPlusPage && this._context !== 'activity') {
        //   this._context = 'plus';
        // }
      }
    );
  }

  ngOnDestroy() {
    if (this.parentPathSubscription) {
      this.parentPathSubscription.unsubscribe();
    }
  }

  seeMore() {
    this.limit = 20;
  }

  get title(): string {
    switch (this._context) {
      case 'plus':
        return 'Trending Minds+ Tags';
      case 'activity':
        return 'Related tags';
      default:
        // return 'Tags for you';
        return 'Trending tags';
    }
  }
}
