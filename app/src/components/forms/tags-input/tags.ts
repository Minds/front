import { Component, EventEmitter, ElementRef } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, FormBuilder, Validators, RadioButtonState } from 'angular2/common';
import { Router, RouteParams } from 'angular2/router';

import { Material } from '../../../directives/material';
import { Client, Upload } from '../../../services/api';
import { SessionFactory } from '../../../services/session';


@Component({
  selector: 'minds-form-tags-input',
  host: {
    '(click)': 'focus()'
  },
  inputs: [ '_tags: tags' ],
  outputs: [ 'change: tagsChange' ],
  directives: [ FORM_DIRECTIVES, Material ],
  template: `
    <div class="m-form-tags-input-tags-tag mdl-shadow--2dp mdl-color--blue-grey-600 mdl-color-text--blue-grey-50" *ngFor="#tag of tags; #i = index" (click)="removeTag(i)">
      <span>{{tag}}</span>
      <i class="material-icons mdl-color-text--white">close</i>
    </div>
    <input type="text" [(ngModel)]="input" (keyup)="keyUp($event)" [size]="input.length ? input.length : 1">
  `
})

export class TagsInput{

	session = SessionFactory.build();
  error : string = "";
  inProgress : boolean = false;

  input : string = "";
  placeholder : string = "+";
  tags : Array<string> = [];
  change : EventEmitter<any> = new EventEmitter();

	constructor(private element : ElementRef){

	}

  set _tags(tags : Array<string>){
    if(Array.isArray(tags))
      this.tags = tags;
  }

  keyUp(e){

    switch(e.keyCode){
      case 32: //space
      case 9: //tab
      case 13: //enter
        if(this.input){

          this.tags.push(this.input);
          this.input = "";
        }
        break;
      case 8: //backspace
        //remove the last tag if we don't have an input
        if(!this.input){
          this.tags.pop();
        }
        break;
    }

    this.change.next(this.tags);
  }

  removeTag(index : number){
    this.tags.splice(index,1);
    this.change.next(this.tags);
  }

  focus(){
    this.element.nativeElement.getElementsByTagName('input')[0].focus();
  }

}
