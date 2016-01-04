import { Component, View, EventEmitter } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { RouterLink } from 'angular2/router';

import { Client } from '../services/api';
import { Material } from '../directives/material';

@Component({
  selector: 'minds-avatar',
  inputs: ['_object: object', '_src: src', '_editMode: editMode'],
  outputs: ['added']
})
@View({
  template: `
  <div class="minds-avatar">
    <img src="{{src}}" class="mdl-shadow--4dp" />
    <div *ngIf="editing" class="overlay">
      <i class="material-icons">camera</i>
      <span>Change avatar</span>
      <input *ngIf="editing" type="file" #file (change)="add($event)"/>
    </div>
  </div>
  `,
  directives: [ CORE_DIRECTIVES, RouterLink, Material ]
})

export class MindsAvatar{

  minds : Minds = window.Minds;
  object;
  editing : boolean = false;
  src : string = "";
  index : number = 0;

  file : any;
  added : EventEmitter<any> = new EventEmitter();

	constructor(){
	}

  set _object(value : any){
    if(!value)
      return;
    this.object = value;
    this.src = "/fs/v1/avatars/"+ this.object.guid + "/large/" + this.object.icontime;
    if(this.object.type == 'user')
        this.src = "/icon/"+ this.object.guid + "/large/" + this.object.icontime;
  }

  set _src(value : any){
    this.src = value;
  }

  set _editMode(value : boolean){
    this.editing = value;
    if (!this.editing && this.file)
      this.done();
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
  done(){
    this.added.next(this.file);
    this.file = null;
  }

}
