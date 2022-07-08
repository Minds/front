import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface Toast {
  type?: 'success' | 'error' | 'warning' | 'info' | null;
  message?: string;
  dismissed?: boolean;
}

@Injectable()
export class ToasterService {
  toasts: Toast[] = [];
  timeoutIds: number[] = [];

  private subject = new Subject<Toast>();
  constructor() {}

  onToast(): Observable<Toast> {
    return this.subject.asObservable();
  }

  success(message: string) {
    const toast: Toast = {
      message: message,
      type: 'success',
    };
    this.trigger(toast);
  }

  error(message: string) {
    const toast: Toast = {
      message: message,
      type: 'error',
    };
    this.trigger(toast);
  }

  warn(message: string) {
    const toast: Toast = {
      message: message,
      type: 'warning',
    };
    this.trigger(toast);
  }

  inform(message: string) {
    const toast: Toast = {
      message: message,
      type: 'info',
    };
    this.trigger(toast);
  }

  trigger(toast: Toast) {
    if (!toast.type) {
      toast.type = 'info';
    }
    this.subject.next(toast);
  }

  isToastActive(message: string) {
    return (
      this.toasts.findIndex(
        value => value.message === message && !value.dismissed
      ) !== -1
    );
  }
}
