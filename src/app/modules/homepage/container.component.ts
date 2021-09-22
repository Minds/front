import { Component } from '@angular/core';
import { ExperimentsService } from '../experiments/experiments.service';

@Component({
  selector: 'm-homepagecontainer',
  template: `
    <m-discovery *ngIf="shouldRenderDiscoveryExperiment(); else homepageSplash">
      <m-discovery__trends [showTabs]="false"></m-discovery__trends>
    </m-discovery>
    <ng-template #homepageSplash>
      <m-homepage__v2></m-homepage__v2>
    </ng-template>
  `,
})
export class HomepageContainerComponent {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Should discovery homepage should be rendered.
   * @returns { boolean } true if it should be rendered.
   */
  public shouldRenderDiscoveryExperiment(): boolean {
    const output = this.experiments.run('discovery-homepage');
    return output === 'on';
  }
}
