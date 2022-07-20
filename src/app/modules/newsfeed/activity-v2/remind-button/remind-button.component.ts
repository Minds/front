import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ComposerService } from '../../../composer/services/composer.service';
import { ComposerModalService } from '../../../composer/components/modal/modal.service';
import { FormToastService } from '../../../../common/services/form-toast.service';
import {
  ActivityService,
  ActivityEntity,
} from '../../activity/activity.service';
import { Session } from '../../../../services/session';
import { Client } from '../../../../services/api';
import { map } from 'rxjs/operators';
import { AuthModalService } from '../../../auth/modal/auth-modal.service';

/**
 * Button used in the activity toolbar. When clicked, a dropdown menu appears and users choose between creating a remind or a quote post.
 *
 * If the post is already reminded, the dropdown menu provides an option to delete the remind.
 */
@Component({
  selector: 'm-activityV2__remindButton',
  templateUrl: 'remind-button.component.html',
  styleUrls: ['./remind-button.component.ng.scss'],
  providers: [ComposerService],
})
export class ActivityV2RemindButtonComponent implements OnInit, OnDestroy {
  isOpened$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  count$: Observable<number> = this.service.entity$.pipe(
    map(entity => entity.reminds + entity.quotes)
  );

  constructor(
    public service: ActivityService,
    private injector: Injector,
    private composerService: ComposerService,
    private composerModalService: ComposerModalService,
    private toasterService: FormToastService,
    private session: Session,
    private authModal: AuthModalService,
    private client: Client
  ) {}

  get hasReminded(): boolean {
    const entity = this.service.entity$.getValue();
    if (!entity) {
      return false;
    }
    return (
      entity.remind_users &&
      entity.remind_users.filter(
        user => user.guid === this.session.getLoggedInUser().guid
      ).length > 0
    );
  }

  ngOnInit() {}

  ngOnDestroy() {}

  onButtonClick(e: MouseEvent): void {
    this.isOpened$.next(true);
  }

  dismissPopover(): void {
    this.isOpened$.next(false);
  }

  async onUndoRemind(e: MouseEvent): Promise<void> {
    this.dismissPopover();

    try {
      await this.client.delete(
        `api/v3/newsfeed/${this.service.entity$.getValue().urn}`
      );
      this.service.onDelete$.next(true);
      this.toasterService.success('Remind has been removed');
    } catch (e) {
      this.toasterService.error(
        e.message ||
          'Sorry, there was an error removing this Remind. Please try again later.'
      );
    }
  }

  async onRemindClick(e: MouseEvent): Promise<void> {
    if (!this.session.isLoggedIn()) {
      this.openAuthModal();
      return;
    }

    this.dismissPopover();

    const entity = this.service.entity$.getValue();
    this.composerService.reset(); // Avoid dirty data https://gitlab.com/minds/engine/-/issues/1792
    this.composerService.remind$.next(entity);
    try {
      await this.composerService.post();
    } catch (e) {
      this.toasterService.error(e);
      return;
    }
    // Update the counter
    this.incrementCounter();

    this.toasterService.success('Post has been reminded');
  }

  onQuotePostClick(e: MouseEvent): void {
    if (!this.session.isLoggedIn()) {
      this.openAuthModal();
      return;
    }

    this.dismissPopover();

    const entity = this.service.entity$.getValue();
    entity.boosted = false; // Set boosted to false to avoid compsoer showing boost label

    this.composerService.reset(); // Avoid dirty data https://gitlab.com/minds/engine/-/issues/1792
    this.composerService.remind$.next(entity);

    if (this.service.displayOptions.isModal) {
      // MH: The composer fails as it is trying to use the overlay modal
      // We need it to use stackable overlay
      this.toasterService.warn(
        'Sorry, you can not create a quoted post from inside a modal at this time. Please try from newsfeed post or make a remind.'
      );
      return;
    }

    // Open the composer modal
    this.composerModalService.setInjector(this.injector).present();
  }

  incrementCounter(): void {
    const entity = this.service.entity$.getValue();
    if (!entity.reminds) {
      entity.reminds = 0;
    }
    entity.reminds++;
    this.service.entity$.next(entity);
  }

  /**
   * Open auth modal to prompt for login or register.
   * @returns { Promise<void> }
   */
  private async openAuthModal(): Promise<void> {
    try {
      await this.authModal.open({ formDisplay: 'login' });
    } catch (e) {
      if (e === 'DismissedModalException') {
        return; // modal dismissed, do nothing
      }
      console.error(e);
    }
  }
}
