import { take } from 'rxjs/operators';
import { Component, Injector, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { DiscoveryTagsService } from './tags.service';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { ActivatedRoute } from '@angular/router';
import { DiscoveryTagSettingsComponent } from './settings.component';
import { DiscoveryService } from '../discovery.service';

type DiscoveryTagsType = 'trending' | 'your';

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
  type$: BehaviorSubject<DiscoveryTagsType> = new BehaviorSubject(null);

  @Input()
  type: DiscoveryTagsType;

  /**
   * only shows the tags list. doesn't show the feedLink button
   */
  @Input()
  listOnly: boolean = false;

  constructor(
    public route: ActivatedRoute,
    private service: DiscoveryTagsService,
    private overlayModal: OverlayModalService,
    private injector: Injector,
    private discoveryService: DiscoveryService
  ) {}

  ngOnInit() {
    this.service.loadTags();

    // if type was provided as an input, use it. Otherwise use the one from route params
    if (this.type) {
      this.type$.next(this.type);
    } else {
      this.route.params
        .pipe(take(1))
        .toPromise()
        .then(params => this.type$.next(params.type));
    }

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
