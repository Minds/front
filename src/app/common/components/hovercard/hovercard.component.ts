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

  popperModifiers: Array<any> = [
    {
      name: 'eventListeners',
      enabled: false,
    },
    {
      name: 'offset',
      options: {
        offset: [0, 0],
      },
    },
  ];

  ngOnInit(): void {
    if (this.offset.length === 2) {
      this.popperModifiers.find(
        x => x.name === 'offset'
      ).options.offset = this.offset;
    }
  }

  // Only calculate popper positioning changes when popper is visible
  popperOnShown() {
    this.popperModifiers.find(x => x.name === 'eventListeners').enabled = true;
    this.shown = true;
  }

  popperOnHidden() {
    this.popperModifiers.find(x => x.name === 'eventListeners').enabled = false;
    this.shown = false;
  }
}
