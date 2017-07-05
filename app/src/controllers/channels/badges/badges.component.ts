import { Component, EventEmitter, Input } from '@angular/core';

import { KeyVal } from '../../../interfaces/entities';

export interface SocialProfileMeta {
  key: string,
  label: string,
  placeholder: string,
  link: string,
  icon: string,
  customIcon?: boolean,
}

@Component({
  moduleId: module.id,
  selector: 'm-channel--badges',
  templateUrl: 'badges.component.html'
})

export class ChannelBadgesComponent {


  @Input() user;


}
