import { Component, View, EventEmitter } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { RouterLink } from 'angular2/router';

import { Client } from '../services/api';
import { Material } from '../directives/material';

@Component({
  selector: 'minds-banner',
  inputs: ['_object: object', '_src: src', '_top: top', 'overlay', '_editMode: editMode', '_done: done'],
  outputs: ['added']
})
@View({
  template: `
  <div class="minds-banner" *ngIf="!editing">
    <div class="minds-banner-img" [ngStyle]="{'background-position': '0 ' + top + 'px', 'background-image': 'url(' + src + ')'}"></div>
    <div class="minds-banner-overlay"></div>
  </div>
  <div *ngIf="editing" class="minds-banner minds-banner-editing">
    <img src="{{src}}" [ngStyle]="{'top': top}" (dragstart)="dragstart($event)" (dragover)="drag($event)" (dragend)="dragend($event)"/>
    <div class="overlay" [hidden]="file">
      <i class="material-icons">camera</i>
      <span>Click here to add a new banner</span>
    </div>
    <div class="minds-banner-overlay"></div>

    <button class="add-button mdl-button mdl-button--raised mdl-button--colored material-icons" (click)="onClick($event)">
      <i class="material-icons">file_upload</i>
    </button>

    <div class="save-bar" [hidden]="!file">
      <div class="mdl-layout-spacer"></div>
      <p>Drag the banner vertically to change its position</p>
      <minds-button-edit class="cancel-button" (click)="cancel()">
        <button>Cancel</button>
      </minds-button-edit>
      <minds-button-edit (click)="done()">
        <button>Save</button>
      </minds-button-edit>
    </div>
    <input type="file" id="file" (change)="add($event)" [hidden]="file" />
  </div>
  `,
  directives: [ CORE_DIRECTIVES, RouterLink, Material ]
})

export class MindsBanner{

  minds : Minds = window.Minds;
  object;
  editing : boolean = false;
  src : string = "";
  index : number = 0;

  file : any;
  startY : number = 0;
  offsetY : any = 0;
  top : number = 0;
  dragging : boolean = false;
  dragTimeout;
  added : EventEmitter<any> = new EventEmitter();

	constructor(){
	}

  set _object(value : any){
    if(!value)
      return;
    this.object = value;
    this.src = "/fs/v1/banners/" + this.object.guid + '/' + this.top;
  }

  set _src(value : any){
    this.src = value;
  }

  set _top(value : number){
    if(!value)
      return;
    this.top = value;
  }

  set _editMode(value : boolean){
    this.editing = value;
  }

  add(e){
    if(!this.editing)
      return;

    var element : any = e.target ? e.target : e.srcElement;
    this.file = element ? element.files[0] : null;

    /**
     * Set a live preview
     */
    var reader  = new FileReader();
    reader.onloadend = () => {
      this.src = reader.result;
    }
    reader.readAsDataURL(this.file);

    element.value = "";
  }

  cancel(){
    this.file = null;
  }

  /**
   * An upstream done event, which triggers the export process. Usually called from carousels
   */
  set _done(value : boolean){
    if(value)
      this.done();
  }

  done(){
    this.added.next({
      index: this.index,
      file: this.file,
      top: this.top
    });
    this.file = null;
    //this.editing = false;
  }

  dragstart(e){
    this.startY = e.target.style.top ? parseInt(e.target.style.top) : 0;
    this.offsetY = e.clientY;
    this.dragging = true;
    e.dataTransfer.effectAllowed = 'none';
  }

  drag(e){
    e.preventDefault();
    if(!this.dragging)
      return false;

    var target = e.target;
    var top = this.startY + e.clientY - this.offsetY;
    target.style.top = top + 'px';

    this.top = top;
    return false;
  }

  dragend(e){
    this.dragging = false;
    console.log('stopped dragging');
  }

  onClick(e){
    e.target.parentNode.parentNode.getElementsByTagName('input')[0].click();
  }

}
