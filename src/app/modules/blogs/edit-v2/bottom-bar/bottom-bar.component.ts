import { Component } from '@angular/core';
import { BlogsEditService } from '../blog-edit.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { CaptchaModalComponent } from '../../../captcha/captcha-modal/captcha-modal.component';
import { BehaviorSubject } from 'rxjs';
import { Captcha } from '../../../captcha/captcha.component';
import { FormToastService } from '../../../../common/services/form-toast.service';

export type BlogsBottomBarContainerType = 'tags' | 'meta' | '';

@Component({
  selector: 'm-blogEditor__bottomBar',
  template: `
    <div class="m-blogEditor__bottomBarTabContainer" *ngIf="activeTab$ | async">
      <div class="m-blogEditor__bottomBarTabHeader">
        <ng-container [ngSwitch]="activeTab$ | async">
          <h4 *ngSwitchCase="'meta'">META</h4>
          <h4 *ngSwitchCase="'tags'">Tags</h4>
        </ng-container>
        <m-icon iconId="expand_more" (click)="activeTab$.next('')"></m-icon>
      </div>

      <ng-container [ngSwitch]="activeTab$ | async">
        <div
          *ngSwitchCase="'meta'"
          class="m-blogEditor__metaContainer m-blogEditor__tab"
        >
          <m-blogEditor__metadata></m-blogEditor__metadata>
        </div>
        <div
          *ngSwitchCase="'tags'"
          class="m-blogEditor__tagsContainer m-blogEditor__tab"
        >
          <m-blogEditor__tags></m-blogEditor__tags>
        </div>
      </ng-container>
    </div>
    <div class="m-blogEditor__bottomBar">
      <div class="m-blogEditor__options">
        <div (click)="toggleActiveTab('tags')" class="m-blogEditor__tabToggle">
          Tags
        </div>
        <div (click)="toggleActiveTab('meta')" class="m-blogEditor__tabToggle">
          Meta
        </div>
      </div>
      <div class="m-blogEditor__saveButtons">
        <span
          class="m-blogEditor__draftSaved"
          *ngIf="service.draftSaved$ | async"
        >
          Draft Saved
        </span>
        <m-shadowboxSubmitButton
          class="m-blogEditor__saveDraftButton m-blogEditor__saveButton"
          [disabled]="!(service.canPost$ | async)"
          [saving]="service.inProgress$ | async"
          (click)="save(true)"
          i18n="@@BLOGS_EDITOR__SAVE_DRAFT"
        >
          Save Draft
        </m-shadowboxSubmitButton>
        <m-shadowboxSubmitButton
          class="m-blogEditor__saveButton"
          [disabled]="!(service.canPost$ | async)"
          [saving]="service.inProgress$ | async"
          (click)="save()"
          i18n="@@BLOGS_EDITOR__PUBLISH_BLOG"
        >
          Publish Blog
        </m-shadowboxSubmitButton>
      </div>
    </div>
  `,
})
export class BlogEditorBottomBarComponent {
  public readonly activeTab$: BehaviorSubject<
    BlogsBottomBarContainerType
  > = new BehaviorSubject<BlogsBottomBarContainerType>('');

  constructor(
    public service: BlogsEditService,
    private toast: FormToastService,
    private overlay: OverlayModalService
  ) {}

  async save(draft: boolean = false): Promise<void> {
    if (!this.validate() && this.service.canPost$) {
      return;
    }

    const modal = this.overlay.create(
      CaptchaModalComponent,
      {},
      {
        class: 'm-captcha--modal-wrapper',
        onComplete: (captcha: Captcha): void => {
          this.service.captcha$.next(captcha);
          this.service.save(draft);
        },
      }
    );
    modal.present();
  }

  validate() {
    if (!this.service.content$.getValue()) {
      this.showToastError('error:no-description');
      return false;
    }
    if (!this.service.title$.getValue()) {
      this.showToastError('error:no-title');
      return false;
    }
    return true;
  }

  showToastError(error: string): void {
    const errorDisplays: any = {
      'error:no-title': 'You must provide a title',
      'error:no-description': 'You must provide a description',
      'error:no-banner': 'You must upload a banner',
      'error:gateway-timeout': 'Gateway Time-out',
    };
    this.toast.error(errorDisplays[error] || error);
  }

  toggleActiveTab(tab: BlogsBottomBarContainerType = '') {
    const current: BlogsBottomBarContainerType = this.activeTab$.getValue();

    if (tab === current) {
      this.activeTab$.next('');
      return;
    }
    this.activeTab$.next(tab);
  }
}
