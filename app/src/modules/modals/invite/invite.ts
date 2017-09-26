import { Component, EventEmitter } from '@angular/core';

import { SessionFactory } from '../../../services/session';

@Component({
  selector: 'm-modal-invite',
  inputs: ['open'],
  outputs: ['closed'],
  template: `
    <m-modal [open]="open" (closed)="close($event)">

      <div class="mdl-card__supporting-text">
        <!-- i18n -->Send the link below to your friends and get 100 points when they signup.<!-- /i18n -->
      </div>

      <div class="mdl-card__supporting-text">
        <input class="" value="{{url}}" (focus)="copy($event)" (click)="copy($event)" autofocus/>
      </div>

      <div class="m-social-share-buttons">
        <button class="mdl-button mdl-button--raised mdl-color-text--white m-social-share-fb"
          (click)="openWindow('https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl + '&display=popup&ref=plugin&src=share_button')">
          <!-- i18n -->Facebook<!-- /i18n -->
        </button>
        <button class="mdl-button mdl-button--raised mdl-color-text--white m-social-share-twitter"
          (click)="openWindow('https://twitter.com/intent/tweet?text=Join%20me%20on%20Minds&tw_p=tweetbutton&url=' + encodedUrl)">
          <!-- i18n -->Twitter<!-- /i18n -->
        </button>
        <button class="mdl-button mdl-button--raised mdl-color-text--white m-social-share-email" (click)="openEmail()">
          <!-- i18n -->Email<!-- /i18n -->
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

  session = SessionFactory.build();

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
