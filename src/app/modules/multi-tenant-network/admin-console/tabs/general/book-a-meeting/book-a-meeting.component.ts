import { Component } from '@angular/core';
import { CalDotComOpenButtonComponent } from '../../../components/caldotcom-open-button/caldotcom-open-button';

/**
 * Book a meeting section for network admin console.
 */
@Component({
  selector: 'm-networkAdminConsole__bookMeeting',
  template: `
    <h4
      class="m-networkAdminConsole__title"
      i18n="@@NETWORK_ADMIN_BOOK_MEETING__MEET_WITH_US"
    >
      Meet with us
    </h4>
    <p
      class="m-networkAdminBookAMeeting__description"
      i18n="@@NETWORK_ADMIN_BOOK_MEETING__HAVE_QUESTIONS_ABOUT_YOUR_NETWORK"
    >
      Have questions about your network, want support setting up things, or
      otherwise want to talk with us? Pick a time that works for you.
    </p>
    <m-calDotComOpenButton />
  `,
  styleUrls: ['./book-a-meeting.component.ng.scss'],
  standalone: true,
  imports: [CalDotComOpenButtonComponent],
})
export class NetworkAdminBookAMeetingComponent {}
