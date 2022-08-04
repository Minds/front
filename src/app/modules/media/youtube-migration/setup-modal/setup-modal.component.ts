import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { YoutubeMigrationService } from '../youtube-migration.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { ModalService } from '../../../../services/ux/modal.service';

@Component({
  selector: 'm-youtubeMigration__setupModal',
  templateUrl: './setup-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeMigrationSetupModalComponent {
  inProgress: boolean = false;

  constructor(
    protected youtubeService: YoutubeMigrationService,
    protected modalService: ModalService,
    protected cd: ChangeDetectorRef,
    protected toasterService: ToasterService
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
        this.toasterService.success('Auto-import preference saved');
      } else {
        this.toasterService.error(
          'Sorry, there was an error and your changes have not been saved.'
        );
      }
      this.detectChanges();
    } finally {
      this.modalService.dismissAll();
    }
  }

  setModalData() {}

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
