import { DismissalService } from './../../../../common/services/dismissal.service';
import { TopFeedService } from '../subscribed.component';
import {
  Component,
  EventEmitter,
  Input,
  Optional,
  Output,
} from '@angular/core';
import { ExperimentsService } from '../../../experiments/experiments.service';
import {
  ActivityEdge,
  FeedHighlightsConnection,
} from '../../../../../graphql/generated.engine';

@Component({
  selector: 'm-topHighlights',
  templateUrl: './top-highlights.component.html',
  styleUrls: ['./top-highlights.component.ng.scss'],
})
export class TopHighlightsComponent {
  @Output()
  onSeeMore: EventEmitter<void> = new EventEmitter();

  /**
   * The new graphql feed connection will provide the data in the form of a
   * FeedHiglightsConnection. The TopFeedService can be removed at a later date, it is no longer
   * used if the conneciton is provided
   */
  @Input() connection: FeedHighlightsConnection;

  constructor(
    @Optional() public topFeedService: TopFeedService,
    public experiments: ExperimentsService,
    private dismissal: DismissalService
  ) {}

  /**
   * dismisses the component
   * @returns { void }
   */
  dismiss(): void {
    this.dismissal.dismiss('top-highlights');
  }

  /**
   * Improves change detection by keeping reference to object
   */
  trackByFn(i: number, edge: ActivityEdge): string {
    return edge.node.id;
  }
}
