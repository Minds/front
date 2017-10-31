import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ContextService } from '../../services/context.service';

@Component({
  selector: 'm-search--bar',
  host: {
    '(keyup)': 'keyup($event)'
  },
  templateUrl: 'bar.component.html'
})

export class SearchBarComponent {

  active: boolean;
  suggestionsDisabled: boolean = false;
  q: string;
  id: string;
  routerSubscription: Subscription;
  hasSearchContext: boolean = false;
  searchContext: string | Promise<string> = '';

  @ViewChild('searchInput') searchInput: ElementRef;

  constructor(public router: Router, private context: ContextService) { }

  ngOnInit() {
    this.listen();
  }

  ngOnDestroy() {
    this.unListen();
  }

  listen() {
    this.routerSubscription = this.router.events.subscribe((navigationEvent: NavigationEnd) => {
      try {
        if (navigationEvent instanceof NavigationEnd) {
          if (!navigationEvent.urlAfterRedirects) {
            return;
          }

          this.handleUrl(navigationEvent.urlAfterRedirects);
        }
      } catch (e) {
        console.error('Minds: router hook(SearchBar)', e);
      }
    });
  }

  unListen() {
    this.routerSubscription.unsubscribe();
  }

  handleUrl(url: string) {
    if (url.indexOf('/') === 0) {
      url = url.substr(1);
    }

    let fragments = url.replace(/\//g, ';').split(';');

    if (fragments[0] === 'search') {
      this.hasSearchContext = true;
      this.suggestionsDisabled = true;
      setTimeout(() => this.getActiveSearchContext(fragments), 5);
    } else {
      this.q = '';
      this.id = '';
      this.hasSearchContext = false;
      this.suggestionsDisabled = false;
    }
  }

  focus() {
    this.active = true;
  }

  blur() {
    setTimeout(() => this.active = false, 100);
  }

  search() {
    const qs: { q, ref, id? } = { q: this.q, ref: 'top' };

    if (this.id) {
      qs.id = this.id;
    }

    this.router.navigate(['search', qs]);
  }


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

  protected getActiveSearchContext(fragments: string[]) {
    this.searchContext = '';
    this.id = '';

    fragments.forEach((fragment: string) => {
      let param = fragment.split('=');

      if (param[0] === 'q') {
        this.q = decodeURIComponent(param[1]);
      }

      if (param[0] === 'id') {
        this.id = param[1];
        this.searchContext = this.context.resolveLabel(decodeURIComponent(param[1]));
      }

      if (param[0] == 'type' && !this.searchContext) {
        this.searchContext = this.context.resolveStaticLabel(decodeURIComponent(param[1]));
      }
    });
  }
}
