import { CommonModule as NgCommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '../../../../../common/common.module';
import { CalDotComService } from './caldotcom.service';

/**
 * Button for opening a Cal meeting booking modal.
 */
@Component({
  selector: 'm-calDotComOpenButton',
  template: `
    <m-button
      [attr.data-cal-link]="calLink"
      [attr.data-cal-namespace]="calNamespace"
      data-cal-config='{"layout":"month_view"}'
      [color]="color"
      [solid]="solid"
      >{{ text }}</m-button
    >
  `,
  standalone: true,
  imports: [NgCommonModule, CommonModule],
})
export class CalDotComOpenButtonComponent implements OnInit {
  /** The URL path of the calendar. */
  @Input() calLink: string = 'mindsnetworks/30min';

  /** The namespace to initialize the calendar with. */
  @Input() calNamespace: string = '30min';

  /** The text of the button. */
  @Input() text: string = 'Book meeting';

  /** The color of the button. */
  @Input() color: string = 'blue';

  /** Whether the button should be solid. */
  @Input() solid: boolean = true;

  constructor(private readonly calDotComService: CalDotComService) {}

  ngOnInit() {
    this.calDotComService.loadScript();
    this.calDotComService.initializeCalendar(this.calNamespace);
  }
}
