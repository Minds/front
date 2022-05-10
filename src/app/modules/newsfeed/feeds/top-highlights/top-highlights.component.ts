import { DismissalService } from './../../../../common/services/dismissal.service';
import { TopFeedService } from '../subscribed.component';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { ExperimentsService } from '../../../experiments/experiments.service';
import { ActivityV2ExperimentService } from '../../../experiments/sub-services/activity-v2-experiment.service';

@Component({
  selector: 'm-topHighlights',
  templateUrl: './top-highlights.component.html',
  styleUrls: ['./top-highlights.component.ng.scss'],
})
export class TopHighlightsComponent {
  @Output()
  onSeeMore: EventEmitter<void> = new EventEmitter();

  dropdownOptions = [
    {
      title: $localize`:@@COMMON__REMOVE_FROM_FEED:Remove from feed`,
      onPress: () => this.dismissalService.dismiss('top-highlights'),
      icon: {
        id: 'close',
        from: 'md',
      },
    },
  ];

  @HostBinding('class.m-topHighlights--activityV2')
  get activityV2Feature(): boolean {
    return this.activityV2Experiment.isActive();
  }

  constructor(
    public topFeedService: TopFeedService,
    public experiments: ExperimentsService,
    private activityV2Experiment: ActivityV2ExperimentService,
    private dismissalService: DismissalService
  ) {}
}
