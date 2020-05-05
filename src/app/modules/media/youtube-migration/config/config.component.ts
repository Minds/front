import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { YoutubeMigrationService } from '../youtube-migration.service';
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
  autoImportSubscription: Subscription;
  form: FormGroup;

  constructor(
    protected cd: ChangeDetectorRef,
    protected youtubeService: YoutubeMigrationService,
    protected router: Router,
    protected formToastService: FormToastService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      autoImport: new FormControl(false),
    });

    this.autoImportSubscription = this.youtubeService.autoImport$.subscribe(
      autoImport => {
        if (autoImport !== this.autoImport.value) {
          this.autoImport.patchValue(autoImport);
          this.detectChanges();
        }
      }
    );

    this.autoImport.valueChanges.subscribe(val => {
      this.submit();
    });

    this.init = true;
    this.detectChanges();
  }

  ngOnDestroy() {
    this.autoImportSubscription.unsubscribe();
  }

  async submit() {
    if (this.inProgress) {
      return;
    }
    this.inProgress = true;
    this.detectChanges();

    try {
      let response: any;
      if (this.autoImport.value) {
        response = await this.youtubeService.enableAutoImport();
      } else {
        response = await this.youtubeService.disableAutoImport();
      }
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

  async disconnectAccount() {
    if (
      !confirm(
        `Are you sure you want to disconnect your YouTube account from Minds?`
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

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get autoImport() {
    return this.form.get('autoImport');
  }
}
