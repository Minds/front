import { Component } from '@angular/core';
import { FeaturesService } from '../../services/features.service';

@Component({
  selector: 'm-homepagecontainer',
  template: `
    <m-homepage *ngIf="!newHomepage"></m-homepage>
    <m-homepage__v2 *ngIf="newHomepage"></m-homepage__v2>
  `,
})
export class HomepageContainerComponent {
  newHomepage: boolean = false;

  constructor(private featuresService: FeaturesService) {
    this.newHomepage = featuresService.has('homepage-december-2019');
  }
}
