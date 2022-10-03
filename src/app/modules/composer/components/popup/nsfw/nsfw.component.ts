import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { ComposerService } from '../../../services/composer.service';
import { NSFW_REASONS } from '../../../../../common/components/nsfw-selector/nsfw-selector.service';
import { ToasterService } from '../../../../../common/services/toaster.service';

/**
 * Composer's NSFW popup modal
 */
@Component({
  selector: 'm-composer__nsfw',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'nsfw.component.html',
})
export class NsfwComponent {
  /**
   * Signal event emitter to parent's popup service
   */
  @Output() dismissIntent: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Normalized array of NSFW reasons
   */
  readonly nsfwReasons: Array<{
    label: string;
    value: number;
  }> = NSFW_REASONS.map(({ label, value }) => ({
    label,
    value,
  }));

  /**
   * Current state before saving
   */
  state: number[] = [];

  constructor(
    protected service: ComposerService,
    protected toasterService: ToasterService
  ) {}

  /**
   * Component initialization. Sets current state.
   */
  ngOnInit() {
    this.state = (this.service.nsfw$.getValue() || []).filter(
      (value, index, self) => self.indexOf(value) === index
    );
    this.isSupermindContent();
  }

  /**
   * Toggles a value on the internal state
   * @param value
   */
  toggle(value: number) {
    const state: number[] = [...this.state];

    if (state.includes(value)) {
      state.splice(state.indexOf(value), 1);
    } else {
      state.push(value);
    }

    this.state = state;
  }

  /**
   * Emits the internal state to the composer service and attempts to dismiss the modal.
   * @returns { void }
   */
  public save(): void {
    if (this.hasNsfwTags() && this.isSupermindContent()) {
      return;
    }

    this.service.nsfw$.next(this.state.sort());
    this.dismissIntent.emit();
  }

  /**
   * Checks whether this is for a supermind, and throws a toast up if it is.
   * As NSFW Superminds are not currently supported.
   * @returns { boolean } - true if is supermind.
   */
  private isSupermindContent(): boolean {
    if (
      !!this.service.supermindRequest$.getValue() ||
      !!this.service.supermindReply$.getValue()
    ) {
      this.toasterService.error(
        'You may not create an NSFW supermind at this time.'
      );
      return true;
    }
    return false;
  }

  /**
   * Whether component has NSFW tags.
   * @returns { boolean }
   */
  private hasNsfwTags(): boolean {
    return Boolean(this.state.length);
  }
}
