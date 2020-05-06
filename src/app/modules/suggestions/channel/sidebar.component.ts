import { Component, Input } from '@angular/core';
import { Client } from '../../../services/api';
import { Storage } from '../../../services/storage';
import { ConfigsService } from '../../../common/services/configs.service';
import { SuggestionsService } from './channel-suggestions.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

type SuggestionEntityTypes = 'user' | 'group';

@Component({
  selector: 'm-suggestions__sidebar',
  templateUrl: 'sidebar.component.html',
  providers: [SuggestionsService],
})
export class SuggestionsSidebar {
  readonly cdnUrl: string;

  @Input() type: SuggestionEntityTypes = 'user';

  suggestions$: BehaviorSubject<Array<any>> = this.service.suggestions$;
  limit = 12;
  displayLimit = 3;
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
      this.router.navigate([`/discovery/suggestions/${this.type}`]);
    }

    this.displayLimit = this.limit;
  }

  get title(): string {
    switch (this.type) {
      case 'user':
        return 'Suggested Channels';
        break;
      case 'group':
        return 'Suggested Groups';
        break;
    }
  }
}
