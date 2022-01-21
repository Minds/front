import { Component, Injector } from '@angular/core';
import { ComposerService } from '../services/composer.service';
import { ComposerModalService } from '../components/modal/modal.service';

@Component({
  selector: 'm-composer__topbarButton',
  templateUrl: './topbar-button.component.html',
  providers: [ComposerService],
})
export class ComposerTopbarButtonComponent {
  constructor(
    private composer: ComposerService,
    private composerModal: ComposerModalService,
    private injector: Injector
  ) {}

  onClick(e: MouseEvent) {
    this.composerModal.setInjector(this.injector).present();
  }
}
