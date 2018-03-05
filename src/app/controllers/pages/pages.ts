import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Client } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { Navigation as NavigationService } from '../../services/navigation';

@Component({
  moduleId: module.id,
  templateUrl: 'pages.html'
})

export class Pages {

  title: string = '';
  body: string = '';
  path: string = '';
  header: boolean = false;
  headerTop: number = 0;

  pages: Array<any> = [];
  page: string = '';
  @ViewChild('body', {read: ElementRef}) bodyElement:ElementRef;

  paramsSubscription: Subscription;

  constructor(
    public titleService: MindsTitle,
    public client: Client,
    public navigation: NavigationService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.titleService.setTitle('...');
    this.setUpMenu();

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['page']) {
        this.page = params['page'];
        this.load();
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load() {
    this.client.get('api/v1/admin/pages/' + this.page)
      .then((response: any) => {
        this.title = response.title;
        this.body = response.body;
        this.path = response.path;
        this.header = response.header;
        this.headerTop = response.headerTop;
        this.titleService.setTitle(this.title);
        this.bodyElement.nativeElement.innerHTML = this.body;
      });
  }

  setUpMenu() {
    this.pages = this.navigation.getItems('footer');
  }
}
