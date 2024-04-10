import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { ComposerService } from '../../../services/composer.service';
import { TypeaheadInputComponent } from '../../../../hashtags/typeahead-input/typeahead-input.component';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { UniqueId } from '../../../../../helpers/unique-id.helper';

/**
 * Composer hashtags popup component. Called programatically via PopupService.
 * Select from a list of trending tags or enter a custom tag via text input
 */
@Component({
  selector: 'm-composer__tags',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'tags.component.html',
})
export class TagsComponent {
  /**
   * Signal event emitter to parent's popup service
   */
  @Output() dismissIntent: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Typeahead component
   */
  @ViewChild('hashtagsTypeaheadInput', { static: true })
  protected hashtagsTypeaheadInput: TypeaheadInputComponent;

  /**
   * Current state before saving
   */
  state: string[] = [];

  /**
   * ID for input/label relationships
   */
  readonly inputId: string = UniqueId.generate('m-composer__tags');

  /**
   * Maximum number of tags allowed
   */
  readonly maxTags: number = 5;

  /**
   * CDN Assets URL
   */
  readonly cdnAssetsUrl: string;

  /**
   * Constructor
   * @param service
   * @param configs
   */
  constructor(
    protected service: ComposerService,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  /**
   * Component initialization. Sets current state.
   */
  ngOnInit() {
    this.state = (this.service.tags$.getValue() || [])
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  /**
   * Adds a value on the internal state
   * @param value
   */
  add(value: string) {
    if (!value) {
      return;
    }

    const state: string[] = [...this.state];

    if (!state.includes(value)) {
      state.push(value);
    }

    this.state = state;
  }

  /**
   * Deletes a value from the internal state
   * @param value
   */
  remove(value: string) {
    if (!value) {
      return;
    }

    const state: string[] = [...this.state];

    if (state.includes(value)) {
      const index = state.indexOf(value);
      state.splice(index, 1);
    }

    this.state = state;
  }

  /**
   * Intent to add a tag
   * @param tag
   */
  addIntent(tag: string) {
    this.add(tag);
    this.hashtagsTypeaheadInput.reset();
  }

  /**
   * Emits the internal state to the composer service, stores to MRU cache and attempts to dismiss the modal
   */
  save() {
    this.service.tags$.next(this.state);
    this.hashtagsTypeaheadInput.pushMRUItems(this.state);
    this.dismissIntent.emit();
  }
}
