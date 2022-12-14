import {
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FeedsService } from '../../../common/services/feeds.service';
import { Client } from '../../../services/api';
import { SuggestionsService } from '../../suggestions/channel/channel-suggestions.service';
import { DiscoveryService } from '../discovery.service';
import { DiscoveryFeedsService } from '../feeds/feeds.service';
import { CardCarouselService } from './card-carousel.service';

export type DiscoveryCardCarouselContentType = 'suggestions' | 'search';
@Component({
  selector: 'm-discovery__cardCarousel',
  templateUrl: './card-carousel.component.html',
  styleUrls: ['./card-carousel.component.ng.scss'],
  providers: [DiscoveryFeedsService, FeedsService, SuggestionsService],
})
export class DiscoveryCardCarouselComponent implements OnInit, OnDestroy {
  cards: Array<any>;

  suggestionsSubscription: Subscription;
  searchSubscription: Subscription;

  @Input() type: DiscoveryCardCarouselContentType = 'suggestions';

  isPlusPageSubscription: Subscription;
  @HostBinding('class.m-discovery__cardCarousel--hidden')
  isPlusPage: boolean = false;

  limit = 12;
  displayLimit = 6;

  constructor(
    private discoveryService: DiscoveryService,
    protected suggestionsService: SuggestionsService,
    protected discoveryFeedsService: DiscoveryFeedsService,
    protected cardCarouselService: CardCarouselService,
    protected client: Client
  ) {}

  ngOnInit(): void {
    this.isPlusPageSubscription = this.discoveryService.isPlusPage$.subscribe(
      isPlusPage => {
        this.isPlusPage = isPlusPage;
      }
    );

    if (this.type === 'suggestions') {
      this.loadSuggestions();
    }

    if (this.type === 'search') {
      this.searchSubscription = this.cardCarouselService.searchCards$.subscribe(
        searchCards => {
          this.cards = searchCards;
        }
      );
    }
  }

  async loadSuggestions(): Promise<void> {
    this.suggestionsService.load({
      limit: this.limit,
      refresh: true,
      type: 'user',
    });

    this.suggestionsSubscription = this.suggestionsService.suggestions$.subscribe(
      suggestions => {
        this.cards = suggestions;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.isPlusPageSubscription) {
      this.isPlusPageSubscription.unsubscribe();
    }
    if (this.suggestionsSubscription) {
      this.suggestionsSubscription.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
