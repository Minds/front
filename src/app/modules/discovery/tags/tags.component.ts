import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DiscoveryTagsService } from './tags.service';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { ActivatedRoute } from '@angular/router';
import { DiscoveryTagSettingsComponent } from './settings.component';
import { DiscoveryService } from '../discovery.service';

@Component({
  selector: 'm-discovery__tags',
  templateUrl: './tags.component.html',
})
export class DiscoveryTagsComponent implements OnInit, OnDestroy {
  tags$: Observable<any> = this.service.tags$;
  trending$: Observable<any> = this.service.trending$;
  inProgress$: Observable<boolean> = this.service.inProgress$;

  parentPathSubscription: Subscription;
  parentPath: string = '';

  constructor(
    public route: ActivatedRoute,
    private service: DiscoveryTagsService,
    private overlayModal: OverlayModalService,
    private injector: Injector,
    private discoveryService: DiscoveryService
  ) {}

  ngOnInit() {
    this.service.loadTags();

    this.parentPathSubscription = this.discoveryService.parentPath$.subscribe(
      parentPath => {
        this.parentPath = parentPath;
      }
    );
  }

  ngOnDestroy() {
    this.parentPathSubscription.unsubscribe();
  }
}
