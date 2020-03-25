import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormToast, FormToastService } from '../../services/form-toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-formToast',
  templateUrl: './form-toast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormToastComponent implements OnInit, OnDestroy {
  toasts: FormToast[] = [];
  timeoutIds: number[] = [];
  subscription: Subscription;

  constructor(
    private service: FormToastService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription = this.service.onToast().subscribe(toast => {
      // clear toasts when an empty toast is received
      if (!toast.message) {
        this.toasts = [];
        return;
      }
      const toastIndex = this.toasts.push(toast) - 1;
      console.log(toastIndex);
      this.detectChanges();

      const toastTimeout = setTimeout(() => {
        this.toasts[toastIndex]['dismissed'] = true;

        this.detectChanges();
      }, 3400);

      this.timeoutIds.push(setTimeout(() => toastTimeout));
    });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.timeoutIds.forEach(id => clearTimeout(id));
    this.subscription.unsubscribe();
  }
}
