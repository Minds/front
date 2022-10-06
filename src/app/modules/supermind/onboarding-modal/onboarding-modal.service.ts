import { Injectable, Injector } from '@angular/core';
import { AnalyticsService } from '../../../services/analytics';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { ModalService } from '../../../services/ux/modal.service';
import { SupermindOnboardingModalComponent } from './onboarding-modal.component';

export type SupermindOnboardingContentType = 'reply' | 'request';

@Injectable()
export class SupermindOnboardingModalService {
  constructor(
    private injector: Injector,
    private modalService: ModalService,
    private session: Session,
    private client: Client,
    protected analytics: AnalyticsService
  ) {}
  contentType: SupermindOnboardingContentType = 'reply';
  user;

  /**
   * Presents the onboarding modal
   * @param injector
   */
  async open(): Promise<any> {
    if (!this.session.isLoggedIn()) {
      return;
    }

    const { SupermindOnboardingModalModule } = await import(
      './onboarding-modal.module'
    );

    const modal = this.modalService.present(SupermindOnboardingModalComponent, {
      lazyModule: SupermindOnboardingModalModule,
      data: {
        contentType: this.contentType,
        onComplete: () => {
          modal.dismiss();
        },
      },
      keyboard: false,
      injector: this.injector,
      size: 'lg',
    });

    return modal.result.finally(() => {
      this.completeOnboarding();
      this.injector = void 0;
    });
  }

  // Check if user has seen this modal already
  public hasBeenSeenAlready(): boolean {
    this.user = this.session.getLoggedInUser();

    const dismissedWidgets = this.user ? this.user.dismissed_widgets : [];

    return !(dismissedWidgets && dismissedWidgets.indexOf(this.id) < 0);
  }

  public completeOnboarding(): void {
    // Send view to analytics
    this.analytics.trackView(this.id);

    // Dismiss the modal widget so it won't appear again
    this.client.put(`api/v3/dismissible-widgets/${this.id}`);

    if (this.user) {
      this.user.dismissed_widgets.push(this.id);
    }
  }

  public setContentType(contentType: SupermindOnboardingContentType) {
    this.contentType = contentType;
  }

  get id(): string {
    return `supermind-onboarding-modal-${this.contentType}`;
  }
}
