import { Component, HostListener } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'm-androidApp__download',
  template: `
    <div class="m-androidApp__download__background">
      <img [src]="minds.cdn_assets_url + 'assets/photos/circles.png'">
    </div>

    <h2>
      Minds Android App
    </h2>

    <i class="material-icons">android</i>
  `
})

export class AndroidAppDownloadComponent {
  minds = window.Minds;

  constructor(private router: Router) {

  }

  @HostListener('click') onClick() {
    window.location.href = this.minds.site_url + 'mobile';
  }
}
