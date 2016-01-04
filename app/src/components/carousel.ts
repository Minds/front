import { Component, View, EventEmitter } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { RouterLink } from 'angular2/router';

import { Client } from '../services/api';
import { Material } from '../directives/material';
import { MindsBanner } from './banner';


@Component({
  selector: 'minds-carousel',
  inputs: [ '_banners: banners', '_editMode: editMode'],
  outputs: ['done_event: done', 'delete_event: delete']
})
@View({
  template: `
    <i class="material-icons left" (click)="prev()" [hidden]="banners.length <= 1">keyboard_arrow_left</i>
    <div *ngFor="#banner of banners; #i = index">
      <minds-banner
        [src]="banner.src"
        [top]="banner.top_offset"
        [overlay]="true"
        [ngClass]="{'is-hidden': i != index, 'edit-mode': editing}"
        [editMode]="editing"
        [done]="done"
        (added)="added($event, i)"
        ></minds-banner>

        <div class="delete-button" (click)="delete(i)" [hidden]="i != index || !editing">
          <button class="mdl-button mdl-button--raised mdl-button--colored material-icons">X</button>
        </div>
      </div>
    <i class="material-icons right" (click)="next()" [hidden]="banners.length <= 1">keyboard_arrow_right</i>
  `,
  directives: [ CORE_DIRECTIVES, MindsBanner ]
})

export class MindsCarousel{

  minds : Minds = window.Minds;
  banners : Array<any> = [];

  editing : boolean = false;
  src : string = "";
  modified : Array<any> = []; //all banners should be exported to here on the done event, and sent to parent

  done_event = new EventEmitter();
  delete_event = new EventEmitter();
  done : boolean = false; //if set to true, tells the child component to return "added"
  rotate : boolean = true; //if set to true enabled rotation
  rotate_timeout; //the timeout for the rotator
  interval : number = 3000; //the interval for each banner to stay before rotating
  index : number = 0; //the current visible index of the carousel.

  constructor(){
    this.run();
  }

  /**
   * A list of banners are sent from the parent, if done are sent a blank one is entered
   */
  set _banners(value : any){
    if(value){
      this.banners = value;
    } else {
      this.banners.push({
        src: null
      });
    }
  }

  /**
   * If the parent set edit mode
   */
  set _editMode(value : boolean){
    console.log('[carousel]: edit mode event received');
    //was in edit more, now settings not in edit more
    if(this.editing && !value){
      console.log('[carousel]: edit mode ended');
      this._done();
      return;
    }

    this.editing = value;
    if(!this.editing){
      return;
    }
    console.log('[carousel]: edit mode enabled');
    this.rotate = false;
    this.done = false;
    var blank_banner = false;
    for(var i in this.banners){
      if(!this.banners[i].src)
        blank_banner=true;
    }
    if(!blank_banner){
      this.banners.push({
        src: null
      });
    }
  }

  /**
   * Fired when the child component adds a new banner
   */
  added(value : any, index){
    console.log(this.banners[index].guid, value.file);
    if(!this.banners[index].guid && !value.file)
      return; //this is our 'add new' post

    //detect if we have changed
    var changed = false;
    if(value.top != this.banners[index].top)
      changed = false;
    if(value.file)
      changed = true;

    if(!changed)
      return;

    this.modified.push({
      guid: this.banners[index].guid,
      index: index,
      file: value.file,
      top: value.top
    });
  }

  delete(index){
    this.delete_event.next(this.banners[index]);
    this.banners.splice(index, 1);
    if(this.banners.length == 0){
      this.banners.push({ src: null });
    }
    this.next();
  }

  /**
   * Once we retreive all the modified banners, we fire back to the parent the new list
   */
  _done(){
    this.editing = false; //this should update each banner (I'd prefer even driven but change detection works..)
    this.done = true;
    console.log('[carousel]: received done event');
    //after one second?
    setTimeout(() => {
      this.done_event.next(this.modified);
      this.modified = [];
    }, 1000);
  }

  prev(){
    var max = this.banners.length -1;
    if(this.index == 0)
      this.index = max;
    else
      this.index--;
    this.run();//resets the carousel
  }

  next(){
    var max = this.banners.length -1;
    if(this.index >= max)
      this.index = 0;
    else
      this.index++;
    this.run();//resets the carousel
  }

  run(){
    if(this.rotate_timeout)
      clearTimeout(this.rotate_timeout);
    this.rotate_timeout = setTimeout(() => {
      if(this.rotate){
        var max = this.banners.length -1;
        if(this.index >= max)
          this.index = 0;
        else
          this.index++;
      }
      this.run();
    },this.interval);
  }

  ngOnDestroy(){
    clearTimeout(this.rotate_timeout);
  }

}
