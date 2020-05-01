import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Session } from '../../../../services/session';
import {
  YoutubeMigrationService,
  YoutubeChannel,
} from '../youtube-migration.service';
import { Router } from '@angular/router';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-youtubeMigration__config',
  templateUrl: './config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeMigrationConfigComponent implements OnInit, OnDestroy {
  init: boolean = false;
  inProgress: boolean = false;
  user;
  selectedChannel: YoutubeChannel;
  selectedChannelSubscription: Subscription;
  form: FormGroup;

  constructor(
    protected cd: ChangeDetectorRef,
    private session: Session,
    protected youtubeService: YoutubeMigrationService,
    protected router: Router,
    protected formToastService: FormToastService
  ) {}

  ngOnInit() {
    this.selectedChannelSubscription = this.youtubeService.selectedChannel$.subscribe(
      channel => {
        this.selectedChannel = channel;
        this.detectChanges();
      }
    );

    this.form = new FormGroup({
      autoImport: new FormControl(this.selectedChannel.auto_import),
    });

    this.autoImport.valueChanges.subscribe(val => {
      this.submit();
    });

    this.init = true;
    this.detectChanges();
  }

  ngOnDestroy() {
    this.selectedChannelSubscription.unsubscribe();
  }

  async submit() {
    if (!this.canSubmit()) {
      return;
    }
    this.inProgress = true;
    this.detectChanges();

    if (this.autoImport.value) {
      try {
        const response: any = await this.youtubeService.enableAutoImport();
        if (response.status === 'success') {
          this.form.markAsPristine();
        }
      } catch (e) {
        console.error('error', e);
        this.formToastService.error(
          'Sorry, there was an error and your changes have not been saved.'
        );
      } finally {
        this.inProgress = false;
        this.detectChanges();
      }
    } else {
      try {
        const response: any = await this.youtubeService.disableAutoImport();
        if (response.status === 'success') {
          this.form.markAsPristine();
        }
      } catch (e) {
        console.error('error', e);
        this.formToastService.error(
          'Sorry, there was an error and your changes have not been saved.'
        );
      } finally {
        this.inProgress = false;
        this.detectChanges();
      }
    }
  }

  async disconnectAccount() {
    if (
      !confirm(
        `Are you sure you want to disconnect your YouTube account @${this.selectedChannel.title} from Minds?`
      )
    ) {
      return;
    }

    this.inProgress = true;
    this.detectChanges();

    try {
      const response: any = await this.youtubeService.disconnectAccount();
    } catch (e) {
      this.formToastService.error(
        'Sorry, there was an error and your changes have not been saved.'
      );
      this.inProgress = false;
      this.detectChanges();
    }
  }

  canSubmit(): boolean {
    return !this.inProgress && !this.form.pristine;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get autoImport() {
    return this.form.get('autoImport');
  }
}
