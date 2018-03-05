import { Component } from '@angular/core';
import { WireRewardsStruc, WireRewardsTiers, WireRewardsType } from '../interfaces/wire.interfaces';
import { Client } from '../../../services/api/client';

@Component({
  moduleId: module.id,
  selector: 'm-wire-console',
  templateUrl: 'console.component.html',
})

export class WireConsoleComponent {
  showOptions: boolean = false;
}
