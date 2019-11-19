import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface FormToast {
  type?: 'success' | 'error' | 'warning' | 'info' | null;
  message?: string;
}

@Injectable()
export class FormToastService {
  private subject = new Subject<FormToast>();
  constructor() {}

  onToast(): Observable<FormToast> {
    return this.subject.asObservable();
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
      type: 'info',
    };
    this.trigger(toast);
  }

  trigger(toast: FormToast) {
    if (!toast.type) {
      toast.type = 'info';
    }
    this.subject.next(toast);
  }
}
