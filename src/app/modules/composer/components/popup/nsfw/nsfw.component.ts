import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { ComposerService } from '../../../services/composer.service';
import { NSFW_REASONS } from '../../../../../common/components/nsfw-selector/nsfw-selector.service';
import { ComposerBlogsService } from '../../../services/blogs.service';

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
    protected blogsService: ComposerBlogsService
  ) {}

  /**
   * Component initialization. Sets current state.
   */
  ngOnInit() {
    this.state = (this.getComposerService().nsfw$.getValue() || []).filter(
      (value, index, self) => self.indexOf(value) === index
    );
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
   * Emits the internal state to the composer service and attempts to dismiss the modal
   */
  save() {
    this.getComposerService().nsfw$.next(this.state.sort());
    this.dismissIntent.emit();
  }

  /**
   * Returns either the ComposerService or BlogService depending on the contentType$.
   * @returns { ComposerService | BlogService } - service to handle state.
   */
  getComposerService(): ComposerService | ComposerBlogsService {
    return this.service.contentType$.getValue() === 'post'
      ? this.service
      : this.blogsService;
  }
}
