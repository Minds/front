import { Component, Injector, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { DiscoveryTagsService } from '../tags.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { DiscoveryTagSettingsComponent } from '../settings.component';

@Component({
  selector: 'm-discovery__noTagsPrompt',
  templateUrl: './notags-prompt.component.html',
})
export class DiscoveryNoTagsPromptComponent {
  @Output() completed: EventEmitter<true> = new EventEmitter();

  constructor(
    private service: DiscoveryTagsService,
    private overlayModal: OverlayModalService,
    private injector: Injector
  ) {}

  openTagSettings(e: MouseEvent): void {
    this.overlayModal
      .create(DiscoveryTagSettingsComponent, null, {
        wrapperClass: 'm-modalV2__wrapper',
        injector: this.injector,
        onSave: tags => this.service.tags$.next(tags),
        onDismissIntent: () => {
          this.overlayModal.dismiss();
        },
      })
      .onDidDismiss(() => {
        this.completed.next(true);
      })
      .present();
  }
}
