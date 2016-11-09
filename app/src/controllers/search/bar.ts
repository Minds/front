import { Component, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Client, Upload } from '../../services/api';
import { MindsActivityObject } from '../../interfaces/entities';

@Component({
  selector: 'minds-search-bar',
  host: {
    '(keyup)': 'keyup($event)'
  },
  template: `
    <div class="mdl-textfield mdl-js-textfield">
        <i class="material-icons" (click)="onClick()">search</i>
        <input [(ngModel)]="q"
          name="q"
          class="mdl-textfield__input"
          type="text"
          id="search"
          autocomplete="off"
          />
        <label class="mdl-textfield__label" for="search"></label>
        <minds-search-bar-suggestions [q]="q"></minds-search-bar-suggestions>
    </div>
    `
})

export class SearchBar {

  q : string;

  constructor(public router: Router) {
  }

  ngOnInit() {
    this.listen();
  }

  ngOnDestroy() {
    this.unListen();
  }

  routerSubscription: Subscription;

  listen() {
    this.routerSubscription = this.router.events.subscribe((navigationEvent: NavigationEnd) => {
      try {
        if (navigationEvent instanceof NavigationEnd) {
          if (!navigationEvent.urlAfterRedirects) {
            return;
          }

          let url = navigationEvent.urlAfterRedirects;

          if (url.indexOf('/') === 0) {
            url = url.substr(1);
          }

          let fragments = url.replace(/\//g, ';').split(';');

          if (fragments[0] == 'search') {
            fragments.forEach((fragment: string) => {
              let param = fragment.split('=');

              if (param[0] === 'q') {
                this.q = decodeURIComponent(param[1]);
              }
            });
          } else {
            this.q = '';
          }
        }
      } catch (e) {
        console.error('Minds: router hook(SearchBar)', e);
      }
    });
  }

  unListen() {
    this.routerSubscription.unsubscribe();
  }

  search(){
    this.router.navigate(['search', { q: encodeURIComponent(this.q) }]);
  }

  keyup(e){
    if(e.keyCode == 13)
      this.search();
  }

  onClick(){
    document.getElementById("search").focus();
  }

}
