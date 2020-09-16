import { Component } from '@angular/core';
import { Session } from '../../../services/session';
import { FeaturesService } from '../../../services/features.service';

@Component({
  selector: 'm-topbarwrapper',
  templateUrl: 'topbar.component.html',
  styleUrls: ['topbar.component.ng.scss'],
})
export class TopbarWrapperComponent {
  constructor(
    public session: Session,
    public featuresService: FeaturesService
  ) {}
}
