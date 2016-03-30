import { Component, EventEmitter } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { ROUTER_DIRECTIVES, Router } from 'angular2/router';

import { Modal } from '../modal';
import { SessionFactory } from '../../../services/session';
import { EmbedService } from '../../../services/embed';


@Component({
  selector: 'm-modal-share',
  inputs: [ 'open', '_url: url', '_embed: embed' ],
  outputs: ['closed'],
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, Modal ],
  bindings: [ EmbedService ],
  template: `
    <m-modal [open]="open" (closed)="close($event)">

      <div class="mdl-card__supporting-text">
        <input class="" value="{{url}}" (click)="copy($event)"/>

      </div>

      <div class="m-social-share-buttons">
        <button class="mdl-button mdl-button--raised mdl-color-text--white m-social-share-fb" (click)="openWindow('https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl + '&display=popup&ref=plugin&src=share_button')">
         Share on Facebook
        </button>
        <button class="mdl-button mdl-button--raised mdl-color-text--white m-social-share-twitter" (click)="openWindow('https://twitter.com/intent/tweet?text=Shared%20via%20Minds.com&tw_p=tweetbutton&url=' + encodedUrl)">
          Share on Twitter
        </button>
      </div>

      <div class="m-modal-share-embed" *ngIf="embedCode">
        <span class="m-modal-share-embed__label mdl-color-text--blue-grey-300">
          Embed into your website:
        </span>
        <div>
          <textarea (click)="copy($event)" readonly>{{ embedCode }}</textarea>
        </div>
      </div>

    </m-modal>
  `
})

export class ShareModal {

  open : boolean = false;
  closed : EventEmitter<any> = new EventEmitter();
  url : string = "";
  encodedUrl : string = "";
  embedCode : string = '';

  session = SessionFactory.build();

  constructor(public embed: EmbedService) {
  }

  set _url(value : string){
    this.url = value;
    this.encodedUrl = encodeURI(this.url);
  }

  set _embed(object: any){
    this.embedCode = this.embed.getIframeFromObject(object);
  }

  close(){
    this.open = false;
    this.closed.next(true);
  }

  copy(e){
    e.target.select();
    document.execCommand('copy');
  }

  openWindow(url : string){
    window.open(url, "_blank", "width=600, height=300, left=80, top=80")
  }

}
