import { Component, HostBinding } from '@angular/core';
import { ExperimentsService } from '../../experiments/experiments.service';

/**
 * Discovery top feed component.
 * Presents a default recommendations feed with discovery tabs.
 */
@Component({
  selector: 'm-discovery__top',
  styleUrls: ['top.component.ng.scss'],
  templateUrl: './top.component.html',
})
export class DiscoveryTopComponent {
  constructor() {}
}
