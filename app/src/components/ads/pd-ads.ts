import { Component, EventEmitter, ElementRef } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';

@Component({
  selector: 'pd-ad',
  inputs: [ 'type', 'location' ],
  template: `
    <div class="tpd-box" data-tpd-id="dsk-banner-ad-a" *ngIf="type == 'banner'"></div>
    <div class="tpd-box" data-tpd-id="mob-banner-ad-a" *ngIf="type == 'banner'"></div>
    <div class="tpd-box" data-tpd-id="dsk-box-ad-a" *ngIf="type == 'square'"></div>
    <div class="tpd-box" data-tpd-id="ad-contextual-a" *ngIf="type == 'context'"></div>
    <div class="tpd-box" data-tpd-id="ad-contextual-b" *ngIf="type == 'context'"></div>
  `,
  directives: [ CORE_DIRECTIVES ],
  host: {
    '[class]': "'m-ad-block m-ad-block-pd ' + type + ' m-ad-block-' + location"
  }
})

export class PDAds{

  visible : boolean = false;
  type: string = "square";
  location: string = "default";

  constructor(element : ElementRef) {
  }

  ngOnInit(){
    window.twoOhSix.insertAds();
    //if(this.type == 'context')
    setTimeout(() => {
      window.twoOhSix.insertContextualAds();
    }, 100);
  }

  ngOnDestroy(){
  }

}

