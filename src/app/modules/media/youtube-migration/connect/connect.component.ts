import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
  ElementRef,
} from '@angular/core';
import { YoutubeMigrationService } from '../youtube-migration.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Session } from '../../../../services/session';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Element, Node } from '@angular/compiler';

@Component({
  selector: 'm-youtubeMigration__connect',
  templateUrl: './connect.component.html',
  styleUrls: ['connect.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeMigrationConnectComponent {
  form: FormGroup;
  readonly username: string;

  constructor(
    protected youtubeService: YoutubeMigrationService,
    public router: Router,
    protected cd: ChangeDetectorRef,
    fb: FormBuilder,
    session: Session,
    protected toasterService: ToasterService
  ) {
    this.form = fb.group({
      youtubeId: ['', Validators.required],
    });
    this.username = session.getLoggedInUser().username;
  }

  inProgress: boolean = false;

  async connect(): Promise<void> {
    this.inProgress = true;
    this.detectChanges();

    try {
      const connected = (await this.youtubeService.connectAccount(
        this.form.value.youtubeId
      )) as any;

      if (!connected) {
        this.toasterService.error(
          'We were unable to verify your account. Please check the steps above and try again.'
        );
      }
    } catch (e) {
      this.toasterService.error(e.message);
    } finally {
      this.inProgress = false;

      this.detectChanges();
    }
  }

  /**
   * Copies element contents to the clipbaord
   */
  copyToClipboard(el: HTMLElement) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      document.execCommand('copy');
      selection.removeAllRanges();

      this.toasterService.success(
        'Link copied to clipboard. Place this in your YouTube channel description.'
      );
    } catch (e) {
      this.toasterService.warn(
        'Sorry, we are unable to copy to your clipboard'
      );
    }
  }

  get channelId(): string {
    return this.form.value.youtubeId;
  }

  detectChanges() {
    if (!(this.cd as ViewRef).destroyed) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }
}
