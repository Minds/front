import { Component } from '@angular/core';
import { ConfigsService } from '../../common/services/configs.service';

@Component({
  selector: 'm-branding',
  templateUrl: 'branding.component.html',
})
export class BrandingComponent {
  constructor(public configs: ConfigsService) {}
}
