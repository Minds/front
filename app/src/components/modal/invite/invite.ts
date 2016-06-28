import { Component, EventEmitter } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { ROUTER_DIRECTIVES, Router } from 'angular2/router';

import { Modal } from '../modal';
import { SessionFactory } from '../../../services/session';


@Component({
  selector: 'm-modal-invite',
  inputs: [ 'open' ],
  outputs: ['closed'],
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, Modal ],
  template: `
    <m-modal [open]="open" (closed)="close($event)">

      <div class="mdl-card__supporting-text">
        Send the link below to your friends and get 100 points when they signup.
      </div>

      <div class="mdl-card__supporting-text">
        <input class="" value="{{url}}" (click)="copy($event)"/>
      </div>

      <div class="m-social-share-buttons">
        <button class="mdl-button mdl-button--raised mdl-color-text--white m-social-share-fb" (click)="openWindow('https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl + '&display=popup&ref=plugin&src=share_button')">
          Facebook
        </button>
        <button class="mdl-button mdl-button--raised mdl-color-text--white m-social-share-twitter" (click)="openWindow('https://twitter.com/intent/tweet?text=Join%20me%20on%20Minds&tw_p=tweetbutton&url=' + encodedUrl)">
          Twitter
        </button>
        <button class="mdl-button mdl-button--raised mdl-color-text--white m-social-share-email" (click)="openWindow('mailto:?subject=Join%20me%20on%20minds&body=Join me on Minds ' + encodedUrl)">
          Email
        </button>
      </div>


    </m-modal>
  `
})

export class InviteModal {

  open : boolean = false;
  closed : EventEmitter<any> = new EventEmitter();
  url : string = "";
  encodedUrl : string = "";
  embedCode : string = '';

  session = SessionFactory.build();

  constructor() {
  }

  ngOnInit(){
    this.url = window.Minds.site_url + 'register?referrer=' + this.session.getLoggedInUser().username;
    this.encodedUrl = encodeURI(this.url);
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
