import { TopFeedService } from '../subscribed.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'm-topHighlights',
  templateUrl: './top-highlights.component.html',
})
export class TopHighlightsComponent {
  @Output()
  onSeeMore: EventEmitter<void> = new EventEmitter();

  constructor(public topFeedService: TopFeedService) {}
}
