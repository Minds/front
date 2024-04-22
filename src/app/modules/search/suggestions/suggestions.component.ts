import {
  Component,
  Inject,
  Input,
  ChangeDetectorRef,
  OnInit,
  PLATFORM_ID,
  EventEmitter,
  Output,
} from '@angular/core';
import { Location, isPlatformServer } from '@angular/common';
import { Session } from '../../../services/session';
import { Client } from '../../../services/api';
import { RecentService } from '../../../services/ux/recent';
import { ConfigsService } from '../../../common/services/configs.service';

/**
 * Dropdown that appears under the topbar search bar on focus
 *
 * It presents recent searches from local storage
 * or channel results from the api
 *
 * If no results are returned, it displays a link to go to discovery search results page
 */
@Component({
  selector: 'm-searchBar__suggestions',
  templateUrl: 'suggestions.component.html',
  styleUrls: ['suggestions.component.ng.scss'],
})
export class SearchBarSuggestionsComponent implements OnInit {
  @Output() mousedownEvent: EventEmitter<any> = new EventEmitter();

  @Input() bordered: boolean = true;
  @Input() active: boolean; // a.k.a. search bar is focused
  @Input() disabled: boolean = false;

  q: string = '';
  readonly cdnUrl: string;
  private searchTimeout;

  recent: Array<any> = []; // recent text/publishers from local storage
  suggestions: Array<any> = []; // channel results from api
  noResults: boolean = false;
  noRecents: boolean = false;

  inProgress: boolean = true;

  constructor(
    public session: Session,
    public client: Client,
    public location: Location,
    public recentService: RecentService,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private configs: ConfigsService
  ) {
    this.cdnUrl = this.configs.get('cdn_url');
  }

  @Input('q') set _q(value: string) {
    this.noResults = false;

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.inProgress = true;
    }

    this.q = value || '';

    if (isPlatformServer(this.platformId)) return;

    // NO QUERY INPUT
    if (!value) {
      this.inProgress = false;
      this.loadRecent();
      this.suggestions = [];
      return;
    }

    // HAS QUERY INPUT
    this.searchTimeout = setTimeout(async () => {
      this.suggestions = [];
      this.inProgress = true;
      try {
        const response: any = await this.client.get('api/v2/search/suggest', {
          q: value,
          limit: 10,
        });
        if (response && response.entities.length) {
          this.suggestions = response.entities;
        } else {
          this.noResults = true;
        }
        this.inProgress = false;
      } catch (e) {
        console.error(e);
        this.inProgress = false;
        this.noResults = true;
      }
    }, 300);
  }

  ngOnInit() {
    this.loadRecent();
  }

  clearHistory() {
    this.recentService.clearSuggestions();
    this.recent = [];
    this.noRecents = true;
  }

  loadRecent() {
    if (!this.session.getLoggedInUser()) return;
    this.recent = this.recentService.fetchSuggestions();
  }

  mousedown(e) {
    e.preventDefault();
    this.mousedownEvent.emit();

    setTimeout(() => {
      this.active = false;
      this.detectChanges();
    }, 300);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get hidden() {
    return (
      this.disabled ||
      !this.active ||
      (!this.q && ((this.recent && this.recent.length < 1) || !this.recent))
    );
  }
}
