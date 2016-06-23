import { Component, EventEmitter } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, FormBuilder, Validators, RadioButtonState } from '@angular/common';
import { Router, RouteParams } from '@angular/router-deprecated';


import { Material } from '../../directives/material';


@Component({
  selector: 'minds-tutorial',
  outputs: [ 'done' ],
  templateUrl: 'src/components/tutorial/tutorial.html',
  directives: [ FORM_DIRECTIVES, Material ]
})

export class Tutorial {

  error : string = "";
  inProgress : boolean = false;
  referrer : string;

  form : ControlGroup;
  gender : string = 'private';
  banner : string;

  done : EventEmitter<any> = new EventEmitter();

	constructor(){

	}


}
