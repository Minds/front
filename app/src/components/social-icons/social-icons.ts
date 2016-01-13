import { Component, EventEmitter } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';


@Component({
  selector: 'm-social-icons',
  inputs: [ '_url: url' ],
  directives: [ CORE_DIRECTIVES ],
  templateUrl: 'src/components/social-icons/social-icons.html',
})

export class SocialIcons {

  url : string = "";
  encodedUrl : string = "";


  set _url(value : string){
    this.url = value;
    this.encodedUrl = encodeURI(this.url);
  }

  copy(e){
    e.target.select();
    document.execCommand('copy');
  }

  openWindow(url : string){
    window.open(url, "_blank", "width=600, height=300, left=80, top=80")
  }

}
