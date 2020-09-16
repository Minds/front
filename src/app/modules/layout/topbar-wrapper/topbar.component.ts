import { Component } from '@angular/core';
import { Session } from '../../../services/session';
import { FeaturesService } from '../../../services/features.service';

@Component({
  selector: 'm-topbarwrapper',
  templateUrl: 'topbar.component.html',
})
export class TopbarWrapperComponent {
  constructor(
    public session: Session,
    public featuresService: FeaturesService
  ) {}
}
