import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class TagSettingsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  // Whether this is being shown as part of the onboarding v4 flow
  protected onboardingContext: boolean = false;

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

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * For tags added via search bar
   */
  onAddInput($event): void {
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
    this.discoveryTagsService.addTag($event);
  }

  onRemove($event): void {
    this.discoveryTagsService.removeTag($event);
  }

  async submit(): Promise<void> {
    await this.discoveryTagsService.saveTags();
    // ojm if onboardingContext, tell the service to go to next modal?
    this.service.submitRequested$.next(false);
  }
}
