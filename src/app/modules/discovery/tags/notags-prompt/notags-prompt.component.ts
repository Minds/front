import { Component, EventEmitter, Injector, Output } from '@angular/core';
import { DiscoveryTagsService } from '../tags.service';
import { DiscoveryTagSettingsComponent } from '../settings.component';
import { ModalService } from '../../../../services/ux/modal.service';

/**
 * Prompts user to select tags.
 * Appears when a user with no tags lands on a discovery feed that requires tags.
 */
@Component({
  selector: 'm-discovery__noTagsPrompt',
  templateUrl: './notags-prompt.component.html',
})
export class DiscoveryNoTagsPromptComponent {
  @Output() completed: EventEmitter<true> = new EventEmitter();

  constructor(
    private service: DiscoveryTagsService,
    private modalService: ModalService,
    private injector: Injector
  ) {}

  async openTagSettings(e: MouseEvent): Promise<void> {
    const modal = this.modalService.present(DiscoveryTagSettingsComponent, {
      data: {
        onSave: tags => {
          modal.close(tags);
        },
      },
      injector: this.injector,
    });
    const tags = await modal.result;
    if (tags) {
      this.service.tags$.next(tags);
    }
    this.completed.next(true);
  }
}
