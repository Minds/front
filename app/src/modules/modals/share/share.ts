import { Component, EventEmitter } from '@angular/core';

import { SessionFactory } from '../../../services/session';
import { EmbedService } from '../../../services/embed';

@Component({
  selector: 'm-modal-share',
  inputs: ['open', '_url: url', '_embed: embed'],
  outputs: ['closed'],
  template: `
    <m-modal [open]="open" (closed)="close($event)">

      <div class="mdl-card__supporting-text">
        <input class="" value="{{url}}" (click)="copy($event)"/>

      </div>

      <div class="m-social-share-buttons">
        <button class="mdl-button mdl-button--raised mdl-color-text--white m-social-share-fb"
          (click)="openWindow('https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl + '&display=popup&ref=plugin&src=share_button')">
          <!-- i18n: @@MODALS__SHARE__ON_FACEBOOK -->Share on Facebook<!-- /i18n -->
        </button>
        <button class="mdl-button mdl-button--raised mdl-color-text--white m-social-share-twitter"
          (click)="openWindow('https://twitter.com/intent/tweet?text=Shared%20via%20Minds.com&tw_p=tweetbutton&url=' + encodedUrl)">
          <!-- i18n: @@MODALS__SHARE__ON_TWITTER -->Share on Twitter<!-- /i18n -->
        </button>
      </div>

      <div class="m-modal-share-embed" *ngIf="embedCode">
        <span class="m-modal-share-embed__label mdl-color-text--blue-grey-300">
          <!-- i18n: @@M__COMMON__EMBED_INTO_WEBSITE -->Embed into your website:<!-- /i18n -->
        </span>
        <div>
          <textarea (click)="copy($event)" readonly>{{ embedCode }}</textarea>
        </div>
      </div>

    </m-modal>
  `
})

export class ShareModal {

  open: boolean = false;
  closed: EventEmitter<any> = new EventEmitter();
  url: string = '';
  encodedUrl: string = '';
  embedCode: string = '';

  session = SessionFactory.build();

  constructor(public embed: EmbedService) {
  }

  set _url(value: string) {
    this.url = value;
    this.encodedUrl = encodeURI(this.url);
  }

  set _embed(object: any) {
    this.embedCode = this.embed.getIframeFromObject(object);
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

}
