import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DiscoveryTagsService } from './tags.service';

@Component({
  selector: 'm-discovery__sidebarTags',
  templateUrl: './sidebar-tags.component.html',
})
export class DiscoverySidebarTagsComponent {
  limit = 5;
  trending$: Observable<any> = this.service.trending$;
  inProgress$: Observable<boolean> = this.service.inProgress$;

  constructor(private service: DiscoveryTagsService) {}

  ngOnInit() {
    if (!this.service.trending$.value.length) this.service.loadTags();
  }

  seeMore() {
    this.limit = 20;
  }
}
