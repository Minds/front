import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';

export class OnboardingV2Service {
  static _(client: Client, session: Session) {
    return new OnboardingV2Service(client, session);
  }

  constructor(private client: Client, private session: Session) {}

  async shouldShow() {
    if (!this.session.isLoggedIn()) {
      return false;
    }
    try {
      const response: any = await this.client.get('api/v2/onboarding/progress');
      return response.show_onboarding;
    } catch (e) {
      console.error(e);
    }

    return false;
  }

  async shown() {
    try {
      const response: any = await this.client.post(
        'api/v2/onboarding/onboarding_shown'
      );
    } catch (e) {
      console.log(e.message);
    }
  }
}
