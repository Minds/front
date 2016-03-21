import { Component, EventEmitter } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, FormBuilder, Validators, RadioButtonState } from 'angular2/common';
import { Router, RouteParams } from 'angular2/router';

import { MindsBanner } from '../../banner';
import { MindsAvatar } from '../../avatar';
import { CityFinderForm } from '../city-finder/city-finder';

import { Material } from '../../../directives/material';
import { Client, Upload } from '../../../services/api';
import { SessionFactory } from '../../../services/session';


@Component({
  selector: 'minds-form-onboarding',
  outputs: [ 'done' ],
  templateUrl: 'src/components/forms/onboarding/onboarding.html',
  directives: [ FORM_DIRECTIVES, Material, MindsAvatar, MindsBanner, CityFinderForm ]
})

export class OnboardingForm {

	session = SessionFactory.build();
  error : string = "";
  inProgress : boolean = false;
  referrer : string;

  form : ControlGroup;
  gender : string = 'private';
  banner : string;

  done : EventEmitter<any> = new EventEmitter();

	constructor(public client : Client, public upload : Upload, public router: Router, fb: FormBuilder){
    this.form = fb.group({
      briefdescription: [''],
      dob: [''],
      city: [''],
    });
	}

	submit(e){

    e.preventDefault();
    this.inProgress = true;

    let info = this.form.value;
    info.gender = this.gender;

		this.client.post('api/v1/channel/info', info)
			.then((data : any) => {
			  this.form.value = null;

        this.inProgress = false;

        this.done.next(data.user);
			})
			.catch((e) => {
        console.log(e);
        this.inProgress = false;

        return;
			});
	}

  addAvatar(file){
    console.log(file);
    this.upload.post('api/v1/channel/avatar', [file], {filekey : 'file'})
      .then((response : any) => {
        window.Minds.user.icontime = Date.now();
      });
  }

  addBanner(e){
    var element : any = e.target ? e.target : e.srcElement;
    var file = element ? element.files[0] : null;

    var reader  = new FileReader();
    reader.onloadend = () => {
      this.banner = reader.result;
    }
    reader.readAsDataURL(file);

    this.upload.post('api/v1/channel/carousel', [file], { top: 0})
      .then((response : any) => {
      });
  }

}
