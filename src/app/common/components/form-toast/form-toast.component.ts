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

      // TODOOJM something is wrong here
      const toastTimeout = setTimeout(() => {
        this.toasts[toastIndex].visible = false;
        this.detectChanges();
      }, 3000);

      this.timeoutIds.push(setTimeout(() => toastTimeout));
    });
  }

  dismiss(index) {
    this.toasts[index].visible = false;
    this.detectChanges();
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
