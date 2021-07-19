import { Component } from '@angular/core';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-jobs--marketing',
  templateUrl: 'marketing.component.html',
  styleUrls: ['marketing.component.ng.scss'],
})
export class JobsMarketingComponent {
  constructor(public configs: ConfigsService) {}

  gotoLink(link) {
    window.open(link, '_blank');
  }
}
