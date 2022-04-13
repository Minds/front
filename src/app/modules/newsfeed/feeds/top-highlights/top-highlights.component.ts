import { TopFeedService } from '../subscribed.component';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { ExperimentsService } from '../../../experiments/experiments.service';

@Component({
  selector: 'm-topHighlights',
  templateUrl: './top-highlights.component.html',
  styleUrls: ['./top-highlights.component.ng.scss'],
})
export class TopHighlightsComponent {
  @Output()
  onSeeMore: EventEmitter<void> = new EventEmitter();

  @HostBinding('class.m-topHighlights--activityV2')
  get activityV2Feature(): boolean {
    return this.experiments.hasVariation('front-5229-activities', true);
  }

  constructor(
    public topFeedService: TopFeedService,
    public experiments: ExperimentsService
  ) {}
}
