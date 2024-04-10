import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ToasterService } from '../../services/toaster.service';
import { Subscription } from 'rxjs';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * Displays one or more toast notifications with sliding animations
 * and automatic fadeout (unless user's mouse is hovering over it)
 */
@Component({
  selector: 'm-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.ng.scss'],
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
export class ToasterComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  get toasts() {
    return this.service.toasts;
  }

  get visibleToasts(): boolean {
    return this.service.toasts.findIndex((item) => !item.dismissed) !== -1;
  }

  constructor(
    private service: ToasterService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.service.onToast().subscribe((toast) => {
      // clear toasts when an empty toast is received
      if (!toast.message) {
        this.service.toasts = [];
        return;
      }

      // if all saved toasts have already been dismissed, then clean the array to prevent leaks
      if (this.service.toasts.findIndex((value) => !value.dismissed) === -1) {
        this.service.timeoutIds = [];
        this.service.toasts = [];
      }

      const toastIndex = this.service.toasts.push(toast) - 1;
      this.detectChanges();

      this.setToastTimeout(toastIndex);
    });
  }

  pauseTimeout(toastIndex: number): void {
    clearTimeout(this.service.timeoutIds[toastIndex]);
  }

  resumeTimeout(toastIndex: number): void {
    this.setToastTimeout(toastIndex);
  }

  dismiss(toastIndex: number): void {
    this.service.toasts[toastIndex].dismissed = true;
  }

  private setToastTimeout(toastIndex: number): void {
    const toastTimeout: number = window.setTimeout(() => {
      this.dismiss(toastIndex);

      this.detectChanges();
    }, 3400);

    this.service.timeoutIds[toastIndex] = toastTimeout;
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.service.timeoutIds.forEach((id) => clearTimeout(id));
    this.subscription.unsubscribe();
  }
}
