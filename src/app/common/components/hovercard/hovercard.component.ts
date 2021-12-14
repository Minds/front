import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'm-hovercard',
  templateUrl: './hovercard.component.html',
  styleUrls: ['./hovercard.component.ng.scss'],
})
export class HovercardComponent implements OnInit {
  @Input() publisher: any;
  @Input() offset: Array<number>;

  shown: boolean = false;

  // Here we are using offset modifier, but more options
  // are available at https://popper.js.org/docs/v2
  popperModifiers: any = {
    name: 'offset',
    options: {
      offset: [0, 0],
    },
  };

  ngOnInit(): void {
    if (this.offset.length === 2) {
      this.popperModifiers.options.offset = this.offset;
    }
  }

  onShown(): void {
    this.shown = true;
  }

  onHidden(): void {
    this.shown = false;
  }
}
