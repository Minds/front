import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import {
  AnalyticsDashboardService,
  Filter,
  Option,
} from '../../dashboard.service';
import { RecentService } from '../../../../../services/ux/recent';
import { Session } from '../../../../../services/session';
import { Client } from '../../../../../services/api';

@Component({
  selector: 'm-analytics__searchSuggestions',
  templateUrl: './search-suggestions.component.html',
})
export class AnalyticsSearchSuggestionsComponent implements OnInit {
  suggestions: Array<any> = [];
  recent: any[];
  q: string = '';
  private searchTimeout;
  @Input() active: boolean;

  @Input('q') set _q(value: string) {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.q = value || '';

    if (!value) {
      this.loadRecent();
      this.suggestions = [];
      return;
    }

    this.searchTimeout = setTimeout(async () => {
      this.loadRecent();

      try {
        const response: any = await this.client.get('api/v2/search/suggest', {
          q: value,
          limit: 4,
        });
        this.suggestions = response.entities;
        console.log(response.entities);
      } catch (e) {
        console.error(e);
        this.suggestions = [];
      }
    }, 300);
  }

  constructor(
    private analyticsService: AnalyticsDashboardService,
    public session: Session,
    public client: Client,
    public recentService: RecentService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadRecent();
  }

  applyChannelFilter(suggestion) {
    // TODO: remove dummy data
    let selection = suggestion.guid || 'test';

    const selectedFilterStr = `channel::${selection}`;

    // TODO: enable admin gate
    // if (this.session.isAdmin()) {
    this.analyticsService.updateFilter(selectedFilterStr);
    // }
  }
  loadRecent() {
    if (this.session.getLoggedInUser()) {
      // TODO: Q - Does this only store channels?
      this.recent = this.recentService.fetch('recent', 6);
    }
  }

  mousedown(e) {
    e.preventDefault();

    setTimeout(() => {
      this.active = false;
      this.detectChanges();
    }, 300);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
