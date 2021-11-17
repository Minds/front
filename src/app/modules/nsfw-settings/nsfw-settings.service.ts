import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormToastService } from '../../common/services/form-toast.service';
import { Client } from '../../services/api';
import { Session } from '../../services/session';

@Injectable()
export class NsfwSettingsService {
  settings$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  // This allows us to submit from different parent components
  submitRequested$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    private client: Client,
    protected toasterService: FormToastService,
    protected session: Session
  ) {}

  async fetchSettings(): Promise<void> {
    console.log('ojm nsfwSettings fetchSettings');

    // try {
    //   const response: any = await this.client.get(
    //     'api/v3/social-compass/questions'
    //   );
    //   if (response) {
    //     // this.settings$.next(response.settings); ojm
    //   }
    // } catch (e) {
    //   console.error(e);
    //   this.toasterService.error(
    //     (e && e.message) || 'There was a problem loading your nsfw settings.'
    //   );
    // }
  }

  async saveSettings(): Promise<boolean> {
    const settings = this.settings$.getValue();

    console.log('ojm nsfwSettings saveSettings', settings);

    // ojm add to this.discoveryFeedsSettings

    // try {
    //   const response = await this.client.post('api/v3/social-compass/answers', {
    //     SOCIAL_COMPASS_ANSWERS_KEY: answers,
    //   });

    //   if (response && response['status'] === 'success') {
    //     this.submitRequested$.next(false);

    //     return true;
    //   }
    // } catch (e) {
    //   console.error(e);
    //   this.toasterService.error(
    //     (e && e.message) || 'There was a problem saving your nsfw settings.'
    //   );

    //   return false;
    // }

    return true; //ojm temp
  }
}
