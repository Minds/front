import { Component } from '@angular/core';
import { BlogsEditService } from '../blog-edit.service';
import { CaptchaModalComponent } from '../../../../captcha/captcha-modal/captcha-modal.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Captcha } from '../../../../captcha/captcha.component';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { ModalService } from '../../../../../services/ux/modal.service';

export type BlogsBottomBarContainerType = 'tags' | 'meta' | 'monetize' | '';

/**
 * Base bottom bar component for blogs in edit mode v2.
 * Includes the popup drawer and logic.
 */
@Component({
  selector: 'm-blogEditor__bottomBar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.ng.scss'],
})
export class BlogEditorBottomBarComponent {
  /**
   * Currently active drawer tab.
   */
  public readonly activeTab$: BehaviorSubject<
    BlogsBottomBarContainerType
  > = new BehaviorSubject<BlogsBottomBarContainerType>('');

  /**
   * Tags subscription
   */
  tagsSubscription: Subscription;

  /**
   * Tags subscription
   */
  monetizeSubscription: Subscription;

  constructor(
    public service: BlogsEditService,
    private toast: ToasterService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.tagsSubscription = this.service.tags$.subscribe(() => {
      if (this.activeTab$.value === 'tags') {
        this.activeTab$.next('');
      }
    });
    this.monetizeSubscription = this.service.monetize$.subscribe(() => {
      if (this.activeTab$.value === 'monetize') {
        this.activeTab$.next('');
      }
    });
  }

  ngOnDestory() {
    this.tagsSubscription.unsubscribe();
    this.monetizeSubscription.unsubscribe();
  }

  /**
   * Validate, show captcha modal and save on completion.
   * @param { boolean } draft - if true, will save draft (stays in editor)
   * @returns { Promise<void> } - awaitable
   */
  async save(draft: boolean = false): Promise<void> {
    if (!(await this.validate())) {
      return;
    }
    this.modalService.present(CaptchaModalComponent, {
      data: {
        onComplete: (captcha: Captcha): void => {
          this.service.captcha$.next(captcha);
          this.service.save(draft);
        },
      },
    });
  }

  /**
   * Pre-save validation.
   * @returns { Promise<boolean> } - true if pass.
   */
  private async validate(): Promise<boolean> {
    if (!this.service.content$.getValue()) {
      this.showToastError('error:no-description');
      return false;
    }
    if (!this.service.title$.getValue()) {
      this.showToastError('error:no-title');
      return false;
    }
    if (!this.service.banner$.getValue()) {
      this.showToastError('error:no-banner');
      return false;
    }
    return true;
  }

  /**
   * Show toast error using either error code or feeding in a string
   * @param { string } - user validated string.
   */
  showToastError(error: string): void {
    const errorDisplays: any = {
      'error:no-title': 'You must provide a title',
      'error:no-description': 'Your blog must have content',
      'error:no-banner': 'You must upload a banner',
      'error:gateway-timeout': 'Gateway Time-out',
    };
    this.toast.error(errorDisplays[error] || error);
  }

  /**
   * Toggles active tab. If value is the current value, sets to null.
   * @param { BlogsBottomBarContainerType } - 'tags', 'meta' etc...
   */
  toggleActiveTab(tab: BlogsBottomBarContainerType = ''): void {
    const current: BlogsBottomBarContainerType = this.activeTab$.getValue();

    if (tab === current) {
      this.activeTab$.next('');
      return;
    }
    this.activeTab$.next(tab);
  }
}
