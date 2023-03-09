import { Component } from '@angular/core';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-topbarwrapper',
  templateUrl: 'topbar.component.html',
  styleUrls: ['topbar.component.ng.scss'],
})
export class TopbarWrapperComponent {
  constructor(public session: Session) {}
}
