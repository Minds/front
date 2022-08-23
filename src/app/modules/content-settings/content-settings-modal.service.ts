import { Injectable, Injector, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { EmailConfirmationService } from '../../common/components/email-confirmation/email-confirmation.service';
import { ModalRef, ModalService } from '../../services/ux/modal.service';
import { DiscoveryTagsService } from '../discovery/tags/tags.service';
import { FeedNoticeDismissalService } from '../notices/services/feed-notice-dismissal.service';
import { ContentSettingsComponent } from './content-settings/content-settings.component';

// Options for modal
export type ModalOptions = {
  onSave: Function;
  hideCompass?: boolean;
};

/**
 * Service for opening and handling of the content settings modal.
 */
@Injectable({ providedIn: 'root' })
export class ContentSettingsModalService implements OnDestroy {
  /** @type { Subscription } - subscription that fires on email confirmation */
  private emailConfirmationSubscription: Subscription;

  /** @type { ModalRef<ContentSettingsComponent> } - modal reference */
  private modal: ModalRef<ContentSettingsComponent>;

  constructor(
    private emailConfirmation: EmailConfirmationService,
    private feedNoticeDismissal: FeedNoticeDismissalService,
    private tagsService: DiscoveryTagsService,
    private modalService: ModalService,
    private injector: Injector
  ) {
    this.setupEmailConfirmationSubscription();
  }

  ngOnDestroy(): void {
    if (this.emailConfirmationSubscription) {
      this.emailConfirmationSubscription.unsubscribe();
    }
  }

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
      this.feedNoticeDismissal.dismissNotice('update-tags');
    }
  }

  /**
   * Setup subscription to email confirmation, that will open the open automatically on confirmation.
   * @returns { void }
   */
  private setupEmailConfirmationSubscription(): void {
    if (!this.emailConfirmationSubscription) {
      this.emailConfirmationSubscription = this.emailConfirmation.success$
        .pipe(filter(Boolean), take(1))
        .subscribe(async (success: boolean) => {
          if (!(await this.tagsService.hasSetTags())) {
            this.open({
              hideCompass: true,
              onSave: () => {
                this.dismiss();
              },
            });
          }
        });
    }
  }
}
