import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DiscoveryTagsService } from './tags.service';
import { DiscoveryService } from '../discovery.service';

@Component({
  selector: 'm-discovery__sidebarTags',
  templateUrl: './sidebar-tags.component.html',
})
export class DiscoverySidebarTagsComponent implements OnInit, OnDestroy {
  limit = 5;
  trending$: Observable<any> = this.service.trending$;
  inProgress$: Observable<boolean> = this.service.inProgress$;

  parentPathSubscription: Subscription;
  parentPath: string = '/discovery';

  isPlusPage: boolean = false;

  constructor(
    private service: DiscoveryTagsService,
    private discoveryService: DiscoveryService
  ) {}

  ngOnInit() {
    if (!this.service.trending$.value.length) this.service.loadTags();

    this.parentPathSubscription = this.discoveryService.parentPath$.subscribe(
      parentPath => {
        // TODOPLUS uncomment this when we're ready to handle plus tags
        // this.parentPath = parentPath;
        // this.isPlusPage = parentPath === '/discovery/plus' ? true : false;
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
}
