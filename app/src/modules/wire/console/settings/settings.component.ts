import { Component, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Client, Upload } from '../../../../services/api';
import { SessionFactory } from '../../../../services/session';
import { WalletService } from '../../../../services/wallet';
import { Storage } from '../../../../services/storage';

@Component({
  moduleId: module.id,
  selector: 'm-wire-console-settings',
  templateUrl: 'settings.component.html'
})

export class WireConsoleSettingsComponent {

  @Output('saved') savedEmitter: EventEmitter<any> = new EventEmitter<any>();

  session = SessionFactory.build();
  ts: number = Date.now();

  user = window.Minds.user;
  minds = window.Minds;

  error: string = '';

  exclusive: any = {
    intro: '',
    background: 0,
    saving: false,
    saved: false
  };

  previewEntity: any = false;
  preview: any = {};

  constructor(public client: Client, public upload: Upload, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.setUp();
  }

  setUp() {
    if (this.user.merchant.exclusive) {
      this.exclusive = this.user.merchant.exclusive;
    }

    this.updatePreviewEntity();
  }

  updatePreviewEntity() {
    this.previewEntity = {
      _preview: true,
      wire_threshold: {
        type: 'money',
        min: 50
      },
      ownerObj: {
        ...this.user,
        merchant: {
          exclusive: {
            intro: this.exclusive.intro,
            _backgroundPreview:
              this.preview.src ||
              this.minds.cdn_url + 'fs/v1/paywall/preview/' + this.session.getLoggedInUser().guid + '/' + this.exclusive.background,
          }
        }
      }
    };

    this.detectChanges();
  }

  updatePreview(input: HTMLInputElement) {
    let file = input ? input.files[0] : null;

    var reader = new FileReader();
    reader.onloadend = () => {
      input.src = reader.result;

      this.preview = { src: reader.result };
      this.updatePreviewEntity();
    };
    reader.readAsDataURL(file);

    this.detectChanges();
  }

  uploadPreview(input: HTMLInputElement): Promise<boolean> {

    let file = input ? input.files[0] : null;

    if (!file) {
      return Promise.resolve(true);
    }

    return this.upload.post('api/v1/merchant/exclusive-preview', [file], {},
      (progress) => {
        console.log(progress);
      })
      .then((response: any) => {
        input.value = null;
        this.exclusive.background = Math.floor(Date.now() / 1000);
        this.detectChanges();

        return true;
      })
      .catch((e) => {
        alert('Sorry, there was a problem. Try again.');
        input.value = null;
        this.detectChanges();

        return false;
      });
  }

  save(file: HTMLInputElement): Promise<any> {
    if (this.exclusive.saved || this.exclusive.saving) {
      return;
    }

    this.exclusive.saved = false;
    this.exclusive.saving = true;
    this.detectChanges();

    return this.uploadPreview(file)
      .then(() => {
        return this.client.post('api/v1/merchant/exclusive', this.exclusive)
          .then(() => {
            this.minds.user.merchant.exclusive = this.exclusive;
            this.exclusive.saved = true;
            this.exclusive.saving = false;
            this.detectChanges();

            setTimeout(() => this.savedEmitter.emit(true), 2500);
          });
      });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
