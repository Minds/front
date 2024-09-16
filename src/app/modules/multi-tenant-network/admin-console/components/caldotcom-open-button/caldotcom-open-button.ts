import { CommonModule as NgCommonModule } from '@angular/common';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { filter, Observable, Subscription } from 'rxjs';
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
      [saving]="!(scriptLoaded$ | async)"
      [disabled]="!(scriptLoaded$ | async)"
      >{{ text }}</m-button
    >
  `,
  standalone: true,
  imports: [NgCommonModule, CommonModule],
})
export class CalDotComOpenButtonComponent implements OnInit, OnDestroy {
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

  /** Whether the script is still loading. */
  protected readonly scriptLoaded$: Observable<boolean> =
    this.calDotComService.scriptLoaded$;

  // subscriptions.
  private readonly scriptLoadedSubscription: Subscription;

  constructor(private readonly calDotComService: CalDotComService) {}

  ngOnInit() {
    this.calDotComService.loadScript();

    this.calDotComService.scriptLoaded$
      .pipe(filter(Boolean))
      .subscribe((loaded) => {
        this.calDotComService.initializeCalendar(this.calNamespace);
      });
  }

  ngOnDestroy() {
    this.scriptLoadedSubscription?.unsubscribe();
  }
}
