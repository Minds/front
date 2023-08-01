import { Component } from '@angular/core';
import { Observable, firstValueFrom, map } from 'rxjs';
import { TopbarAlertService } from './topbar-alert.service';
import { AnalyticsService } from '../../../services/analytics';

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
  /** Markdown text to display in alert. */
  protected message$: Observable<string> = this.service.copyData$.pipe(
    map(copyData => copyData.attributes.message)
  );

  /** Alert identifier. */
  protected identifier$: Observable<string> = this.service.copyData$.pipe(
    map(copyData => copyData?.attributes?.identifier)
  );

  /** Whether alert should show. */
  protected shouldShow$ = this.service.shouldShow$;

  constructor(
    private service: TopbarAlertService,
    private analyticsService: AnalyticsService
  ) {}

  /**
   * On markdown text click, track the click event if the target is an
   * anchor tag. We have to do it this way as we cannot supply a
   * custom attribute for a data-ref via ngx-markdown.
   * @param { MouseEvent } $event - mouse event.
   * @returns { Promise<void> }
   */
  public async onMarkdownTextClick($event: MouseEvent): Promise<void> {
    if (($event.target as HTMLElement).tagName === 'A') {
      const identifier: any = await firstValueFrom(this.identifier$);

      this.analyticsService.trackClick(
        `topbar-alert-${identifier ?? 'unknown'}-link`
      );
    }
  }

  /**
   * Called on dismiss click. Dismisses currently active alert.
   * @returns { Promise<void> }
   */
  protected async dismiss(): Promise<void> {
    this.service.dismiss();
  }
}
