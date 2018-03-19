import { Component, EventEmitter } from '@angular/core';

import { Session } from '../../../services/session';

@Component({
  selector: 'm-modal-invite',
  inputs: ['open'],
  outputs: ['closed'],
  template: `
    <m-modal [open]="open" (closed)="close($event)">

      <div class="mdl-card__supporting-text">
        <ng-container i18n="@@MODALS__INVITE__DESCRIPTION">Send the link below to your friends:</ng-container>
      </div>

      <div class="mdl-card__supporting-text">
        <input class="" value="{{url}}" (focus)="copy($event)" (click)="copy($event)" autofocus/>
      </div>

      <div class="m-social-share-buttons">
        <button class="mdl-button mdl-button--raised mdl-color-text--white m-social-share-fb"
          (click)="openWindow('https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl + '&display=popup&ref=plugin&src=share_button')">
          <ng-container i18n="@@M__NAMES__FACEBOOK">Facebook</ng-container>
        </button>
        <button class="mdl-button mdl-button--raised mdl-color-text--white m-social-share-twitter"
          (click)="openWindow('https://twitter.com/intent/tweet?text=Join%20me%20on%20Minds&tw_p=tweetbutton&url=' + encodedUrl)">
          <ng-container i18n="@@M__NAMES__TWITTER">Twitter</ng-container>
        </button>
        <button class="mdl-button mdl-button--raised mdl-color-text--white m-social-share-email" (click)="openEmail()">
          <ng-container i18n="@@M__COMMON__EMAIL">Email</ng-container>
        </button>
      </div>


    </m-modal>
  `
})

export class InviteModal {

  open: boolean = false;
  closed: EventEmitter<any> = new EventEmitter();
  url: string = '';
  encodedUrl: string = '';
  embedCode: string = '';

  constructor(public session: Session) { }

  ngOnInit() {
    this.url = window.Minds.site_url + 'register?referrer=' + this.session.getLoggedInUser().username;
    this.encodedUrl = encodeURI(this.url);
  }

  close(e?) {
    this.open = false;
    this.closed.next(true);
  }

  copy(e) {
    e.target.select();
    document.execCommand('copy');
  }

  openWindow(url: string) {
    window.open(url, '_blank', 'width=600, height=300, left=80, top=80');
  }

  openEmail() {
    window.location.href = 'mailto:?subject=Join%20me%20on%20minds&body=Join me on Minds ' + this.encodedUrl;
  }

}
