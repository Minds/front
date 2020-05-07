import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { YoutubeMigrationService } from '../youtube-migration.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { FormToastService } from '../../../../common/services/form-toast.service';

@Component({
  selector: 'm-youtubeMigration__setupModal',
  templateUrl: './setup-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeMigrationSetupModalComponent {
  inProgress: boolean = false;

  constructor(
    protected youtubeService: YoutubeMigrationService,
    protected overlayModal: OverlayModalService,
    protected cd: ChangeDetectorRef,
    protected formToastService: FormToastService
  ) {}

  async submit(autoImport: boolean) {
    this.inProgress = true;
    this.detectChanges();

    try {
      let response: any;
      if (autoImport) {
        response = await this.youtubeService.enableAutoImport();
      } else {
        response = await this.youtubeService.disableAutoImport();
      }
      if (response && response.status === 'success') {
        this.formToastService.success('Auto-import preference saved');
      } else {
        this.formToastService.error(
          'Sorry, there was an error and your changes have not been saved.'
        );
      }
      this.detectChanges();
    } finally {
      this.overlayModal.dismiss();
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
