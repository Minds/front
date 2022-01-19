import { Component, Input } from '@angular/core';
import { Client } from '../../../services/api';
import { Storage } from '../../../services/storage';
import { ConfigsService } from '../../../common/services/configs.service';
import { SuggestionsService } from './channel-suggestions.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

type SuggestionEntityTypes = 'user' | 'group';

/**
 * Allows custom title overrides. Direct string titles cannot be localized
 * so we must use an ID instead and check for it in the title getter.
 */
export type CustomTitleIdentifier = 'popular_channels' | '';

@Component({
  selector: 'm-suggestions__sidebar',
  templateUrl: 'sidebar.component.html',
  providers: [SuggestionsService],
  styleUrls: ['../sidebar.component.ng.scss'],
})
export class SuggestionsSidebar {
  readonly cdnUrl: string;

  @Input() type: SuggestionEntityTypes = 'user';

  // allows a custom title to be set in the title getter.
  @Input() customTitle: CustomTitleIdentifier = '';

  @Input() isPlusPage: boolean = false;

  suggestions$: BehaviorSubject<Array<any>> = this.service.suggestions$;
  limit = 12;
  displayLimit = 6;
  inProgress$: Observable<boolean> = this.service.inProgress$;
  error$: Observable<string> = this.service.error$;

  constructor(
    private client: Client,
    private storage: Storage,
    private service: SuggestionsService,
    private router: Router,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  async ngOnInit() {
    console.log('ojm sidebar init');
    if (this.suggestions$.getValue().length === 0) {
      this.service.load({
        limit: this.limit,
        refresh: true,
        type: this.type,
      });
    }
  }

  async pass(suggestion, e) {
    e.preventDefault();
    e.stopPropagation();
    const suggestions = this.suggestions$.getValue();
    suggestions.splice(suggestions.indexOf(suggestion), 1);
    this.suggestions$.next(suggestions);
    this.storage.set(
      `suggestion:${suggestion.entity_guid}:removed`,
      suggestion.entity_guid
    );

    // TODOPLUS make it plus-specific when isPlusPage
    await this.client.put(`api/v2/suggestions/pass/${suggestion.entity_guid}`);

    // load more
    this.service.load({ limit: 1, refresh: false, type: this.type });
  }

  remove(suggestion) {
    const suggestions = this.suggestions$.getValue();
    suggestions.splice(suggestions.indexOf(suggestion), 1);
    this.suggestions$.next(suggestions);
    this.storage.set(
      `suggestion:${suggestion.entity_guid}:removed`,
      suggestion.entity_guid
    );
    // load more
    this.service.load({ limit: 1, refresh: false, type: this.type });
  }

  seeMore() {
    if (this.displayLimit === this.limit) {
      // Already tapped once, so go to full view page
      // TODOPLUS make it plus-specific when isPlusPage
      this.router.navigate([`/discovery/suggestions/${this.type}`]);
    }

    this.displayLimit = this.limit;
  }

  get title(): string {
    if (this.customTitle === 'popular_channels') {
      return $localize`:@@SUGGESTIONS__POPULAR_CHANNELS__TITLE:Popular Channels`;
    }
    if (this.isPlusPage && this.type === 'user') {
      return $localize`:@@SUGGESTIONS__PLUS_CHANNEL__TITLE:Top Minds+ Channels`;
    }
    switch (this.type) {
      case 'user':
        return $localize`:@@SUGGESTIONS__CHANNEL__TITLE:Suggested Channels`;
        break;
      case 'group':
        return $localize`:@@SUGGESTIONS__GROUP__TITLE:Suggested Groups`;
        break;
    }
  }
}
