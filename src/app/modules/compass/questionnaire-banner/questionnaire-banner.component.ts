import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Session } from '../../../services/session';
import { Storage } from '../../../services/storage';
import { CompassQuestionnaireModalComponent } from '../questionnaire-modal/questionnaire-modal.component';
import { CompassService } from '../compass.service';
import { ModalService } from '../../../services/ux/modal.service';
import { ExperimentsService } from '../../experiments/experiments.service';

export const SOCIAL_COMPASS_DISMISSED_KEY: string =
  'social-compass-banner-dismissed';

@Component({
  selector: 'm-compassQuestionnaire__banner',
  templateUrl: './questionnaire-banner.component.html',
  styleUrls: ['./questionnaire-banner.component.ng.scss'],
})
export class CompassQuestionnaireBannerComponent implements OnInit, OnDestroy {
  answersProvidedSubscription: Subscription;
  answersProvided: boolean = true;
  dismissed: boolean = false;

  @HostBinding('class.m-compassQuestionnaire__banner--activityV2')
  activityV2Feature: boolean = false;

  constructor(
    private session: Session,
    private compassService: CompassService,
    private storage: Storage,
    private modalService: ModalService,
    private experiments: ExperimentsService
  ) {}

  ngOnInit(): void {
    // Fetch first so we know whether we've provided answers already
    this.compassService.fetchQuestions();

    this.answersProvidedSubscription = this.compassService.answersProvided$.subscribe(
      provided => {
        this.answersProvided = provided;

        if (provided) {
          this.modalService.dismissAll();
        }
      }
    );

    this.dismissed =
      JSON.parse(this.storage.get(SOCIAL_COMPASS_DISMISSED_KEY)) || false;

    this.activityV2Feature = this.experiments.hasVariation(
      'front-5229-activities',
      true
    );
  }

  ngOnDestroy(): void {
    this.answersProvidedSubscription.unsubscribe();
  }

  async openModal(): Promise<void> {
    this.modalService.present(CompassQuestionnaireModalComponent);
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
