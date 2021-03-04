import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, fromEvent, Subscription } from 'rxjs';
import { map, skip, take } from 'rxjs/operators';
import {
  BoostModalService,
  BoostTab,
  MAXIMUM_SINGLE_BOOST_IMPRESSIONS,
  MINIMUM_BOOST_OFFER_TOKENS,
  MINIMUM_SINGLE_BOOST_IMPRESSIONS,
} from '../../boost-modal.service';

@Component({
  selector: 'm-boostModal__amountInput',
  templateUrl: './amount-input.component.html',
  styleUrls: ['./amount-input.component.ng.scss'],
})
export class BoostModalAmountInputComponent
  implements OnDestroy, AfterViewInit {
  // general subscriptions
  private subscriptions: Subscription[] = [];

  // focus listener subscriptions - treat separately so we can re-init as DOM changes.
  private focusListenerSubscriptions: Subscription[] = [];

  // max impressions.
  public maxImpressions = MAXIMUM_SINGLE_BOOST_IMPRESSIONS;

  // min impressions.
  public minImpressions = MINIMUM_SINGLE_BOOST_IMPRESSIONS;

  // min tokens
  public minTokens = MINIMUM_BOOST_OFFER_TOKENS;

  // true if input is focused.
  public readonly isFocused$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  // amount input form
  public form: FormGroup;

  // impressions input ElementRef
  @ViewChild('impressionsInput') impressionsInput: ElementRef;

  // tokens input ElementRef
  @ViewChild('tokensInput') tokensInput: ElementRef;

  // token label ElementRef
  @ViewChild('tokensLabel') tokensLabel: ElementRef;

  // impressions label ElementRef
  @ViewChild('impressionsLabel') impressionsLabel: ElementRef;

  constructor(private service: BoostModalService) {}

  /**
   * Gets impressions subject from service.
   * @returns { BehaviorSubject<number> } - impressions.
   */
  get impressions$(): BehaviorSubject<number> {
    return this.service.impressions$;
  }

  /**
   * Gets impressions subject from service.
   * @returns { BehaviorSubject<number> } - impressions.
   */
  get tokens$(): BehaviorSubject<number> {
    return this.service.tokens$;
  }

  /**
   * Gets rate from service.
   * @returns { BehaviorSubject<number> } - rate.
   */
  get rate$(): BehaviorSubject<number> {
    return this.service.rate$;
  }

  /**
   * Gets current boost tab from service.
   * @returns { BehaviorSubject<BoostTab> } = current boost tab.
   */
  get activeTab$(): BehaviorSubject<BoostTab> {
    return this.service.activeTab$;
  }

  ngOnInit(): void {
    // subscribe to changes in current rate and active tab
    this.subscriptions.push(
      combineLatest([this.rate$, this.activeTab$])
        .pipe(
          map(([rate, activeTab]) => {
            // setup form controls.
            this.setupFormControls(rate, activeTab);
          })
        )
        .subscribe()
    );
  }

  ngAfterViewInit(): void {
    // setup focus listener subscriptions.
    this.resetFocusListenerSubscriptions();

    this.subscriptions.push(
      // on tab change, reset focus listeners as visible fields may have changed.
      this.activeTab$.pipe(skip(1)).subscribe(() => {
        // push to back of the event queue while DOM updates
        setTimeout(() => this.resetFocusListenerSubscriptions());
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of [
      ...this.subscriptions,
      ...this.focusListenerSubscriptions,
    ]) {
      subscription.unsubscribe();
    }
  }

  /**
   * On views value changed, update tokens to match based on rate.
   * @param { number } $event - views value.
   * @returns { void }
   */
  public viewsValueChanged($event: number): void {
    this.impressions$.next($event);
    this.tokens$.next($event / this.rate$.getValue());
  }

  /**
   * On tokens value changed, update impressions to match based on rate.
   * @param { number } $event - tokens value.
   * @returns { void }
   */
  public tokensValueChanged($event: number): void {
    this.tokens$.next($event);
    this.impressions$.next($event * this.rate$.getValue());
  }

  /**
   * Reset focus listener subscriptions and resubscribe.
   * @returns { void }
   */
  private resetFocusListenerSubscriptions(): void {
    // unsub from any existing to avoid subscription duplication.
    for (let subscription of this.focusListenerSubscriptions) {
      subscription.unsubscribe();
    }

    // if impressions input is in DOM
    if (this.impressionsInput && this.impressionsInput.nativeElement) {
      // subscribe to focus in and out events.
      this.setupImpressionsInputListeners();
    }

    // subscribe to token input focus events
    this.setupTokenInputListeners();
  }

  /**
   * Sets up token input listeners.
   * @returns { void }
   */
  private setupTokenInputListeners(): void {
    this.focusListenerSubscriptions.push(
      fromEvent(this.tokensInput.nativeElement, 'focus').subscribe(value => {
        this.isFocused$.next(true);
      }),

      fromEvent(this.tokensInput.nativeElement, 'focusout').subscribe(value => {
        this.isFocused$.next(false);
      }),
      fromEvent(this.tokensLabel.nativeElement, 'click').subscribe(value => {
        this.tokensInput.nativeElement.focus();
      })
    );
  }

  /**
   * Sets up impressions input listeners.
   * @returns { void }
   */
  private setupImpressionsInputListeners(): void {
    this.focusListenerSubscriptions.push(
      fromEvent(this.impressionsInput.nativeElement, 'focus').subscribe(
        value => {
          this.isFocused$.next(true);
        }
      ),
      fromEvent(this.impressionsInput.nativeElement, 'focusout').subscribe(
        value => {
          this.isFocused$.next(false);
        }
      ),
      fromEvent(this.impressionsLabel.nativeElement, 'click').subscribe(
        value => {
          this.impressionsInput.nativeElement.focus();
        }
      )
    );
  }

  /**
   * Sets up form controls depending on the active tab.
   * @param { number } rate - rate.
   * @param { BoostTab } activeTab - current active tab.
   * @returns { void }
   */
  private setupFormControls(rate: number, activeTab: BoostTab): void {
    const defaultViews = this.maxImpressions / 2;
    const defaultTokens = defaultViews / rate;
    const minTokens = this.minImpressions / rate;

    if (activeTab === 'offer') {
      this.form = new FormGroup({
        tokens: new FormControl(defaultTokens, {
          validators: [Validators.required, Validators.min(minTokens)],
        }),
      });
      return;
    }

    // else newsfeed.
    const maxTokens = this.maxImpressions / rate; // no max on offers

    this.form = new FormGroup({
      tokens: new FormControl(defaultTokens, {
        validators: [
          Validators.required,
          Validators.max(maxTokens),
          Validators.min(minTokens),
        ],
      }),
      impressions: new FormControl(defaultViews, {
        validators: [
          Validators.required,
          Validators.max(this.maxImpressions),
          Validators.min(this.minImpressions),
        ],
      }),
    });
  }
}
