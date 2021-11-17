import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  DiscoveryTag,
  DiscoveryTagsService,
} from '../../discovery/tags/tags.service';
import { TypeaheadInputComponent } from '../../hashtags/typeahead-input/typeahead-input.component';
import { TagSettingsService } from '../tag-settings.service';

/**
 * Allows a user to select and deselect the tags that they are following
 */
@Component({
  selector: 'm-tagSettings',
  templateUrl: './tag-settings.component.html',
  styleUrls: ['./tag-settings.component.ng.scss'],
})
export class TagSettingsComponent implements OnInit {
  private subscriptions: Subscription[] = [];

  tags: Array<DiscoveryTag>;

  @ViewChild('hashtagsTypeaheadInput', { static: true })
  protected hashtagsTypeaheadInput: TypeaheadInputComponent;

  constructor(
    public service: TagSettingsService,
    public discoveryTagsService: DiscoveryTagsService
  ) {}

  ngOnInit(): void {
    this.discoveryTagsService.loadTags();

    this.subscriptions.push(
      this.service.submitRequested$.subscribe(requested => {
        if (requested) {
          this.submit();
        }
      })
    );
  }

  onAddInput($event): void {
    console.log('ojm onaddInput $event', $event);

    const tag = {
      value: $event,
      selected: true,
    };

    if (
      this.discoveryTagsService.userAndDefault$.value.findIndex(
        i => i.value === tag.value
      ) === -1
    ) {
      this.discoveryTagsService.userAndDefault$.next([
        tag,
        ...this.discoveryTagsService.userAndDefault$.value,
      ]);

      this.discoveryTagsService.addTag(tag);
    }
  }

  onAdd($event): void {
    console.log('ojm onAdd event', $event);
    this.discoveryTagsService.addTag($event);
  }

  onRemove($event): void {
    console.log('ojm onRemove event', $event);
    this.discoveryTagsService.removeTag($event);
  }

  async submit(): Promise<void> {
    await this.discoveryTagsService.saveTags();
    this.service.submitRequested$.next(false);
  }

  /**
   * Intent to add a tag
   * @param tag
   */
  // addIntent(tag: string) {
  //   this.add(tag);
  //   this.hashtagsTypeaheadInput.reset();
  // }

  /**
   * Emits the internal state to the composer service, stores to MRU cache and attempts to dismiss the modal
   */
  // save() {
  //   this.service.tags$.next(this.state);
  //   this.hashtagsTypeaheadInput.pushMRUItems(this.state);
  //   this.dismissIntent.emit();
  // }
}
