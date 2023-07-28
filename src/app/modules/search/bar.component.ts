import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  ParamMap,
  ActivationEnd,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { ContextService } from '../../services/context.service';
import { Session } from '../../services/session';
import { RecentService } from '../../services/ux/recent';
import { filter, startWith } from 'rxjs/operators';
import { PageLayoutService } from '../../common/layout/page-layout.service';
import {
  DiscoveryFeedsContentType,
  DiscoveryFeedsContentFilter,
} from '../discovery/feeds/feeds.service';
import { SearchBarSuggestionsComponent } from './suggestions/suggestions.component';
import { SearchGqlExperimentService } from './search-gql-experiment.service';

/**
 * Base component for the search bar used in the topbar
 *
 */
@Component({
  selector: 'm-search--bar',
  templateUrl: 'bar.component.html',
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input() showCleanIcon: boolean = false;

  active: boolean;
  suggestionsDisabled: boolean = false;
  q: string;
  filter: DiscoveryFeedsContentFilter;
  type: DiscoveryFeedsContentType;
  id: string;
  routerSubscription: Subscription;
  placeholder: string;

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild(SearchBarSuggestionsComponent)
  suggestions: SearchBarSuggestionsComponent;

  @HostBinding('class.m-search--bar--default-sizes')
  @Input()
  defaultSizes: boolean = true;

  @HostBinding('class.m-search__bar--active')
  get showBorders(): boolean {
    return !!this.q || this.active || this.hasRightPane;
  }

  pageLayoutRightPaneSubscription: Subscription;
  hasRightPane = false;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public session: Session,
    private recentService: RecentService,
    private pageLayoutService: PageLayoutService,
    private searchExp: SearchGqlExperimentService
  ) {}

  ngOnInit() {
    this.pageLayoutRightPaneSubscription = this.pageLayoutService.hasRightPane$.subscribe(
      (hasRightPane: boolean) => {
        setTimeout(() => {
          this.hasRightPane = hasRightPane;
        });
      }
    );
    this.listen();
    this.updatePlaceholder();
  }

  ngOnDestroy() {
    this.pageLayoutRightPaneSubscription.unsubscribe();
    this.unListen();
  }

  listen() {
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd),
        startWith(this.route)
      )
      .subscribe((event: ActivationEnd) => {
        try {
          const params = event.snapshot.queryParamMap;
          this.q = params.has('q') ? params.get('q') : '';
          this.filter = params.has('f')
            ? <DiscoveryFeedsContentFilter>params.get('f')
            : 'top';
          this.type = params.has('t')
            ? <DiscoveryFeedsContentType>params.get('t')
            : 'all';
        } catch (e) {
          console.error('Minds: router hook(SearchBar)', e);
        }
      });
  }

  unListen() {
    if (this.routerSubscription) this.routerSubscription.unsubscribe();
  }

  focus() {
    this.active = true;

    if (this.suggestions) this.suggestions.loadRecent();

    // move cursor to end of input
    const el = this.searchInput.nativeElement;
    if (el) {
      setTimeout(
        () => (el.selectionStart = el.selectionEnd = this.q.length),
        0
      );
    }
  }

  blur() {
    setTimeout(() => (this.active = false), 100);
  }

  search() {
    if (this.searchExp.isActive()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.q, f: this.filter, t: this.type },
      });
    } else {
      this.router.navigate(['/discovery/search'], {
        queryParams: { q: this.q, f: this.filter, t: this.type },
      });
    }

    this.recentService.storeSuggestion(
      'text',
      { value: this.q },
      entry => entry.value === this.q
    );
  }

  @HostListener('keyup', ['$event'])
  keyup(e) {
    if (e.keyCode === 13) {
      this.search();
      this.unsetFocus();
    }
  }

  setFocus() {
    if (this.searchInput.nativeElement) {
      this.searchInput.nativeElement.focus();
    }
  }

  unsetFocus() {
    if (this.searchInput.nativeElement) {
      this.searchInput.nativeElement.blur();
    }
  }

  clean() {
    this.q = '';
  }

  @HostListener('window:resize')
  onResize(e: Event) {
    this.updatePlaceholder();
  }

  updatePlaceholder(): void {
    this.placeholder = $localize`:@@COMMON__SEARCH:Search Minds`;
    if (window.innerWidth < 550) {
      this.placeholder = $localize`:@@COMMON__SEARCH__SHORT:Search`;
    }
    if (window.innerWidth < 500) {
      this.placeholder = '';
    }
  }

  moveCursorToEnd(el) {
    if (typeof el.selectionStart == 'number') {
      el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != 'undefined') {
      el.focus();
      var range = el.createTextRange();
      range.collapse(false);
      range.select();
    }
  }
}
