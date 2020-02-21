import {
  Component,
  Inject,
  Input,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { Location } from '@angular/common';
import { Session } from '../../../services/session';
import { Client, Upload } from '../../../services/api';
import { RecentService } from '../../../services/ux/recent';
import {
  ContextService,
  ContextServiceResponse,
} from '../../../services/context.service';
import { FeaturesService } from '../../../services/features.service';

@Component({
  selector: 'm-search--bar-suggestions',
  templateUrl: 'suggestions.component.html',
})
export class SearchBarSuggestionsComponent implements OnInit {
  suggestions: Array<any> = [];
  recent: any[];
  q: string = '';
  currentContext: ContextServiceResponse;
  @Input() active: boolean;
  @Input() disabled: boolean = false;

  newNavigation: boolean = false;

  private searchTimeout;

  constructor(
    public session: Session,
    public client: Client,
    public location: Location,
    public recentService: RecentService,
    private featuresService: FeaturesService,
    private context: ContextService,
    private cd: ChangeDetectorRef
  ) {
    this.newNavigation = this.featuresService.has('navigation');
  }

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
          limit: 4,
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

  clearHistory() {
    this.recentService.clear('recent:text');
    this.recent = [];
  }

  loadRecent() {
    if (this.session.getLoggedInUser()) {
      this.recent = this.recentService.fetch('recent:text', 6);
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
