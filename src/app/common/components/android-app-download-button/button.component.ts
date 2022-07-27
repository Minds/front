import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * A link with an icon that points to the /mobile page
 * So users can download the app
 */
@Component({
  selector: 'm-androidAppDownloadButton',
  template: `
    <a routerLink="/mobile" class="m-androidAppDownloadButton">
      <i class="material-icons">android</i>
      <h2>
        Android App
      </h2>
    </a>
  `,
})
export class AndroidAppDownloadComponent {
  constructor(private router: Router) {}
}
