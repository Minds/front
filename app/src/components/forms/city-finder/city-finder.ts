import { Component, EventEmitter } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, FormBuilder, Validators, RadioButtonState } from 'angular2/common';
import { Router, RouteParams } from 'angular2/router';

import { MindsBanner } from '../../banner';
import { MindsAvatar } from '../../avatar';

import { Material } from '../../../directives/material';
import { Client, Upload } from '../../../services/api';
import { SessionFactory } from '../../../services/session';


@Component({
  selector: 'minds-form-city-finder',
  outputs: [ 'done' ],
  templateUrl: 'src/components/forms/city-finder/city-finder.html',
  directives: [ FORM_DIRECTIVES, Material, MindsAvatar, MindsBanner ]
})

export class CityFinderForm {

	session = SessionFactory.build();
  error : string = "";
  inProgress : boolean = false;

  city : string = "";
  cities : Array<any> = [];

  done : EventEmitter<any> = new EventEmitter();

	constructor(public client : Client, public upload : Upload, public router: Router, fb: FormBuilder){

	}

  searching;
  findCity(q : string){
    if(this.searching){
      clearTimeout(this.searching);
    }
    this.searching = setTimeout(() => {
      this.client.get('api/v1/geolocation/list', {	q: q })
        .then((response : any) => {
          this.cities = response.results;
        });
    }, 100);
  }

  setCity(row : any){
    this.cities = [];
    if(row.address.city)
      window.Minds.user.city = row.address.city;
    if(row.address.town)
      window.Minds.user.city = row.address.town;
    this.city = window.Minds.user.city;
    this.inProgress = true;
    this.client.post('api/v1/channel/info', {
        coordinates : row.lat + ',' + row.lon,
        city : window.Minds.user.city
      })
      .then((response : any) => {
        this.inProgress = false;
        this.done.next(true);
      });
  }


}
