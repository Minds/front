import { Component } from '@angular/core';
import { map } from 'rxjs';
import { TopbarAlertService } from './topbar-alert.service';

/**
 * Topbar alert component - intended to show above normal site topbar
 * and contain short alerts and announcements. Due to the site layout
 * being dependant on the topbars size and position, it is advisable
 * for a message to occupy 2 lines at most in a mobile view viewport.
 */
@Component({
  selector: 'm-topbarAlert',
  templateUrl: 'topbar-alert.component.html',
  styleUrls: ['./topbar-alert.component.ng.scss'],
})
export class TopbarAlertComponent {
  protected message$ = this.service.copyData$.pipe(
    map(copyData => copyData.attributes.message)
  );
  protected shouldShow$ = this.service.shouldShow$;

  constructor(private service: TopbarAlertService) {}

  /**
   * Called on dismiss click. Dismisses currently active alert.
   * @returns { Promise<void> }
   */
  protected async dismiss(): Promise<void> {
    this.service.dismiss();
  }
}
