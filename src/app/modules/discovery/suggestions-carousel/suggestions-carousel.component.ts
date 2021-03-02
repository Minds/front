import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { SuggestionsService } from '../../suggestions/channel/channel-suggestions.service';
import { DiscoveryService } from '../discovery.service';

@Component({
  selector: 'm-discovery__suggestionsCarousel',
  templateUrl: './suggestions-carousel.component.html',
  styleUrls: ['./suggestions-carousel.component.ng.scss'],
  providers: [SuggestionsService],
})
export class DiscoverySuggestionsCarouselComponent
  implements OnInit, OnDestroy {
  isPlusPageSubscription: Subscription;
  isPlusPage: boolean = false;

  @Input() type: string = 'user';

  suggestions$: BehaviorSubject<Array<any>> = this.service.suggestions$;
  limit = 12;
  displayLimit = 6;
  inProgress$: Observable<boolean> = this.service.inProgress$;
  error$: Observable<string> = this.service.error$;

  constructor(
    private discoveryService: DiscoveryService,
    protected service: SuggestionsService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isPlusPageSubscription = this.discoveryService.isPlusPage$.subscribe(
      isPlusPage => {
        this.isPlusPage = isPlusPage;
      }
    );

    if (this.suggestions$.getValue().length === 0) {
      this.service.load({
        limit: this.limit,
        refresh: true,
        type: this.type,
      });
    }
  }

  ngOnDestroy(): void {
    if (this.isPlusPageSubscription) this.isPlusPageSubscription.unsubscribe();
  }
}
