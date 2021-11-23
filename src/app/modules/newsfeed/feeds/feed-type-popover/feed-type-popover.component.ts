import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'm-feedTypePopover',
  templateUrl: './feed-type-popover.component.html',
  styleUrls: ['./feed-type-popover.component.ng.scss'],
})
export class FeedTypePopoverComponent implements OnInit {
  @Input() type: 'top' | 'latest' = 'latest';
  shown: boolean = false;

  // Here we are using offset modifier, but more options
  // are available at https://popper.js.org/docs/v2
  popperModifiers: any = {
    name: 'offset',
    options: {
      offset: [10, 10],
    },
  };

  ngOnInit(): void {
  }

  /**
   * change feed type
   **/
  @Output() changeType = new EventEmitter<'top' | 'latest'>();

  onChangeType(type: 'top' | 'latest'): void {
    this.changeType.emit(type);
  }
}
