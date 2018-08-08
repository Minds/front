import { Component } from '@angular/core';
import { MindsTitle } from '../../../services/ux/title';

@Component({
  selector: 'm-nodes--marketing',
  templateUrl: 'marketing.component.html'
})

export class NodesMarketingComponent {

  minds = window.Minds;

  constructor(private title: MindsTitle) {
    this.title.setTitle('Nodes');
  }

}
