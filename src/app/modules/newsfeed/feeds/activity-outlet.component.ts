import { Component } from '@angular/core';

// a wrapper component used by virtualized list to hold all components of the feed in one
@Component({
  selector: 'm-newsfeed__activityOutlet',
  template: '<ng-content></ng-content>',
  styles: [
    `
      /* ::ng-deep m-activityv2__content {
        height: 400px !important;
        overflow: hidden;
      } */
    `,
  ],
})
export class NewsfeedActivityOutletComponent {}
