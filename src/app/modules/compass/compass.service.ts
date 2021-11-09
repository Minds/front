import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormToastService } from '../../common/services/form-toast.service';
import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { Storage } from '../../services/storage';

export interface SocialCompassQuestion {
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
  fetching$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  saving$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  questions$: BehaviorSubject<
    Array<SocialCompassQuestion>
  > = new BehaviorSubject<Array<SocialCompassQuestion>>([]);

  answers$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  answersProvided$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  // This allows us to submit from different parent components
  submitRequested$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    private client: Client,
    protected toasterService: FormToastService,
    protected session: Session,
    private storage: Storage
  ) {}

  async fetchQuestions(): Promise<CompassService> {
    this.fetching$.next(true);

    //////////////////////////////////////
    // ojm switch this when the engine works

    // try {
    //   const response: any = await this.client.get(
    //     'api/v3/social-compass/questions'
    //   );

    //   if (response && response.questions) {
    //     this.questions$.next(response.questions);
    //   }

    //   if (response && response.answersProvided) {
    //     this.answersProvided$.next(response.answersProvided);
    //   }
    // } catch (e) {
    //   console.error(e);
    //   this.toasterService.error(
    //     (e && e.message) ||
    //       'There was a problem loading the social compass questions.'
    //   );
    // } finally {
    //   this.fetching$.next(false);
    // }
    //////////////////////////////////////

    //ojm remove everything below when using real client

    const response: any = {
      answersProvided: true,
      questions: [
        {
          minimumStepLabel: 'Less',
          maximumStepLabel: 'More',
          questionText: 'Political Content',
          questionId: 'PoliticalContentQuestion',
          stepSize: 10,
          defaultValue: 50,
          currentValue: 50,
          maximumRangeValue: 100,
          minimumRangeValue: 0,
        },
        {
          minimumStepLabel: 'Trustful',
          maximumStepLabel: 'Critical',
          questionText: 'Political Beliefs',
          questionId: 'PoliticalBeliefsQuestion',
          stepSize: 10,
          defaultValue: 50,
          currentValue: 50,
          maximumRangeValue: 100,
          minimumRangeValue: 0,
        },
      ],
    };

    console.log('ojm compass fetchQuestions response:', response);
    this.questions$.next(response.questions);

    this.fetching$.next(false);

    return this;
  }

  async saveAnswers(): Promise<boolean> {
    if (!this.session.isLoggedIn()) {
      this.storeAnswers();
      return true;
    }

    this.saving$.next(true);

    const answers = this.answers$.getValue();
    console.log('ojm saving answers', answers);

    try {
      await this.client.post('api/v3/social-compass/answers', {
        'social-compass-answers': answers,
      });
      this.answersProvided$.next(true);
      return true;
    } catch (e) {
      this.answersProvided$.next(false);

      console.error(e);
      this.toasterService.error(
        (e && e.message) || 'There was a problem saving your answers.'
      );
      return false;
    } finally {
      this.saving$.next(false);
    }
  }

  /**
   * For logged out users, save to local storage
   */
  storeAnswers(): boolean {
    this.storage.set('social-compass-answers', this.answers$.getValue());
    this.answersProvided$.next(true);
    return true;
  }

  // ojm put this into a GuestMode service?
  //   this.loggedInSubscription = this.session.loggedinEmitter.subscribe(is => {
  //   if (is) {

  // const answers = JSON.parse(
  //       this.storage.get('social-compass-answers')
  //     )

  // if(answers) {
  //   this.compassService.answers$.next(answers);
  //   this.compassService.saveAnswers();
  // }
  //   }
  // });
}
