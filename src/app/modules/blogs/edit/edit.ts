import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, Observable } from 'rxjs';

import { ACCESS, LICENSES } from '../../../services/list-options';
import { Client, Upload } from '../../../services/api';
import { Session } from '../../../services/session';
import { InlineEditorComponent } from '../../../common/components/editors/inline-editor.component';
import { WireThresholdInputComponent } from '../../wire/threshold-input/threshold-input.component';
import { HashtagsSelectorComponent } from '../../hashtags/selector/selector.component';
import { Tag } from '../../hashtags/types/tag';
import { InMemoryStorageService } from '../../../services/in-memory-storage.service';
import { DialogService } from '../../../common/services/confirm-leave-dialog.service';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'minds-blog-edit',
  host: {
    class: 'm-blog',
  },
  templateUrl: 'edit.html',
})
export class BlogEdit {
  readonly cdnUrl: string;

  guid: string;
  blog: any = {
    guid: 'new',
    title: '',
    description: '<p><br></p>',
    time_created: Math.floor(Date.now() / 1000),
    access_id: 2,
    tags: [],
    nsfw: [],
    license: 'attribution-sharealike-cc',
    fileKey: 'header',
    mature: 0,
    monetized: 0,
    published: 0,
    wire_threshold: null,
    custom_meta: {
      title: '',
      description: '',
      author: '',
    },
    slug: '',
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
  categories: { id; label; selected }[];

  licenses = LICENSES;
  access = ACCESS;
  existingBanner: boolean;

  paramsSubscription: Subscription;
  @ViewChild('inlineEditor', { static: false })
  inlineEditor: InlineEditorComponent;
  @ViewChild('thresholdInput', { static: false })
  thresholdInput: WireThresholdInputComponent;
  @ViewChild('hashtagsSelector', { static: false })
  hashtagsSelector: HashtagsSelectorComponent;

  protected time_created: any;

  constructor(
    public session: Session,
    public client: Client,
    public upload: Upload,
    public router: Router,
    public route: ActivatedRoute,
    protected inMemoryStorageService: InMemoryStorageService,
    private dialogService: DialogService,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');

    window.addEventListener(
      'attachment-preview-loaded',
      (event: CustomEvent) => {
        this.pendingUploads.push(event.detail.timestamp);
      }
    );
    window.addEventListener(
      'attachment-upload-finished',
      (event: CustomEvent) => {
        this.pendingUploads.splice(
          this.pendingUploads.findIndex(value => {
            return value === event.detail.timestamp;
          }),
          1
        );
      }
    );
  }

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

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
          nsfw: [],
          monetized: 0,
          published: 0,
          wire_threshold: null,
          custom_meta: {
            title: '',
            description: '',
            author: '',
          },
          slug: '',
          tags: [],
        };

        this.banner = void 0;
        this.banner_top = 0;
        this.banner_prompt = false;
        this.editing = true;
        this.canSave = true;
        this.existingBanner = false;

        if (this.guid !== 'new') {
          this.editing = true;
          this.load();
        } else {
          this.editing = false;
          const description: string = this.inMemoryStorageService.once(
            'newBlogContent'
          );

          if (description) {
            let htmlDescription = description
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/\n+/g, '</p><p>');

            this.blog.description = `<p>${htmlDescription}</p>`;
          }
        }
      }
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.editing || !this.session.getLoggedInUser()) {
      return true;
    }

    return this.dialogService.confirm('Discard changes?');
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  load() {
    this.client.get('api/v1/blog/' + this.guid, {}).then((response: any) => {
      if (response.blog) {
        this.blog = response.blog;
        this.guid = response.blog.guid;

        if (this.blog.thumbnail_src) this.existingBanner = true;
        //this.hashtagsSelector.setTags(this.blog.tags);
        // draft
        if (!this.blog.published && response.blog.draft_access_id) {
          this.blog.access_id = response.blog.draft_access_id;
        }

        if (!this.blog.category) this.blog.category = '';

        if (!this.blog.license) this.blog.license = '';

        this.blog.time_created =
          response.blog.time_created || Math.floor(Date.now() / 1000);
      }
    });
  }

  onTagsChange(tags: string[]) {
    this.blog.tags = tags;
  }

  onTagsAdded(tags: Tag[]) {}

  onTagsRemoved(tags: Tag[]) {}

  validate() {
    this.error = '';

    if (!this.blog.description) {
      this.error = 'error:no-description';
      return false;
    }
    if (!this.blog.title) {
      this.error = 'error:no-title';
      return false;
    }

    return true;
  }

  posterDateSelectorError(msg) {
    this.error = msg;
  }

  save() {
    if (!this.canSave) return;

    if (!this.validate()) return;

    this.error = '';

    this.inlineEditor.prepareForSave().then(() => {
      const blog = Object.assign({}, this.blog);

      // only allowed props
      blog.nsfw = this.blog.nsfw;
      blog.mature = blog.mature ? 1 : 0;
      blog.monetization = blog.monetization ? 1 : 0;
      blog.monetized = blog.monetized ? 1 : 0;
      blog.time_created = blog.time_created || Math.floor(Date.now() / 1000);

      this.editing = false;
      this.inProgress = true;
      this.canSave = false;
      this.check_for_banner()
        .then(() => {
          this.upload
            .post('api/v1/blog/' + this.guid, [this.banner], blog)
            .then((response: any) => {
              this.inProgress = false;
              this.canSave = true;
              this.blog.time_created = null;

              if (response.status !== 'success') {
                this.error = response.message;
                return;
              }
              this.router.navigate(
                response.route
                  ? ['/' + response.route]
                  : ['/blog/view', response.guid]
              );
            })
            .catch(e => {
              this.error = e;
              this.canSave = true;
              this.inProgress = false;
            });
        })
        .catch(() => {
          this.error = 'error:no-banner';
          this.inProgress = false;
          this.canSave = true;
        });
    });
  }

  add_banner(banner: any) {
    this.banner = banner.file;
    this.blog.header_top = banner.top;
  }

  //this is a nasty hack because people don't want to click save on a banner ;@
  check_for_banner() {
    if (!this.banner) this.banner_prompt = true;
    return new Promise((resolve, reject) => {
      if (this.banner) return resolve(true);

      setTimeout(() => {
        this.banner_prompt = false;

        if (this.banner || this.existingBanner) return resolve(true);
        else return reject(false);
      }, 100);
    });
  }

  toggleMonetized() {
    if (this.blog.mature) {
      return;
    }

    this.blog.monetized = this.blog.monetized ? 0 : 1;
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

  onTimeCreatedChange(newDate) {
    this.blog.time_created = newDate;
  }

  getTimeCreated() {
    return this.blog.time_created > Math.floor(Date.now() / 1000)
      ? this.blog.time_created
      : null;
  }

  checkTimePublished() {
    return (
      !this.blog.time_published ||
      this.blog.time_published > Math.floor(Date.now() / 1000)
    );
  }

  /**
   * Sets this blog NSFW
   * @param { array } nsfw - Numerical indexes for reasons in an array e.g. [1, 2].
   */
  onNSFWSelections(nsfw) {
    this.blog.nsfw = nsfw.map(reason => reason.value);
  }
}
