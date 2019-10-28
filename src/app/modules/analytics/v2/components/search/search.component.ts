import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
// import { Observable, Subscription } from 'rxjs';
import {
  AnalyticsDashboardService,
  Filter,
  Option,
} from '../../dashboard.service';
import { Session } from '../../../../../services/session';

@Component({
  selector: 'm-analytics__search',
  templateUrl: './search.component.html',
})
export class AnalyticsSearchComponent implements OnInit {
  active: boolean;
  q: string;
  id: string;
  hasSearchContext: boolean = true;
  searchContext: string | Promise<string> = '';

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  constructor(
    private analyticsService: AnalyticsDashboardService,
    private session: Session
  ) {}

  ngOnInit() {}

  search() {
    // const qs: { q; ref; id? } = { q: this.q, ref: 'top' };
    // if (this.id) {
    //   qs.id = this.id;
    // }
    // if (this.featureService.has('top-feeds')) {
    //   this.router.navigate([
    //     '/newsfeed/global/top',
    //     { query: this.q, period: '24h' },
    //   ]);
    // } else {
    //   this.router.navigate(['search', qs]);
    // }
  }

  keyup(e) {
    if (e.keyCode === 13 && this.session.isLoggedIn()) {
      this.search();
      this.unsetFocus();
    }
    // TODO: allow to tab through suggestions?
  }

  focus() {
    this.active = true;
  }

  blur() {
    setTimeout(() => (this.active = false), 100);
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

  // protected getActiveSearchContext(fragments: string[]) {
  //   this.searchContext = ''; // this would be 'channels'
  //   this.id = ''; //this would be a guid

  //   fragments.forEach((fragment: string) => {
  //     let param = fragment.split('=');

  //     if (param[0] === 'q') {
  //       this.q = decodeURIComponent(param[1]);
  //     }

  //     if (param[0] === 'id') {
  //       this.id = param[1];
  //       this.searchContext = this.context.resolveLabel(
  //         decodeURIComponent(param[1])
  //       );
  //     }

  //     if (param[0] == 'type' && !this.searchContext) {
  //       this.searchContext = this.context.resolveStaticLabel(
  //         decodeURIComponent(param[1])
  //       );
  //     }
  //   });
  // }
}
