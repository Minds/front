import { Component, HostBinding } from '@angular/core';
import { ExperimentsService } from '../../../modules/experiments/experiments.service';

@Component({
  selector: 'm-feedHeader',
  templateUrl: './feed-header.component.html',
  styleUrls: ['./feed-header.component.ng.scss'],
})
export class FeedHeaderComponent {
  constructor(public experiments: ExperimentsService) {}
}
