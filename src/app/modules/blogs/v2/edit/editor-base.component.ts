/**
 * Base container for blogs in edit mode v2.
 * Houses banner, content and title.
 */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { Session } from '../../../../services/session';
import { InlineEditorComponent } from '../../../../common/components/editors/inline-editor.component';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { BlogsEditService } from './blog-edit.service';
import { take } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ComposerService } from '../../../composer/services/composer.service';
import { PopupService } from '../../../composer/components/popup/popup.service';

/**
 * Container for blogs in edit mode. Houses banner, content and title.
 */
@Component({
  selector: 'm-blogEditor--v2',
  host: {
    class: 'm-blog',
  },
  templateUrl: 'editor-base.component.html',
  styleUrls: ['./editor-base.component.ng.scss'],
  providers: [BlogsEditService, ComposerService, PopupService],
})
export class BlogEditorV2Component implements OnInit, OnDestroy {
  readonly cdnUrl: string;

  private paramsSubscription: Subscription;
  private errorSubscription: Subscription;

  wideBannerDate: number = 1620000000;

  @ViewChild('inlineEditor')
  inlineEditor: InlineEditorComponent;

  protected time_created: any;

  constructor(
    public session: Session,
    public router: Router,
    public route: ActivatedRoute,
    private dialogService: DialogService,
    configs: ConfigsService,
    protected location: Location,
    private toasterService: ToasterService,
    public service: BlogsEditService
  ) {
    this.cdnUrl = configs.get('cdn_url');
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

    // grab current emission from params to get user GUID
    this.paramsSubscription = this.route.params
      .pipe(take(1))
      .subscribe(params => {
        if (params['guid'] && params['guid'] !== 'new') {
          this.service.load(params['guid']);
        }
      });

    // on error change, fire toaster box.
    this.errorSubscription = this.service.error$.subscribe(val => {
      this.toasterService.error(val);
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }

  /**
   * Determines whether component can be deactivated
   * @returns { Observable<boolean> } - true if component can be deactivated.
   */
  canDeactivate(): Observable<boolean> | boolean {
    if (
      !this.canCreateBlog() ||
      !this.session.getLoggedInUser() ||
      this.service.inProgress$.getValue() ||
      this.service.isContentSaved()
    ) {
      return true;
    }
    return this.dialogService.confirm('Discard changes?');
  }

  /**
   * Checks whether a users email is confirmed.
   * @returns { boolean } - true if confirmed.
   */
  canCreateBlog(): boolean {
    return this.session.getLoggedInUser().email_confirmed;
  }

  /**
   * Upload a banner.
   * @param banner - banner to be uploaded.
   */
  uploadBanner(banner: any): void {
    this.service.addBanner(banner.files[0]);
  }

  /**
   * Called on content change
   * @param { string } val - changed content.
   */
  onContentChange(val: string): void {
    this.service.content$.next(val);
  }

  /**
   * Called on title change
   * @param { string } - Changed title.
   */
  onTitleChange(val: string): void {
    this.service.title$.next(val);
  }
}
