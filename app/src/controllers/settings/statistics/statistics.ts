import { Component } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';

import { RouterLink } from "@angular/router-deprecated";
import { Client } from '../../../services/api';
import { Material } from '../../../directives/material';

@Component({
  selector: 'minds-settings-statistics',
  inputs: ['object'],
  templateUrl: 'src/controllers/settings/statistics/statistics.html',
  directives: [ CORE_DIRECTIVES, Material, RouterLink ]
})

export class SettingsStatistics{

  minds : Minds;
  user : any;
  settings : string;
  data = {
    fullname : "minds",
    email : "minds@minds.com",
    memberSince: new Date(),
    lastLogin: new Date(),
    storage : "0 GB's",
    bandwidth : "0 GB's",
    referrals : 500,
    earnings : 123123

  }
  constructor(public client: Client){
    this.minds = window.Minds;
    this.minds.cdn_url = "https://d3ae0shxev0cb7.cloudfront.net";
    this.load();
  }

  load(){

  }
}
