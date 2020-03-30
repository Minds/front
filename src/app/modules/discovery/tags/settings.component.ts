import { Component, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { DiscoveryTagsService, DiscoveryTag } from './tags.service';

const noOp = () => {};

@Component({
  selector: 'm-discovery__tagSettings',
  templateUrl: './settings.component.html',
})
export class DiscoveryTagSettingsComponent {
  tags$: Observable<DiscoveryTag> = this.service.tags$;
  other$: Observable<DiscoveryTag> = this.service.other$;
  inProgress$: Observable<boolean> = this.service.inProgress$;
  saving$: Observable<boolean> = this.service.saving$;
  onDismissIntent: () => void = noOp;

  /**
   * Modal options
   *
   * @param onDismissIntent
   */
  set opts({ onDismissIntent }) {
    this.onDismissIntent = onDismissIntent || noOp;
  }

  constructor(private service: DiscoveryTagsService) {}

  ngOnInit() {
    if (!this.service.trending$.value.length) this.service.loadTags();
  }

  async onSave(e: Event): Promise<void> {
    await this.service.saveTags();
    this.onDismissIntent();
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
