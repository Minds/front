import {
  Component,
  Inject,
  Input,
  ChangeDetectorRef,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Location, isPlatformServer } from '@angular/common';
import { Session } from '../../../services/session';
import { Client, Upload } from '../../../services/api';
import { RecentService } from '../../../services/ux/recent';
import {
  ContextService,
  ContextServiceResponse,
} from '../../../services/context.service';
import { FeaturesService } from '../../../services/features.service';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-search--bar-suggestions',
  templateUrl: 'suggestions.component.html',
})
export class SearchBarSuggestionsComponent implements OnInit {
  suggestions: Array<any> = [];
  recent: any[];
  q: string = '';
  currentContext: ContextServiceResponse;
  readonly cdnUrl: string;
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
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private configs: ConfigsService
  ) {
    this.newNavigation = this.featuresService.has('navigation');
    this.cdnUrl = this.configs.get('cdn_url');
  }

  @Input('q') set _q(value: string) {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.q = value || '';

    if (isPlatformServer(this.platformId)) return;

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
