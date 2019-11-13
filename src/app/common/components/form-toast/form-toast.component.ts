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
      if (!toast.message) {
        // clear toasts when an empty toast is received
        this.toasts = [];
        return;
      }

      toast['visible'] = true;
      const toastIndex = this.toasts.push(toast) - 1;
      this.detectChanges();
      console.log('***new toast', toast);

      const toastTimeout = setTimeout(() => {
        this.toasts[toastIndex].visible = false;
        console.log('***end toast', this.toasts[toastIndex]);
        this.detectChanges();
      }, 10000);

      this.timeoutIds.push(setTimeout(() => toastTimeout));
    });
  }

  dismiss(index) {
    console.log(this.toasts[index]);
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
