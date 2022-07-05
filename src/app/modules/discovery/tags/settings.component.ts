import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DiscoveryTag, DiscoveryTagsService } from './tags.service';

const noOp = () => {};

/**
 * Tag settings for discovery feeds
 * Add custom tags, add/remove your tags, see a list of other tags
 * See it by clicking "Discovery" in the side nav and then clicking the settings cog
 */
@Component({
  selector: 'm-discovery__tagSettings',
  templateUrl: './settings.component.html',
})
export class DiscoveryTagSettingsComponent {
  tags$: Observable<DiscoveryTag[]> = this.service.tags$;
  defaults$: Observable<DiscoveryTag[]> = this.service.defaults$;
  inProgress$: Observable<boolean> = this.service.inProgress$;
  saving$: Observable<boolean> = this.service.saving$;
  onDismissIntent: () => void = noOp;
  onSaveIntent: (tags: DiscoveryTag[]) => void = noOp;

  constructor(private service: DiscoveryTagsService) {}

  setModalData(data: {
    onSave: (tags: DiscoveryTag[]) => void;
    onDismissIntent: () => void;
  }) {
    this.onDismissIntent = data.onDismissIntent || noOp;
    this.onSaveIntent = data.onSave || noOp;
  }

  ngOnInit() {
    if (!this.service.trending$.value.length) this.service.loadTags();
  }

  async onSave(e: Event): Promise<void> {
    await this.service.saveTags();
    this.onDismissIntent();
    this.onSaveIntent(this.service.tags$.value);
  }

  onKeypress(input: HTMLInputElement, e: KeyboardEvent): void {
    if (e.keyCode !== 13) return;
    e.preventDefault();
    const tag: DiscoveryTag = {
      value: input.value,
    };
    this.addTag(tag);
    input.value = '';
  }

  addTag(tag: DiscoveryTag): void {
    return this.service.addTag(tag);
  }

  removeTag(tag: DiscoveryTag): void {
    return this.service.removeTag(tag);
  }
}
