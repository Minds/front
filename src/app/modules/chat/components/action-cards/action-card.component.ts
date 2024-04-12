import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../../common/common.module';

/**
 * Action card for display in various places of Chat system.
 */
@Component({
  selector: 'm-chat__actionCard',
  styleUrls: ['./action-card.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgCommonModule],
  standalone: true,
  template: `
    <h3
      class="m-chatActionCard__title"
      [ngClass]="{
        'm-chatActionCard__title--size1': headerSize === 1,
        'm-chatActionCard__title--size2': headerSize === 2,
        'm-chatActionCard__title--size3': headerSize === 3
      }"
    >
      {{ headerText }}
    </h3>
    <p
      class="m-chatActionCard__description"
      [ngClass]="{
        'm-chatActionCard__description--size1': descriptionSize === 1,
        'm-chatActionCard__description--size2': descriptionSize === 2,
        'm-chatActionCard__description--size3': descriptionSize === 3
      }"
    >
      {{ descriptionText }}
    </p>
    <m-button
      color="blue"
      size="medium"
      solid="true"
      (onAction)="actionButtonClick.emit()"
      >{{ ctaText }}</m-button
    >
  `,
})
export class ChatActionCardComponent {
  /** Text of the action card header. */
  @Input() protected headerText: string = '';

  /** Size of the action card header. */
  @Input() protected headerSize: number = 2;

  /** Text of the description. */
  @Input() protected descriptionText: string = '';

  /** Size of the description. */
  @Input() protected descriptionSize: number = 1;

  /** Text of the CTA button. */
  @Input() protected ctaText: string = '';

  /** Outputs on action button click. */
  @Output() protected actionButtonClick: EventEmitter<void> =
    new EventEmitter<void>();
}
