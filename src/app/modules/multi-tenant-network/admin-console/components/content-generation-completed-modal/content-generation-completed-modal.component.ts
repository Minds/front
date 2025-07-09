import { Component } from '@angular/core';
import { Modal } from '../../../../../services/ux/modal.service';
import { CommonModule } from '../../../../../common/common.module';
import { Router } from '@angular/router';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { ModalCloseButtonComponent } from '~/common/components/modal-close-button/modal-close-button.component';

/**
 * Content generation completed modal component.
 */
@Component({
  selector: 'm-contentGenerationCompletedModal',
  templateUrl: './content-generation-completed-modal.component.html',
  styleUrls: ['./content-generation-completed-modal.component.ng.scss'],
  imports: [CommonModule, ModalCloseButtonComponent],
})
export class ContentGenerationCompletedModalComponent
  implements Modal<unknown>
{
  /**
   * Dismiss intent.
   * @returns { void }
   */
  public onDismissIntent: () => void = (): void => {};

  /**
   * Save intent.
   * @returns { void }
   */
  public onSaveIntent: () => void = (): void => {};

  /**
   * Set modal data.
   * @param { any } data - Modal data.
   * @returns { void }
   */
  public setModalData({ onDismissIntent, onSaveIntent }: any) {
    this.onDismissIntent = onDismissIntent ?? (() => {});
    this.onSaveIntent = onSaveIntent ?? (() => {});
  }

  constructor(
    private router: Router,
    private toaster: ToasterService
  ) {}

  /**
   * On show me click.
   * @returns { void }
   */
  public onShowMeClick(): void {
    this.onSaveIntent();
    this.router.navigate(['/']);
  }

  /**
   * On later click.
   * @returns { void }
   */
  public onLaterClick(): void {
    this.toaster.inform(
      'Use the menu to navigate to the newsfeed at any time.'
    );
    this.onDismissIntent();
  }
}
