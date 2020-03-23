import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { ComposerService } from '../../../services/composer.service';

/**
 * Composer's Schedule popup modal
 */
@Component({
  selector: 'm-composer__schedule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'schedule.component.html',
})
export class ScheduleComponent {
  /**
   * Signal event emitter to parent's popup service
   */
  @Output() dismissIntent: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Current state.
   */
  state: {
    date: Date;
    time: string;
  };

  /**
   * Minimum date to allow selecting
   */
  readonly minDate: Date;

  /**
   * Maximum date to allow selecting
   */
  readonly maxDate: Date;

  /**
   * System date/time format options
   */
  readonly dateTimeFormatOptions: Intl.ResolvedDateTimeFormatOptions = new Intl.DateTimeFormat(
    'default'
  ).resolvedOptions();

  /**
   * Constructor. Initializes state, min and max dates
   * @param service
   */
  constructor(protected service: ComposerService) {
    // Set minimum date to select (now)
    this.minDate = new Date();

    // Set maximum date to select (+3 months)
    this.maxDate = new Date();
    this.maxDate.setMonth(this.maxDate.getMonth() + 3);

    // Set current state (now + 1h)
    this.setState(new Date(Date.now() + 3600000));
  }

  /**
   * Initialize. Set state to service's scheduler value
   */
  ngOnInit() {
    const currentValue = this.service.schedule$.getValue();

    if (currentValue) {
      this.setState(new Date(currentValue * 1000));
    }
  }

  /**
   * Sets the complete state
   * @param date
   */
  setState(date: Date) {
    this.state = {
      date,
      time: [
        `${date.getHours()}`.padStart(2, '0'),
        `${date.getMinutes()}`.padStart(2, '0'),
      ].join(':'),
    };
  }

  /**
   * Sets the date when the calendar changes
   * @param date
   */
  onDateChange(date: Date) {
    this.state = {
      ...this.state,
      date,
    };
  }

  /**
   * Sets the time when the hour input changes
   * @param time
   */
  onTimeChange(time: string) {
    this.state = {
      ...this.state,
      time,
    };
  }

  /**
   * Gets parsed time based off state
   * @todo am/pm support using regexp?
   */
  getParsedTime(): { hours: number; minutes: number } | null {
    const [hours, minutes] = this.state.time
      .trim()
      .split(':')
      .map(_ => parseInt(_, 10));

    if (
      isNaN(hours) ||
      hours < 0 ||
      hours > 23 ||
      isNaN(minutes) ||
      minutes < 0 ||
      minutes > 59
    ) {
      return null;
    }

    return { hours, minutes };
  }

  /**
   * Builds a Unix timestamp based off current state (up to seconds)
   */
  buildTimestamp(): number | null {
    const date = new Date(this.state.date.getTime());
    const time = this.getParsedTime();

    if (!time) {
      return null;
    }

    date.setHours(time.hours);
    date.setMinutes(time.minutes);
    date.setSeconds(0);

    return Math.floor(date.getTime() / 1000);
  }

  /**
   * Check if can be saved (state is valid)
   */
  canSave(): boolean {
    if (!this.state || !this.getParsedTime()) {
      // Invalid state
      return false;
    }

    return Math.floor(Date.now() / 1000) < this.buildTimestamp();
  }

  /**
   * Emits the internal state to the composer service and attempts to dismiss the modal
   */
  save(): void {
    if (!this.canSave()) {
      return;
    }

    this.service.schedule$.next(this.buildTimestamp());
    this.dismissIntent.emit();
  }

  /**
   * Get the current timezone from browser as a human-readable string
   */
  get currentTimezone(): string {
    return this.dateTimeFormatOptions.timeZone;
  }
}
