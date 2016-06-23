import { Component } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { Router, RouterLink, RouteParams } from "@angular/router-deprecated";

import { Client } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { SessionFactory } from '../../services/session';
import { Material } from '../../directives/material';

import { SettingsGeneral } from './general/general';
import { SettingsStatistics } from './statistics/statistics';
import { SettingsDisableChannel } from './disable/disable';
import { SettingsTwoFactor } from './two-factor/two-factor';

import { InviteModal } from '../../components/modal/invite/invite';

@Component({
  selector: 'minds-settings',
  providers: [ MindsTitle ],
  templateUrl: 'src/controllers/settings/settings.html',
  directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES, Material, RouterLink, SettingsGeneral, SettingsStatistics, SettingsDisableChannel, SettingsTwoFactor, InviteModal ]
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
