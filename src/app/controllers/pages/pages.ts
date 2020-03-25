import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client } from '../../services/api';
import { Navigation as NavigationService } from '../../services/navigation';
import { MetaService } from '../../common/services/meta.service';
import { PagesService } from '../../common/services/pages.service';

@Component({
  selector: 'm-pages',
  moduleId: module.id,
  templateUrl: 'pages.html',
})
export class Pages {
  title: string = '';
  body: string = '';
  path: string = '';
  header: boolean = false;
  headerTop: number = 0;

  pages: Array<any> = [];
  page: string = '';
  @ViewChild('body', { read: ElementRef, static: true })
  bodyElement: ElementRef;

  paramsSubscription: Subscription;

  constructor(
    public metaService: MetaService,
    public client: Client,
    public navigation: NavigationService,
    public route: ActivatedRoute,
    public pagesService: PagesService
  ) {}

  ngOnInit() {
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
    this.client.get('api/v1/admin/pages/' + this.page).then((response: any) => {
      this.title = response.title;
      this.body = response.body;
      this.path = response.path;
      this.header = response.header;
      this.headerTop = response.headerTop;
      this.updateMeta();
      this.bodyElement.nativeElement.innerHTML = this.body;
    });
  }

  setUpMenu() {
    this.pages = this.navigation.getItems('footer');
  }

  private updateMeta(): void {
    const description =
      this.body.length > 140 ? this.body.substr(0, 140) + '...' : this.body;
    this.metaService
      .setTitle(this.title)
      .setDescription(description)
      .setOgImage(`/fs/v1/pages/${this.path}`);
  }
}
