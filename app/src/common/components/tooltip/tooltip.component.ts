import { Component, Input } from '@angular/core';

@Component({
  selector: 'm-tooltip',
  templateUrl: 'tooltip.component.html',
  host: {
    '(mouseenter)': 'hidden = false',
    '(mouseleave)': 'hidden = true'
  }
})

export class TooltipComponent {

  @Input() icon;
  hidden : boolean = true;

}
