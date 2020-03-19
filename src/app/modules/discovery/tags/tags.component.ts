import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DiscoveryTagsService } from './tags.service';

@Component({
  selector: 'm-discovery__tags',
  templateUrl: './tags.component.html',
})
export class DiscoveryTagsComponent {
  tags$: Observable<any> = this.service.tags$;
  trending$: Observable<any> = this.service.trending$;
  inProgress$: Observable<boolean> = this.service.inProgress$;

  constructor(private service: DiscoveryTagsService) {}

  ngOnInit() {
    this.service.loadTags();
  }
}
