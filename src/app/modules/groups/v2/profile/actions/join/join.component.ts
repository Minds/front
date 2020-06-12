import { Component, OnInit } from '@angular/core';
import { GroupV2Service } from '../../../services/group-v2.service';

@Component({
  selector: 'm-groupActions__join',
  template: `
    <a
      class="m-button-v2 m-button-v2--positive"
      (click)="service.join()"
      *ngIf="!(service.group$ | async)['is:member']"
      i18n="@@MINDS__COMMON__JOIN"
    >
      + Join
    </a>
  `,
})
export class GroupActionJoinComponent {
  constructor(public service: GroupV2Service) {}
}
