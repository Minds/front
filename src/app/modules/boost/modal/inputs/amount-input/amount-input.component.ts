import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { BoostModalService } from '../../boost-modal.service';

// TODO: Source from server.
const MAXIMUM_SINGLE_BOOST_VIEWS = 5000;

@Component({
  selector: 'm-boostModal__amountInput',
  template: `
    <div class="m-boostModalAmount__container" [formGroup]="form">
      <div
        class="m-boostModalAmount__inputContainer m-boostModalAmount__viewsInput"
      >
        <label i18n="@@BOOST_MODAL__AMOUNT__VIEWS">Views</label>
        <input
          type="number"
          [ngModel]="(views$ | async)?.toString()"
          (ngModelChange)="viewsValueChanged($event)"
          name="views"
          formControlName="views"
          min="100"
          value="1"
        />
      </div>
      <div
        class="m-boostModalAmount__inputContainer m-boostModalAmount__tokensInput"
      >
        <label i18n="@@BOOST_MODAL__AMOUNT__TOKENS">Tokens</label>
        <input
          type="number"
          [ngModel]="(tokens$ | async).toString()"
          (ngModelChange)="tokensValueChanged($event)"
          name="tokens"
          formControlName="tokens"
          min="1"
          value="1"
        />
      </div>
    </div>
    <div class="m-boostModalAmount--error">
      <span
        *ngIf="form.controls.views.errors?.max"
        i18n="@@BOOST_MODAL__MAX_VIEWS_ERROR"
      >
        Sorry, you may only boost for a maximum of {{ maxViews }} views at once.
      </span>

      <span
        *ngIf="form.controls.views.errors?.min"
        i18n="@@BOOST_MODAL__MIN_VIEWS_ERROR"
      >
        Sorry, you may only boost for a minimum of 100 views.</span
      >
    </div>
  `,
  styleUrls: ['./amount-input.component.ng.scss'],
})
export class BoostModalAmountInputComponent implements OnInit {
  public readonly rate$: BehaviorSubject<number> = new BehaviorSubject<number>(
    1000
  );
  public readonly tokens$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(2.5);
  public readonly views$: BehaviorSubject<number> = new BehaviorSubject<number>(
    2500
  );

  public maxViews = MAXIMUM_SINGLE_BOOST_VIEWS;
  public form: FormGroup;

  ngOnInit(): void {
    const defaultViews = this.maxViews / 2;
    const defaultTokens = defaultViews / this.rate$.getValue();
    const maxTokens = this.maxViews / this.rate$.getValue();

    this.form = new FormGroup({
      tokens: new FormControl(defaultTokens, {
        validators: [
          Validators.required,
          Validators.max(maxTokens),
          Validators.min(1),
        ],
      }),
      views: new FormControl(defaultViews, {
        validators: [
          Validators.required,
          Validators.max(this.maxViews),
          Validators.min(100),
        ],
      }),
    });
  }

  public viewsValueChanged($event): void {
    this.tokens$.next($event / this.rate$.getValue());
  }

  public tokensValueChanged($event): void {
    this.views$.next($event * this.rate$.getValue());
  }
}
