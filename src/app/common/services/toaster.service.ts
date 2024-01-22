import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface Toast {
  type?: 'success' | 'error' | 'warning' | 'info' | null;
  message?: string;
  dismissed?: boolean;
}

/** Default error message text. */
export const DEFAULT_ERROR_MESSAGE: string = 'An unknown error has occurred';

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

  /**
   * Handle an error message or object.
   * @param { string | any } error - error message or object. String messages
   * will be displayed directly, error objects will be parsed.
   * @returns { void }
   */
  error(error: string | any): void {
    let message: string = DEFAULT_ERROR_MESSAGE;

    if (typeof error === 'string') {
      message = error;
    } else if (typeof error === 'object') {
      message = this.parseErrorObject(error);
    }

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

  /**
   * Parse an error object for its message.
   * @param { any } errorObject - error object to parse.
   * @returns { string } - error message.
   */
  private parseErrorObject(errorObject: any): string {
    if (errorObject?.error?.errors?.length) {
      // handle GraphQL errors.
      return errorObject?.error?.errors[0]?.message;
    } else {
      // handle general errors.
      return (
        errorObject?.error?.message ??
        errorObject?.message ??
        DEFAULT_ERROR_MESSAGE
      );
    }
  }
}
