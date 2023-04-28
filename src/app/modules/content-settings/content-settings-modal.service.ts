import { Injectable, Injector } from '@angular/core';
import { ModalRef, ModalService } from '../../services/ux/modal.service';
import { FeedNoticeService } from '../notices/services/feed-notice.service';
import { ContentSettingsComponent } from './content-settings/content-settings.component';

// Options for modal
export type ModalOptions = {
  onSave: Function;
  hideCompass?: boolean;
  isOnboarding?: boolean;
};

/**
 * Service for opening and handling of the content settings modal.
 */
@Injectable({ providedIn: 'root' })
export class ContentSettingsModalService {
  /** @type { ModalRef<ContentSettingsComponent> } - modal reference */
  private modal: ModalRef<ContentSettingsComponent>;

  constructor(
    private feedNotice: FeedNoticeService,
    private modalService: ModalService,
    private injector: Injector
  ) {}

  /**
   * Open content settings modal.
   * @param { ModalOptions } options - options to open modal with.
   * @returns { void }
   */
  public open(options: ModalOptions = null): void {
    this.modal = this.modalService.present(ContentSettingsComponent, {
      data: options,
      injector: this.injector,
    });
  }

  /**
   * Dismiss modal and update the dismissal state of `update-tags` FeedNotice.
   * @returns { void }
   */
  public dismiss(): void {
    if (this.modal) {
      this.modal.dismiss();
      this.feedNotice.dismiss('update-tags');
    }
  }
}
