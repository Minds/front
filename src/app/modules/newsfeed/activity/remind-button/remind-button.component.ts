import { Component, Injector, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ComposerService } from '../../../composer/services/composer.service';
import { ComposerModalService } from '../../../composer/components/modal/modal.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { ActivityService } from '../../activity/activity.service';
import { Session } from '../../../../services/session';
import { map } from 'rxjs/operators';
import { AuthModalService } from '../../../auth/modal/auth-modal.service';
import { ClientMetaDirective } from '../../../../common/directives/client-meta.directive';
import { ClientMetaData } from '../../../../common/services/client-meta.service';
import { ComposerAudienceSelectorService } from '../../../composer/services/audience.service';

/**
 * Button used in the activity toolbar. When clicked, a dropdown menu appears and users choose between creating/undoing a remind, creating a quote post or creating a group share.
 *
 */
@Component({
  selector: 'm-activity__remindButton',
  templateUrl: 'remind-button.component.html',
  styleUrls: ['./remind-button.component.ng.scss'],
  providers: [ComposerService],
})
export class ActivityRemindButtonComponent {
  count$: Observable<number> = this.service.entity$.pipe(
    map(entity => entity.reminds + entity.quotes)
  );

  @ViewChild(ClientMetaDirective) clientMeta: ClientMetaDirective;

  constructor(
    public service: ActivityService,
    private injector: Injector,
    private audienceSelectorService: ComposerAudienceSelectorService,
    private composerService: ComposerService,
    private composerModalService: ComposerModalService,
    private toasterService: ToasterService,
    private session: Session,
    private authModal: AuthModalService
  ) {}

  async getHasReminded(e: MouseEvent): Promise<void> {
    this.service.getHasReminded();
  }

  async onUndoRemind(e: MouseEvent): Promise<void> {
    await this.service.undoRemind();
  }

  async onRemindClick(e: MouseEvent): Promise<void> {
    if (!this.session.isLoggedIn()) {
      this.openAuthModal();
      return;
    }

    const entity = this.service.entity$.getValue();
    this.composerService.reset(); // Avoid dirty data https://gitlab.com/minds/engine/-/issues/1792
    this.composerService.remind$.next(entity);
    try {
      await this.composerService.post(
        this.clientMeta.build(this.getClientMetaDetails(entity))
      );
    } catch (e) {
      this.toasterService.error(e);
      return;
    }
    // Update the counter
    this.incrementCounter();

    this.toasterService.success('Post has been reminded');
  }

  /**
   * On group share click, opens composer modal to quote, starting
   * with the audience selector panel in share to group mode.
   * @returns { Promise<void> }
   */
  async onGroupShareClick(): Promise<void> {
    if (!this.session.isLoggedIn()) {
      this.openAuthModal();
      return;
    }

    const entity = this.service.entity$.getValue();

    this.composerService.reset(); // Avoid dirty data https://gitlab.com/minds/engine/-/issues/1792
    this.composerService.remind$.next(entity);
    this.audienceSelectorService.shareToGroupMode$.next(true);

    if (this.service.displayOptions.isModal) {
      this.toasterService.warn(
        'Sorry, you can not create a quoted post from inside a modal at this time. Please try from newsfeed post or make a remind.'
      );
      return;
    }

    this.composerModalService.setInjector(this.injector).present();
  }

  public getClientMetaDetails(entity: any): Partial<ClientMetaData> {
    return (this.clientMeta.clientMetaData = {
      ...this.clientMeta.clientMetaData,
      campaign: entity['urn'],
    });
  }

  onQuotePostClick(e: MouseEvent): void {
    if (!this.session.isLoggedIn()) {
      this.openAuthModal();
      return;
    }

    const entity = this.service.entity$.getValue();
    // entity.boosted = false; // Set boosted to false to avoid compsoer showing boost label

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
