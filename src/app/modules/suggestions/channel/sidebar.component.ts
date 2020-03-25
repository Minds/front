import { Component } from '@angular/core';
import { Client } from '../../../services/api';
import { Storage } from '../../../services/storage';
import { ConfigsService } from '../../../common/services/configs.service';
import { ChannelSuggestionsService } from './channel-suggestions.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'm-suggestions__sidebar',
  templateUrl: 'sidebar.component.html',
})
export class SuggestionsSidebar {
  readonly cdnUrl: string;
  suggestions$: BehaviorSubject<Array<any>> = this.service.suggestions$;
  limit = 5;
  inProgress$: Observable<boolean> = this.service.inProgress$;
  error$: Observable<string> = this.service.error$;

  constructor(
    private client: Client,
    private storage: Storage,
    private service: ChannelSuggestionsService,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  async ngOnInit() {
    if (this.suggestions$.getValue().length === 0) {
      this.service.load({
        limit: this.limit,
        refresh: true,
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
      `user:suggestion:${suggestion.entity_guid}:removed`,
      suggestion.entity_guid
    );
    await this.client.put(`api/v2/suggestions/pass/${suggestion.entity_guid}`);

    // load more
    this.service.load({ limit: 1, refresh: false });
  }

  remove(suggestion) {
    const suggestions = this.suggestions$.getValue();
    suggestions.splice(suggestions.indexOf(suggestion), 1);
    this.suggestions$.next(suggestions);
    this.storage.set(
      `user:suggestion:${suggestion.entity_guid}:removed`,
      suggestion.entity_guid
    );
    // load more
    this.service.load({ limit: 1, refresh: false });
  }
}
