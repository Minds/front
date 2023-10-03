import { Component, Input } from '@angular/core';

/**
 * Text header to be shown in a feed. Can be used to segment
 * different sub-feeds whilst providing context to the viewing user.
 */
@Component({
  selector: 'm-feedHeader--inline',
  templateUrl: './inline-feed-header.component.html',
  styleUrls: ['./inline-feed-header.component.ng.scss'],
})
export class InlineFeedHeaderComponent {
  /** Text to display in the inline feed header. */
  @Input() public text: string;
}
