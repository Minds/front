import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client, Upload } from '../../../services/api';
import { InlineEditorComponent } from '../../../common/components/editors/inline-editor.component';

@Component({
  moduleId: module.id,
  selector: 'minds-admin-pages',
  templateUrl: 'pages.html',
})
export class AdminPages {
  pages: Array<any> = [];
  page: any = {
    title: 'New Page',
    body: '',
    path: '',
    menuContainer: 'footer',
    header: false,
    headerTop: 0,
    subtype: 'page',
  };
  path: string = '';
  status: string = 'saved';
  headerFile: File;
  paramsSubscription: Subscription;
  @ViewChild('inlineEditor', { static: true })
  private editor: InlineEditorComponent;

  constructor(
    public client: Client,
    public upload: Upload,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.path = params['path'];
      this.load();
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load() {
    this.client.get('api/v1/admin/pages').then((response: any) => {
      this.pages = response.pages;
    });
  }

  save(page, allowHeaderUpload = true) {
    this.status = 'saving';
    this.editor.prepareForSave().then(() => {
      this.client
        .post('api/v1/admin/pages', {
          title: page.title,
          body: page.body,
          path: page.path,
          menuContainer: page.menuContainer,
          subtype: page.subtype,
        })
        .then((response: any) => {
          if (allowHeaderUpload) {
            this.uploadHeader(page);
          }
          this.status = 'saved';
        });
    });
  }

  delete(page) {
    if (
      !confirm(
        `Are you sure you want to delete ${page.path}? This action cannot be undone.`
      )
    ) {
      return;
    }

    if (page.subtype === 'link') {
      this.newLink();
    } else {
      this.newPage();
    }
    this.client.delete(`api/v1/admin/pages/?path=${page.path}`);
    let i: any;
    for (i in this.pages) {
      if (page.path === this.pages[i].path) {
        this.pages.splice(i, 1);
        break;
      }
    }
  }

  setPage(page) {
    this.page = page;
  }

  setHeader(banner: any) {
    this.headerFile = banner.file;
    this.page.header = true;
    this.page.headerTop = banner.top;
  }

  uploadHeader(page) {
    this.upload.post(
      'api/v1/admin/pages/' + page.path + '/header',
      [this.headerFile],
      {
        headerTop: page.headerTop,
        path: page.path,
      }
    );
  }

  newPage() {
    this.page = {
      title: 'New Page',
      body: '<p><br></p>',
      path: 'new',
      menuContainer: 'footer',
      header: false,
      headerTop: 0,
      subtype: 'page',
    };
    this.editor.reset();
    this.pages.push(this.page);
  }

  newLink() {
    this.page = {
      title: 'New Link',
      body: '',
      path: 'http://',
      menuContainer: 'footer',
      header: false,
      headerTop: 0,
      subtype: 'link',
    };
    this.editor.reset();
    this.pages.push(this.page);
  }
}
