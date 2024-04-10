import { Component, Input, OnInit } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { Session } from '../../../../services/session';
import { OnboardingV3Service } from '../../../onboarding-v3/onboarding-v3.service';
import { OnboardingV3PanelService } from '../../../onboarding-v3/panel/onboarding-panel.service';
import { FeedNoticeService } from '../../services/feed-notice.service';

/**
 * Notice to prompt user to setup their channel name, bio and avatar.
 */
@Component({
  selector: 'm-feedNotice--setupChannel',
  templateUrl: 'setup-channel-notice.component.html',
})
export class SetupChannelNoticeComponent
  extends AbstractSubscriberComponent
  implements OnInit
{
  @Input() public dismissible: boolean = true;

  constructor(
    private session: Session,
    private feedNotice: FeedNoticeService,
    private onboarding: OnboardingV3Service,
    private onboardingPanel: OnboardingV3PanelService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.onboarding.completed$
        .pipe(filter(Boolean), take(1))
        .subscribe((completed: boolean) => {
          this.feedNotice.dismiss('setup-channel');
        })
    );
  }

  /**
   * Gets text for header (localized).
   * @returns { string } - text for header
   */
  get headerText(): string {
    return $localize`Who is ${this.username}:username:?`;
  }

  /**
   * Gets username, slices to a max of 36 characters.
   * @returns { string } - username.
   */
  get username(): string {
    let username: string = this.session.getLoggedInUser().username;
    if (username.length > 36) {
      username = `${username.slice(0, 33)}...`;
    }
    return `@${username}`;
  }

  /**
   * Called on primary option click.
   * @param { MouseEvent } $event - click event.
   * @return { void }
   */
  public async onPrimaryOptionClick($event: MouseEvent): Promise<void> {
    this.onboardingPanel.currentStep$.next('SetupChannelStep');
    await this.onboarding.open();
  }

  /**
   * Dismiss notice.
   * @return { void }
   */
  public dismiss(): void {
    this.feedNotice.dismiss('setup-channel');
  }
}
