import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { MindsTitle } from '../../../services/ux/title';
import { ACCESS, LICENSES } from '../../../services/list-options';
import { Client, Upload } from '../../../services/api';
import { Session } from '../../../services/session';
import { InlineEditorComponent } from '../../../common/components/editors/inline-editor.component';
import { WireThresholdInputComponent } from '../../wire/threshold-input/threshold-input.component';


@Component({
  moduleId: module.id,
  selector: 'minds-blog-edit',
  host: {
    'class': 'm-blog'
  },
  templateUrl: 'edit.html'
})

export class BlogEdit {

  minds = window.Minds;

  guid: string;
  blog: any = {
    guid: 'new',
    title: '',
    description: '<p><br></p>',
    time_created: Date.now(),
    access_id: 2,
    category: '',
    license: 'attribution-sharealike-cc',
    fileKey: 'header',
    mature: 0,
    monetized: 0,
    published: 0,
    wire_threshold: null,
    custom_meta: {
      title: '',
      description: '',
      author: ''
    },
    slug: ''
  };
  banner: any;
  banner_top: number = 0;
  banner_prompt: boolean = false;
  editing: boolean = true;
  canSave: boolean = true;
  inProgress: boolean = false;
  validThreshold: boolean = true;
  error: string = '';
  pendingUploads: string[] = [];
  categories: { id, label, selected }[];

  licenses = LICENSES;
  access = ACCESS;

  paramsSubscription: Subscription;
  @ViewChild('inlineEditor') inlineEditor: InlineEditorComponent;
  @ViewChild('thresholdInput') thresholdInput: WireThresholdInputComponent;

  constructor(public session: Session, public client: Client, public upload: Upload, public router: Router, public route: ActivatedRoute, public title: MindsTitle) {
    this.getCategories();

    window.addEventListener('attachment-preview-loaded', (event: CustomEvent) => {
      this.pendingUploads.push(event.detail.timestamp);
    });
    window.addEventListener('attachment-upload-finished', (event: CustomEvent) => {
      this.pendingUploads.splice(this.pendingUploads.findIndex((value) => {
        return value === event.detail.timestamp;
      }), 1);
    });
  }

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.title.setTitle('New Blog');

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['guid']) {
        this.guid = params['guid'];

        this.blog = {
          guid: 'new',
          title: '',
          description: '<p><br></p>',
          access_id: 2,
          category: '',
          license: '',
          fileKey: 'header',
          mature: 0,
          monetized: 0,
          published: 0,
          wire_threshold: null,
          custom_meta: {
            title: '',
            description: '',
            author: ''
          },
          slug: ''
        };

        this.banner = void 0;
        this.banner_top = 0;
        this.banner_prompt = false;
        this.editing = true;
        this.canSave = true;

        if (this.guid !== 'new') {
          this.load();
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  getCategories() {
    this.categories = [];

    for (let category in window.Minds.categories) {
      this.categories.push({
        id: category,
        label: window.Minds.categories[category],
        selected: false
      });
    }

    this.categories.sort((a, b) => a.label > b.label ? 1: -1);
  }

  load() {
    this.client.get('api/v1/blog/' + this.guid, {})
      .then((response: any) => {
        if (response.blog) {
          this.blog = response.blog;
          this.guid = response.blog.guid;
          this.title.setTitle(this.blog.title);

          // draft
          if (!this.blog.published && response.blog.draft_access_id) {
            this.blog.access_id = response.blog.draft_access_id;
          }

          if (!this.blog.category)
            this.blog.category = '';

          if (!this.blog.license)
            this.blog.license = '';
        }
      });
  }

  save() {
    if (!this.canSave)
      return;

    this.inlineEditor.prepareForSave().then(() => {
      const blog = Object.assign({}, this.blog);

      // only allowed props
      blog.mature = blog.mature ? 1: 0;
      blog.monetization = blog.monetization ? 1: 0;
      blog.monetized = blog.monetized ? 1: 0;
      this.inProgress = true;
      this.canSave = false;
      this.check_for_banner().then(() => {
        this.upload.post('api/v1/blog/' + this.guid, [this.banner], blog)
          .then((response: any) => {
            this.router.navigate(response.route ? [ '/' + response.route ] : [ '/blog/view', response.guid ]);
            this.canSave = true;
            this.inProgress = false;
          })
          .catch((e) => {
            this.canSave = true;
            this.inProgress = false;
          });
      })
        .catch(() => {
          this.client.post('api/v1/blog/' + this.guid, this.blog)
            .then((response: any) => {
              if (response.guid) {
                this.router.navigate(response.route ? [ '/' + response.route ] : [ '/blog/view', response.guid ]);
              }
              this.inProgress = false;
              this.canSave = true;
            })
            .catch((e) => {
              this.inProgress = false;
              this.canSave = true;
            });
        });
    })
  }

  add_banner(banner: any) {
    var self = this;
    this.banner = banner.file;
    this.blog.header_top = banner.top;
  }

  //this is a nasty hack because people don't want to click save on a banner ;@
  check_for_banner() {
    if (!this.banner)
      this.banner_prompt = true;

    return new Promise((resolve, reject) => {
      if (this.banner)
        return resolve(true);
      setTimeout(() => {
        if (this.banner)
          return resolve(true);
        else
          return reject(false);
      }, 100);
    });
  }

  toggleMonetized() {
    if (this.blog.mature) {
      return;
    }

    this.blog.monetized = this.blog.monetized ? 0: 1;
  }

  checkMonetized() {
    if (this.blog.mature) {
      this.blog.monetized = 0;
    }
  }

  onCategoryClick(category) {
    category.selected = !category.selected;
    if (!this.blog.hasOwnProperty('categories') || !this.blog.categories) {
      this.blog['categories'] = [];
    }

    if (category.selected) {
      this.blog.categories.push(category.id);
    } else {
      this.blog.categories.splice(this.blog.categories.indexOf(category.id), 1);
    }
  }
}
