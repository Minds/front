import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, Observable, BehaviorSubject } from 'rxjs';

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
import { FeaturesService } from '../../../services/features.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import { BlogsEditService } from './blog-edit.service';
import { CaptchaModalComponent } from '../../captcha/captcha-modal/captcha-modal.component';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Captcha } from '../../captcha/captcha.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'm-blogEditor--v2',
  host: {
    class: 'm-blog',
  },
  templateUrl: 'edit.html',
})
export class BlogEditorV2Component implements OnInit, OnDestroy {
  readonly cdnUrl: string;

  captcha: string;
  banner: any;
  banner_top: number = 0;
  banner_prompt: boolean = false;
  editing: boolean = true;
  inProgress: boolean = false;
  validThreshold: boolean = true;
  error: string = '';
  pendingUploads: string[] = [];
  categories: { id; label; selected }[];

  licenses = LICENSES;
  access = ACCESS;
  existingBanner: boolean;

  paramsSubscription: Subscription;
  errorSubscription: Subscription;
  @ViewChild('inlineEditor')
  inlineEditor: InlineEditorComponent;
  @ViewChild('thresholdInput')
  thresholdInput: WireThresholdInputComponent;
  @ViewChild('hashtagsSelector')
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
    public featuresService: FeaturesService,
    configs: ConfigsService,
    private location: Location,
    private toasterService: FormToastService,
    public service: BlogsEditService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  canCreateBlog(): boolean {
    return this.session.getLoggedInUser().email_confirmed;
  }

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.canCreateBlog()) {
      this.toasterService.error(
        'Please confirm your email address before creating a blog'
      );
      this.location.back();
      return;
    }

    this.paramsSubscription = this.route.params
      .pipe(take(1))
      .subscribe(params => {
        if (params['guid'] && params['guid'] !== 'new') {
          this.service.load(params['guid']);
        }
      });

    this.errorSubscription = this.service.error$.subscribe(val => {
      this.toasterService.error(val);
    });
  }

  onContentChange(val: string): void {
    this.service.content$.next(val);
  }

  onTitleChange(val: string): void {
    this.service.title$.next(val);
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (
      !this.canCreateBlog() ||
      !this.editing ||
      !this.session.getLoggedInUser()
    ) {
      return true;
    }

    return this.dialogService.confirm('Discard changes?');
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }

  uploadBanner(banner) {
    console.log('uploading banner');
    this.service.addBanner(banner.files[0]);
  }

  onTagsChange(tags: string[]) {
    this.service.tags$.next(tags);
  }

  /**
   * Sets this blog NSFW
   * @param { array } nsfw - Numerical indexes for reasons in an array e.g. [1, 2].
   */
  onNSFWSelections(nsfw) {
    this.service.nsfw$.next(nsfw.map(reason => reason.value));
  }
}
