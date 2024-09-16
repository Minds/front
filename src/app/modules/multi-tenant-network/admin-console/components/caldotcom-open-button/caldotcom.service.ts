import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '../../../../../common/injection-tokens/common-injection-tokens';
import { BehaviorSubject } from 'rxjs';

/**
 * Service for loading and interacting with the cal.com SDK.
 */
@Injectable({ providedIn: 'root' })
export class CalDotComService {
  /** Whether the cal.com script has been loaded. */
  public readonly scriptLoaded$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(WINDOW) private readonly window: Window
  ) {}

  /**
   * Load the cal.com script.
   * @returns { void }
   */
  public loadScript(): void {
    if (this.scriptLoaded$.getValue()) {
      console.info('Did not reload cal.com script - it is already loaded');
      return;
    }

    // grab existing script elements
    const firstScriptElement: HTMLScriptElement =
      this.document.getElementsByTagName('script')[0];

    // create new script element
    let newScriptElement: HTMLScriptElement =
      this.document.createElement('script');

    newScriptElement.src = '/assets/scripts/cal.js';
    newScriptElement.defer = true;
    newScriptElement.async = true;

    // add new script element to DOM
    firstScriptElement.parentNode.insertBefore(
      newScriptElement,
      firstScriptElement
    );

    // attach on load listener for script to init.
    newScriptElement.onload = (): void => {
      this.scriptLoaded$.next(true);
    };
  }

  /**
   * Initialize a calendar.
   * @param { string } namespace - The namespace to initialize the calendar with.
   * @returns { void }
   */
  public initializeCalendar(namespace: string): void {
    (this.window as any).Cal('init', namespace, { origin: 'https://cal.com' });
    (this.window as any).Cal.ns[namespace]('ui', {
      styles: {
        branding: {
          brandColor: '#000000',
        },
      },
      hideEventTypeDetails: false,
      layout: 'month_view',
    });
  }
}
