import { Component } from '@angular/core';
import { Client } from '../../../services/api';
import { Storage } from '../../../services/storage';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-suggestions__sidebar',
  templateUrl: 'sidebar.component.html',
})
export class SuggestionsSidebar {
  readonly cdnUrl: string;
  suggestions: Array<any> = [];
  lastOffset = 0;
  inProgress: boolean = false;
  error: string;

  constructor(
    private client: Client,
    private storage: Storage,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  async ngOnInit() {
    this.load();
  }

  async load() {
    this.error = null;
    this.inProgress = true;
    let limit: number = 5;

    if (this.suggestions.length) limit = 1;

    // Subscribe can not rely on next batch, so load further batch
    this.lastOffset = this.suggestions.length ? this.lastOffset + 11 : 0;

    try {
      const response: any = await this.client.get('api/v2/suggestions/user', {
        limit,
        offset: this.lastOffset,
      });
      for (let suggestion of response.suggestions) {
        const removed = this.storage.get(
          `user:suggestion:${suggestion.entity_guid}:removed`
        );
        if (!removed) {
          this.suggestions.push(suggestion);
        }
      }
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
