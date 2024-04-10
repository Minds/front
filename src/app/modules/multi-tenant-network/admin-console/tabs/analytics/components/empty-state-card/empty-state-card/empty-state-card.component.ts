import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Presentational component for a card to be shown when
 * an analytics feed is empty.
 */
@Component({
  selector: 'm-networkAdminAnalytics__emptyStateCard',
  styleUrls: ['./empty-state-card.component.ng.scss'],
  template: `
    <div class="m-networkAdminEmptyStateCard__container--left">
      <i class="material-icons">{{ icon }}</i>
    </div>
    <div class="m-networkAdminEmptyStateCard__container--right">
      <h4 class="m-networkAdminEmptyStateCard__title" i18n>{{ title }}</h4>
      <p class="m-networkAdminEmptyStateCard__description" i18n>
        {{ description }}
      </p>
      <m-button
        color="blue"
        solid="true"
        size="small"
        (onAction)="onAction.emit()"
      >
        <i *ngIf="ctaIcon" class="material-icons">{{ ctaIcon }}</i>
        <span i18n>{{ ctaText }}</span></m-button
      >
    </div>
  `,
})
export class NetworkAdminAnalyticsEmptyStateCardComponent {
  /** Title of card. */
  @Input() protected readonly title: string;

  /** Icon on the left hand side of card. */
  @Input() protected readonly icon: string;

  /** Description of the card. Shown under title. */
  @Input() protected readonly description: string;

  /** Text for CTA. */
  @Input() protected readonly ctaText: string;

  /** Icon shown to the left  of the CTA icon. */
  @Input() protected readonly ctaIcon: string;

  /** Outputs on CTA button click. */
  @Output() protected readonly onAction: EventEmitter<void> =
    new EventEmitter<void>();
}
