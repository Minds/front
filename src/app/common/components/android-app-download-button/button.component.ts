import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
