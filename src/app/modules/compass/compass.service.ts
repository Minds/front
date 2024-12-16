import { Injectable } from '@angular/core';
import { CookieService } from '../../common/services/cookie.service';
import { BehaviorSubject } from 'rxjs';
import { ToasterService } from '../../common/services/toaster.service';
import { Client } from '../../services/api';
import { Session } from '../../services/session';

export const SOCIAL_COMPASS_ANSWERS_KEY: string = 'social-compass-answers';

export interface CompassQuestion {
  minimumStepLabel: string;
  maximumStepLabel: string;
  questionText: string;
  questionId: string;
  stepSize: number;
  defaultValue: number;
  currentValue: number;
  maximumRangeValue: number;
  minimumRangeValue: number;
}

@Injectable()
export class CompassService {
  questions$: BehaviorSubject<Array<CompassQuestion>> = new BehaviorSubject<
    Array<CompassQuestion>
  >([]);

  answers$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  answersProvided$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  // This allows us to submit from different parent components
  submitRequested$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    private client: Client,
    protected toasterService: ToasterService,
    protected session: Session,
    private cookieService: CookieService
  ) {}

  async fetchQuestions(): Promise<void> {
    try {
      const response: any = await this.client.get(
        'api/v3/social-compass/questions'
      );

      if (response) {
        this.questions$.next(response.questions);
        this.answersProvided$.next(response.answersProvided);
      }
    } catch (e) {
      console.error(e);
      this.toasterService.error(
        (e && e.message) ||
          'There was a problem loading the social compass questions.'
      );
    }
  }

  async saveAnswers(): Promise<boolean> {
    if (!this.session.isLoggedIn()) {
      this.storeEphemeralAnswers();
      return true;
    }

    const answers = this.answers$.getValue();

    try {
      const response = await this.client.post('api/v3/social-compass/answers', {
        [SOCIAL_COMPASS_ANSWERS_KEY]: answers,
      });

      if (response && response['status'] === 'success') {
        this.answersProvided$.next(true);
        this.submitRequested$.next(false);
        this.clearEphemeralAnswers();

        this.toasterService.success(
          'Thank you for your feedback and supporting the Minds Community'
        );
        return true;
      }
    } catch (e) {
      this.answersProvided$.next(false);

      console.error(e);
      this.toasterService.error(
        (e && e.message) || 'There was a problem saving your answers.'
      );

      return false;
    }
  }

  /**
   * Whether compass answers are required.
   * @returns { Promise<boolean> } - true if answers have been completed.
   */
  public async hasCompletedCompassAnswers(): Promise<boolean> {
    await this.fetchQuestions();
    return this.answersProvided$.getValue();
  }

  /**
   * For logged out users, save to cookies
   */
  storeEphemeralAnswers(): boolean {
    this.cookieService.set(
      SOCIAL_COMPASS_ANSWERS_KEY,
      JSON.stringify(this.answers$.getValue())
    );

    this.answersProvided$.next(true);
    return true;
  }

  /**
   * Remove answers from cookies when they're saved to the database
   * */
  clearEphemeralAnswers(): void {
    this.cookieService.delete(SOCIAL_COMPASS_ANSWERS_KEY);
  }
}
