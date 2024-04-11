import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Enum for differt time periods that can be displayed.
 */
export enum PlanCardPriceTimePeriodEnum {
  Annually,
  Monthly,
  OneTimeSetup,
}

/**
 * Plan card component - intended to be used to display information
 * on different plans.
 */
@Component({
  selector: 'm-planCard',
  templateUrl: 'plan-card.component.html',
  styleUrls: ['./plan-card.component.ng.scss'],
})
export class PlanCardComponent {
  /** Enum for use in template. */
  public readonly PlanCardPriceTimePeriodEnum: typeof PlanCardPriceTimePeriodEnum =
    PlanCardPriceTimePeriodEnum;

  /** Card title. */
  @Input() title: string;

  /** Card description markdown - optional. */
  @Input() description: string;

  /** Price of plan in cents. */
  @Input() priceCents: number;

  /** Time period for price. */
  @Input() priceTimePeriod: PlanCardPriceTimePeriodEnum;

  /** Secondary price of plan in cents (this can be used for example to show one time fee's) - optional*/
  @Input() secondaryPriceCents: number | null;

  /** Secondary price time period - optional. */
  @Input() secondaryPriceTimePeriod: PlanCardPriceTimePeriodEnum;

  /** Whether a price change is in progress - triggers loading state. */
  @Input() priceChangeInProgress: boolean = false;

  /** Title of perks section. */
  @Input() perksTitle: string = 'Features';

  /** String array of perks. */
  @Input() perks: string[];

  /** Whether CTA should be hidden. */
  @Input() hideCta: boolean = false;

  /** Text for CTA. */
  @Input() ctaText: string;

  /** Whether CTA should be solid. */
  @Input() ctaSolid: boolean = false;

  /** Whether CTA should be in a saving state. */
  @Input() ctaSaving: boolean = false;

  /** Whether CTA should be in a disabled state. */
  @Input() ctaDisabled: boolean = false;

  /** Outputs on CTA click. */
  @Output() ctaClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
}
