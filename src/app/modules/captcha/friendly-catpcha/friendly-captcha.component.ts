import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { WidgetInstance } from 'friendly-challenge';
import { CookieService } from '../../../common/services/cookie.service';

export type FriendlyCaptchaStartMode = 'auto' | 'focus' | 'none' | undefined;

export type FriendlyCaptchaOrigin = 'registration' | 'vote_up' | null;

/**
 * FriendlyCaptcha widget component. Handles display of widget and
 * outputs solution in a ControlValueAccessor compliant way so that it can be used in forms.
 * Also emits done via an Output as an alternative.
 */
@Component({
  selector: 'm-friendlyCaptcha',
  template: ` <div #friendlyWidget></div> `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FriendlyCaptchaComponent),
      multi: true,
    },
  ],
})
export class FriendlyCaptchaComponent
  implements AfterViewInit, ControlValueAccessor
{
  // Instance of widget.
  private widget: WidgetInstance;

  // Key to identify site.
  private siteKey: string = 'minds-front';

  // When to start solving the CAPTCHA.
  private startMode: FriendlyCaptchaStartMode = 'auto';

  // Endpoint called by puzzle.
  private puzzleEndpoint = '/api/v3/friendly-captcha/puzzle';

  // ViewChild of widget.
  @ViewChild('friendlyWidget') container: ElementRef<HTMLElement>;

  // TODO: Move to Common folder?

  /**
   * An input to define the origin for the captcha component
   */
  @Input()
  public puzzleOrigin: FriendlyCaptchaOrigin = null;

  /**
   * Emits when puzzle solution is ready.
   */
  @Output()
  public done: EventEmitter<string> = new EventEmitter<string>();

  constructor(private cookies: CookieService) {}

  /**
   * Init widget after view init.
   * @return { void }
   */
  ngAfterViewInit(): void {
    this.widget = new WidgetInstance(this.container.nativeElement, {
      startMode: this.startMode,
      sitekey: `${this.siteKey}&origin=${this.puzzleOrigin}`,
      puzzleEndpoint: `${this.puzzleEndpoint}`,
      doneCallback: (solution: string) => {
        this.propagateChange(solution);
        this.done.emit(solution);
      },
    });

    this.handleBypass();
  }

  /**
   * Reset CAPTCHA widget - call endpoint again to generate a new CAPTCHA.
   * @return { void }
   */
  public reset(): void {
    this.widget.reset();
  }

  /**
   * Change propagation function default.
   * @param { any } change - change value.
   */
  public propagateChange = (change: any): void => {};

  /**
   * Write value to form control - noop function inherited from
   * ControlValueAccessor, as CAPTCHA should not be written to externally.
   * @param { any } value - callback function.
   * @returns { void }
   */
  public writeValue(value: any): void {
    // Do nothing
  }

  /**
   * Registers onChange function for ControlValueAccessor interface.
   * @param { any } fn - value to write.
   * @returns { void }
   */
  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  /**
   * Registers on touch function for ControlValueAccessor interface.
   * noop but could be used in future to have this component aware of when the form
   * is first touched.
   * @param fn - callback function.
   * @returns { void }
   */
  public registerOnTouched(fn: any): void {}

  /**
   * Handles CAPTCHA bypass if cookie is present.
   * @returns { boolean } true if CAPTCHA bypass mode is active.
   * Will be validated server-side.
   */
  private handleBypass(): boolean {
    if (this.cookies.get('captcha_bypass')) {
      this.propagateChange('friendly_captcha_bypass');
      this.done.emit('friendly_captcha_bypass');
      return true;
    }
    return false;
  }
}
