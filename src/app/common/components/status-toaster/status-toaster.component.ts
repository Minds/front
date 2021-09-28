import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { StatusToasterService } from './status-toaster.service';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import * as moment from 'moment';
@Component({
  selector: 'm-statusToaster',
  templateUrl: './status-toaster.component.html',
  styleUrls: ['./status-toaster.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fader', [
      state(
        'active',
        style({
          visibility: 'visible',
        })
      ),
      state(
        'dismissed',
        style({
          visibility: 'hidden',
          maxHeight: 0,
          height: 0,
        })
      ),
      transition(':enter', [
        animate(
          '300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          keyframes([
            style({
              transform: 'translateY(300px)',
            }),
            style({
              transform: 'translateY(0px)',
            }),
          ])
        ),
      ]),
      transition('* => dismissed', [
        animate(
          '450ms ease',
          keyframes([
            style({
              opacity: 1,
              maxHeight: '*',
              height: '*',
            }),
            style({ opacity: 0 }),
            style({
              maxHeight: 0,
              visibility: 'hidden',
              height: 0,
            }),
          ])
        ),
      ]),
    ]),
  ],
})
export class StatusToasterComponent implements OnInit, OnDestroy {
  interval;
  subscription: Subscription;

  get toasts() {
    return this.service.toasts;
  }

  get visibleToasts(): boolean {
    return this.service.toasts.findIndex(item => !item.dismissed) !== -1;
  }

  constructor(
    protected service: StatusToasterService,
    protected cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  ngOnInit(): void {
    this.subscription = this.service.onToast().subscribe(toast => {
      // if all saved toasts have already been dismissed, then clean the array to prevent leaks
      if (this.service.toasts.findIndex(value => !value.dismissed) === -1) {
        this.service.toasts = [];
      }
      this.service.toasts.push(toast) - 1;
      this.detectChanges();
    });
    this.startPolling();
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  /**
   * Check for unresolved incidents on load and then every 30s
   */
  startPolling(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.service.update();
      this.interval = setInterval(() => {
        this.service.update();
      }, 30000);
    }
  }

  formatTimestamp(utc): string {
    return moment(utc)
      .local()
      .format('MMM Do hh:mm a');
  }

  /**
   * Say it was resolved at the time the toast is triggered
   */
  getResolvedTime(): string {
    const utc = moment.utc().format();

    return this.formatTimestamp(utc);
  }

  getUpdateCount(toast: any): number {
    return toast.incident.incident_updates.length;
  }

  dismiss(toastIndex: number): void {
    this.service.toasts[toastIndex].dismissed = true;
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
