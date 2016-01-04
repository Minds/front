import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { Router, RouterLink, RouteParams } from "angular2/router";

import { Client } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { SessionFactory } from '../../services/session';
import { Material } from '../../directives/material';

import { SettingsGeneral } from './general/general';
import { SettingsStatistics } from './statistics/statistics';
import { SettingsDisableChannel } from './disable/disable';
import { SettingsTwoFactor } from './two-factor/two-factor';


@Component({
  selector: 'minds-settings',
  viewBindings: [ Client ],
  bindings: [ MindsTitle ]
})
@View({
  templateUrl: 'src/controllers/settings/settings.html',
  directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES, Material, RouterLink, SettingsGeneral, SettingsStatistics, SettingsDisableChannel, SettingsTwoFactor]
})

export class Settings{

  minds : Minds;
  session =  SessionFactory.build();
  user : any;
  filter : string;

  constructor(public client: Client, public router: Router, public params: RouteParams, public title: MindsTitle){
    if(!this.session.isLoggedIn()){
      router.navigate(['/Login']);
    }
    this.minds = window.Minds;

    this.title.setTitle("Settings");

    if(params.params['filter'])
      this.filter = params.params['filter'];
    else
      this.filter = 'general';
  }


}
