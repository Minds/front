import { Component, Input } from '@angular/core';
import { Client } from '../../../services/api';
import { Storage } from '../../../services/storage';
import {
  Mechanism,
  SuggestionsService,
} from '../../../common/services/suggestions.service';

@Component({
  providers: [SuggestionsService],
  selector: 'm-suggestions__sidebar',
  templateUrl: 'sidebar.component.html',
})
export class SuggestionsSidebar {
  minds = window.Minds;
  suggestions: Array<any> = [];
  offset: number = 0;
  inProgress: boolean = false;
  error: string;

  @Input() mechanism: Mechanism = 'graph';

  constructor(
    protected client: Client,
    protected storage: Storage,
    protected service: SuggestionsService
  ) {}

  async ngOnInit() {
    this.service.setMechanism(this.mechanism);

    this.load();
  }

  async load() {
    this.error = null;
    this.inProgress = true;
    let limit: number = 5 - this.suggestions.length; // Always show 5

    try {
      const suggestions = await this.service.get({
        limit,
        offset: this.offset,
      });

      this.offset += suggestions.length;
      this.suggestions.push(...suggestions);
    } catch (err) {
      this.error = err.message;
    } finally {
      this.inProgress = false;
    }
  }

  async pass(suggestion, e) {
    e.preventDefault();
    e.stopPropagation();
    this.suggestions.splice(this.suggestions.indexOf(suggestion), 1);
    this.storage.set(
      `user:suggestion:${suggestion.entity_guid}:removed`,
      suggestion.entity_guid
    );
    await this.client.put(`api/v2/suggestions/pass/${suggestion.entity_guid}`);

    // load more
    this.load();
  }

  remove(suggestion) {
    this.suggestions.splice(this.suggestions.indexOf(suggestion), 1);
    this.storage.set(
      `user:suggestion:${suggestion.entity_guid}:removed`,
      suggestion.entity_guid
    );
    // load more
    this.load();
  }
}
