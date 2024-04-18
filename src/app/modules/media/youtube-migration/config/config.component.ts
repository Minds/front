import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ViewRef,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { YoutubeMigrationService } from '../youtube-migration.service';
import { Router } from '@angular/router';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Session } from '../../../../services/session';
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
  form: UntypedFormGroup;
  autoImportSubscription: Subscription;

  constructor(
    protected cd: ChangeDetectorRef,
    protected youtubeService: YoutubeMigrationService,
    protected router: Router,
    protected toasterService: ToasterService,
    protected session: Session
  ) {}

  ngOnInit() {
    this.form = new UntypedFormGroup({
      autoImport: new UntypedFormControl(false),
    });

    this.autoImportSubscription = this.youtubeService.autoImport$.subscribe(
      (autoImport) => {
        this.autoImport.patchValue(autoImport);
        this.detectChanges();
      }
    );

    this.autoImport.valueChanges.subscribe((val) => {
      if (this.init) {
        this.submit();
      }
    });

    this.init = true;
    this.detectChanges();
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
      if (response && response.status === 'success') {
        this.form.markAsPristine();
        this.toasterService.success('Auto-import preference saved');
      }
    } catch (e) {
      console.error('error', e);
      this.toasterService.error(
        'Sorry, there was an error and your changes have not been saved.'
      );
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  ngOnDestroy() {
    if (this.autoImportSubscription) {
      this.autoImportSubscription.unsubscribe();
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
      await this.youtubeService.disconnectAccount();
    } catch (e) {
      this.toasterService.error(
        'Sorry, there was an error and your changes have not been saved.'
      );
      this.inProgress = false;
      this.detectChanges();
    }
  }

  detectChanges() {
    if (!(this.cd as ViewRef).destroyed) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }

  /**
   * Returning false prevent the checkbox being clicked multiple times
   */
  onAutoImportCheckboxClick(e: MouseEvent) {
    if (this.inProgress) return false;
  }

  get autoImport() {
    return this.form.get('autoImport');
  }
}
