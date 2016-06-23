import { Component, EventEmitter } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';

import { Modal } from '../modal/modal';
import { EmbedService } from '../../services/embed';

@Component({
  selector: 'm-social-icons',
  inputs: [ '_url: url', '_title: title', '_embed: embed' ],
  directives: [ CORE_DIRECTIVES, Modal ],
  templateUrl: 'src/components/social-icons/social-icons.html',
  providers: [ EmbedService ]
})

export class SocialIcons {

  url : string = "";
  title : string = "Shared via Minds.com";
  encodedUrl : string = "";
  encodedTitle : string = "Shared%20via%20Minds.com";

  embedCode: string = '';
  embedModalOpen: boolean = false;
  embedModalClosed: EventEmitter<any> = new EventEmitter();

  constructor(public embed: EmbedService) {
  }

  set _url(value : string){
    this.url = value;
    this.encodedUrl = encodeURI(this.url);
  }

  set _title(value : string){
    this.title = value;
    this.encodedTitle = encodeURI(this.title);
  }

  set _embed(object: any){
    this.embedCode = this.embed.getIframeFromObject(object);
  }

  copy(e){
    e.target.select();
    document.execCommand('copy');
  }

  openWindow(url : string){
    window.open(url, "_blank", "width=600, height=300, left=80, top=80")
  }

  embedModalClose(){
    this.embedModalOpen = false;
    this.embedModalClosed.next(true);
  }

}
