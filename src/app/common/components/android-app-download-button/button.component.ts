import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'm-androidApp__download',
  template: `
    <a routerLink="/mobile" class="m-androidApp__download">
      <div class="m-androidAppDownload__background">
        <img [src]="minds.cdn_assets_url + 'assets/photos/circles.png'">
      </div>

      <h2>
        Minds Android App
      </h2>

      <i class="material-icons">android</i>
    </a>
  `
})

export class AndroidAppDownloadComponent {
  minds = window.Minds;

  constructor(private router: Router) {

  }
  
}
