import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Session } from '../../../services/session';
import { Storage } from '../../../services/storage';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { CompassQuestionnaireModalComponent } from '../compass-questionnaire-modal/compass-questionnaire-modal.component';
import { CompassService } from '../compass.service';

@Component({
  selector: 'm-compassQuestionnaire__banner',
  templateUrl: './compass-questionnaire-banner.component.html',
  styleUrls: ['./compass-questionnaire-banner.component.ng.scss'],
})
export class CompassQuestionnaireBannerComponent implements OnInit, OnDestroy {
  answersProvidedSubscription: Subscription;
  answersProvided: boolean = false;
  dismissed: boolean = false;

  constructor(
    private session: Session,
    private compassService: CompassService,
    private storage: Storage,
    private overlayModal: OverlayModalService
  ) {}

  ngOnInit(): void {
    this.answersProvidedSubscription = this.compassService.answersProvided$.subscribe(
      provided => {
        this.answersProvided = provided;
      }
    );

    this.dismissed =
      JSON.parse(this.storage.get('social-compass-banner-dismissed')) || false;

    // ojm this is temporary
    this.dismissed = false;
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
    this.storage.set('social-compass-banner-dismissed', true);
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
