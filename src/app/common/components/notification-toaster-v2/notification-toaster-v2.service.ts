import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MindsAvatarObject } from '../avatar/avatar';

/** Notification toast type. */
export type NotificationToastType = 'info' | 'success' | 'danger';

/** Notification toast interface. */
export interface NotificationToast {
  text: string; // Toast text.
  type: NotificationToastType; // Toast type.
  key?: string; // Toast key - can be used to clear multiple toasts at once using the clearByKey fn.
  href?: string; // HREF / Path to navigate to when toast is clicked.
  delay?: number; // Delay before toast is removed.
  avatarObject?: MindsAvatarObject; // Avatar object to display in the toast.
}

/**
 * Notification toaster service - used to trigger toaster
 * to show from anywhere in the application.
 */
@Injectable({ providedIn: 'root' })
export class NotificationToasterV2Service {
  /** Toasts. */
  public readonly toasts$: BehaviorSubject<NotificationToast[]> =
    new BehaviorSubject<NotificationToast[]>([]);

  /**
   * Show an info toast.
   * @param { Omit<NotificationToast, 'type'> } args - toast arguments.
   * @returns { void }
   */
  public info(args: Omit<NotificationToast, 'type'>): void {
    this.show({
      ...args,
      type: 'info',
    });
  }

  /**
   * Show a success toast.
   * @param { Omit<NotificationToast, 'type'> } args - toast arguments.
   * @returns { void }
   */
  public success(args: Omit<NotificationToast, 'type'>): void {
    this.show({
      ...args,
      type: 'success',
    });
  }

  /**
   * Show a danger toast.
   * @param { Omit<NotificationToast, 'type'> } args - toast arguments.
   * @returns { void }
   */
  public danger(args: Omit<NotificationToast, 'type'>): void {
    this.show({
      ...args,
      type: 'danger',
    });
  }

  /**
   * Remove a toast.
   * @param { NotificationToast } toast - toast.
   * @returns { void }
   */
  public remove(toast: NotificationToast): void {
    this.toasts$.next(this.toasts$.getValue().filter((t) => t != toast));
  }

  /**
   * Clear all toasts.
   * @returns { void }
   */
  public clear(): void {
    this.toasts$.next([]);
  }

  /**
   * Clear toasts by key.
   * @param { string } key - toast key.
   * @returns { void }
   */
  public clearByKey(key: string): void {
    this.toasts$.next(this.toasts$.getValue().filter((t) => t.key != key));
  }

  /**
   * Show a toast.
   * @param { NotificationToast } toast - toast.
   * @returns { void }
   */
  private show(toast: NotificationToast): void {
    this.toasts$.next([toast, ...this.toasts$.getValue()]);
  }
}
