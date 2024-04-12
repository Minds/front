import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  ComposerService,
  DEFAULT_SCHEDULE_VALUE,
} from '../../../services/composer.service';
import { isSafari } from '../../../../../helpers/is-safari';

/**
 * Composer popup modal that allows users to schedule posts
 * to be posted in the future
 */
@Component({
  selector: 'm-composer__schedule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'schedule.component.html',
  styleUrls: ['schedule.component.ng.scss'],
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
  readonly dateTimeFormatOptions: Intl.ResolvedDateTimeFormatOptions =
    new Intl.DateTimeFormat('default').resolvedOptions();

  /**
   * Validation error
   */
  error: boolean = false;

  /**
   * The composer service data value for schedule$
   */
  schedule$ = this.service.schedule$;

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

    // Set current state (now + 10m)
    this.setState(new Date(Date.now() + 600000));
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
      .map((_) => parseInt(_, 10));

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
  hasError(): boolean {
    const formatError = !this.getParsedTime();
    // 5 minutes in the future.
    const futureError =
      Math.floor(Date.now() / 1000) + 300 >= this.buildTimestamp();

    // We only need to show errors for safari because it doesn't support input[type=time]
    if (isSafari()) {
      this.error = formatError || futureError;
    }

    if (formatError || futureError) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Emits the internal state to the composer service and attempts to dismiss the modal
   */
  save(): void {
    if (!this.state || this.hasError()) {
      return;
    }

    this.service.schedule$.next(this.buildTimestamp());
    this.dismissIntent.emit();
  }

  /**
   * Will clear the schedule value
   * @param e
   */
  onClear(e: MouseEvent) {
    this.service.schedule$.next(DEFAULT_SCHEDULE_VALUE);
    this.dismissIntent.emit();
  }

  /**
   * Get the current timezone from browser as a human-readable string
   */
  get currentTimezone(): string {
    return this.dateTimeFormatOptions.timeZone;
  }
}
