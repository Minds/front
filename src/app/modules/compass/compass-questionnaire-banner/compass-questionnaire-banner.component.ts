import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Session } from '../../../services/session';
import { Storage } from '../../../services/storage';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { CompassQuestionnaireModalComponent } from '../compass-questionnaire-modal/compass-questionnaire-modal.component';
import { CompassService } from '../compass.service';

export const SOCIAL_COMPASS_DISMISSED_KEY: string =
  'social-compass-banner-dismissed';

@Component({
  selector: 'm-compassQuestionnaire__banner',
  templateUrl: './compass-questionnaire-banner.component.html',
  styleUrls: ['./compass-questionnaire-banner.component.ng.scss'],
})
export class CompassQuestionnaireBannerComponent implements OnInit, OnDestroy {
  answersProvidedSubscription: Subscription;
  answersProvided: boolean = true;
  dismissed: boolean = false;

  constructor(
    private session: Session,
    private compassService: CompassService,
    private storage: Storage,
    private overlayModal: OverlayModalService
  ) {}

  ngOnInit(): void {
    // Fetch first so we know whether we've provided answers already
    this.compassService.fetchQuestions();

    this.answersProvidedSubscription = this.compassService.answersProvided$.subscribe(
      provided => {
        this.answersProvided = provided;

        if (provided) {
          this.overlayModal.dismiss();
        }
      }
    );

    this.dismissed =
      JSON.parse(this.storage.get(SOCIAL_COMPASS_DISMISSED_KEY)) || false;
  }

  ngOnDestroy(): void {
    this.answersProvidedSubscription.unsubscribe();
  }

  async openModal(): Promise<void> {
    this.overlayModal
      .create(CompassQuestionnaireModalComponent, null, {
        wrapperClass: 'm-modalV2__wrapper',
      })
      .present();
  }

  dismiss(): void {
    this.storage.set(SOCIAL_COMPASS_DISMISSED_KEY, true);
    this.dismissed = true;
  }

  /**
   * Show to logged in users who haven't filled it out before
   * and haven't opted out already
   */
  get show(): boolean {
    return (
      this.session.isLoggedIn() && !this.answersProvided && !this.dismissed
    );
  }
}
