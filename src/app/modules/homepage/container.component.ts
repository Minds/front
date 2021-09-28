import { Component } from '@angular/core';
import { ExperimentsService } from '../experiments/experiments.service';

@Component({
  selector: 'm-homepagecontainer',
  template: `
    <m-discovery *mExperiment="'discovery-homepage'; variation: 'on'">
      <m-discovery__trends [showTabs]="false"></m-discovery__trends>
    </m-discovery>
    <m-homepage__v2
      *mExperiment="'discovery-homepage'; variation: 'off'"
    ></m-homepage__v2>
  `,
})
export class HomepageContainerComponent {}
