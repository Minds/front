import { Component } from '@angular/core';
import { ConfigsService } from '../../common/services/configs.service';
import { Location } from '@angular/common';
import { RedirectService } from '../../common/services/redirect.service';

@Component({
  selector: 'm-pro__redirect',
  template: `
    Please wait...
  `,
})
export class ProRedirectComponent {
  readonly siteUrl: string;

  constructor(
    configs: ConfigsService,
    private location: Location,
    private redirectService: RedirectService
  ) {
    this.siteUrl = configs.get('site_url');
  }

  ngOnInit() {
    const currentUrl: string = this.location.path();
    this.redirectService.redirect(this.siteUrl + currentUrl.substr(1));
  }
}
