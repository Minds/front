import { Component, Inject, Input, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { Session } from '../../../services/session';
import { Client, Upload } from '../../../services/api';
import { RecentService } from '../../../services/ux/recent';
import { ContextService, ContextServiceResponse } from '../../../services/context.service';


@Component({
  selector: 'm-search--bar-suggestions',
  templateUrl: 'suggestions.component.html'
})

export class SearchBarSuggestionsComponent {

  suggestions: Array<any> = [];
  recent: any[];
  q: string = '';
  currentContext: ContextServiceResponse;
  @Input() active: boolean;
  @Input() disabled: boolean = false;

  private searchTimeout;

  constructor(
    public session: Session,
    public client: Client,
    public location: Location,
    public recentService: RecentService,
    private context: ContextService,
    private cd: ChangeDetectorRef
  ) { }

  @Input('q') set _q(value: string) {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.q = value || '';

    if (!value || this.location.path().indexOf('/search') === 0) {
      this.loadRecent();
      this.currentContext = null;
      this.suggestions = [];
      return;
    }

    this.currentContext = this.context.get();

    this.searchTimeout = setTimeout(async () => {
      this.loadRecent();

      try {
        const response: any = await this.client.get('api/v2/search/suggest', {
          q: value,
          limit: 4
        });
        this.suggestions = response.entities;
      } catch (e) {
        console.error(e);
        this.suggestions = [];
      }
    }, 300);
  }

  ngOnInit() {
    this.loadRecent();
  }

  loadRecent() {
    if (this.session.getLoggedInUser()) {
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
