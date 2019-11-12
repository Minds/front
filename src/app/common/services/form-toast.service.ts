import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
// import { filter } from 'rxjs/operators';

export interface FormToast {
  type?: 'success' | 'error' | 'warning' | 'info' | null;
  message?: string;
  visible?: boolean;
}

@Injectable()
export class FormToastService {
  private subject = new Subject<FormToast>();
  constructor() {}

  // enable subscribing to toasts observable
  onToast(): Observable<FormToast> {
    return this.subject.asObservable();
    // .pipe(filter(x => x);
    // .pipe(filter(x => x && x.toastId === toastId));
  }

  success(message: string) {
    const toast: FormToast = {
      message: message,
      type: 'success',
    };
    this.trigger(toast);
  }

  error(message: string) {
    const toast: FormToast = {
      message: message,
      type: 'error',
    };
    this.trigger(toast);
  }

  warn(message: string) {
    const toast: FormToast = {
      message: message,
      type: 'warning',
    };
    this.trigger(toast);
  }

  inform(message: string) {
    const toast: FormToast = {
      message: message,
      type: 'error',
    };
    this.trigger(toast);
  }

  trigger(toast: FormToast) {
    toast['visible'] = true;
    if (!toast.type) toast.type = 'info';
    this.subject.next(toast);
  }
}
