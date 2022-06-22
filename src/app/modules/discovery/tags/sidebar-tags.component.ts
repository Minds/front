import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DiscoveryTagsService } from './tags.service';

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
  trending$: Observable<any> = this.tagsService.trending$;
  foryou$: Observable<any> = this.tagsService.foryou$;
  activityRelated$: Observable<any> = this.tagsService.activityRelated$;
  inProgress$: Observable<boolean> = this.tagsService.inProgress$;

  parentPathSubscription: Subscription;
  parentPath: string = '/discovery';

  activityRelatedTagsSubscription: Subscription;

  isPlusPage: boolean = false;

  constructor(public tagsService: DiscoveryTagsService) {}

  ngOnInit() {
    if (!this._context) {
      this._context = 'user';
    }

    if (this.entityGuid) {
      this.tagsService.loadTags(true, this.entityGuid);
    } else if (!this.tagsService.trending$.value.length) {
      this.tagsService.loadTags();
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
  }

  ngOnDestroy() {
    if (this.activityRelatedTagsSubscription) {
      this.activityRelatedTagsSubscription.unsubscribe();
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
