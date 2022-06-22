import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Session } from '../../../../services/session';
import { Storage } from '../../../../services/storage';
import { FeaturesService } from '../../../../services/features.service';
import { MessengerService } from '../../../messenger/messenger.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-settingsV2__messenger',
  templateUrl: './messenger.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2MessengerComponent implements OnInit, OnDestroy {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  init: boolean = false;
  inProgress: boolean = false;
  form;
  showLegacyMessengerSubscription: Subscription;

  constructor(
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected storage: Storage,
    protected featuresService: FeaturesService,
    protected messengerService: MessengerService
  ) {}

  ngOnInit(): void {
    let initShow;
    this.showLegacyMessengerSubscription = this.messengerService.showLegacyMessenger$.subscribe(
      show => {
        initShow = show;
      }
    );

    this.form = new FormGroup({
      legacy_messenger: new FormControl(initShow),
    });

    this.init = true;
    this.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.showLegacyMessengerSubscription) {
      this.showLegacyMessengerSubscription.unsubscribe();
    }
  }

  submit() {
    if (!this.canSubmit()) {
      return;
    }
    this.inProgress = true;
    this.detectChanges();

    const show = this.legacy_messenger.value;
    this.storage.set('legacy_messenger', show);
    this.messengerService.showLegacyMessenger$.next(show);

    this.formSubmitted.emit({ formSubmitted: true });
    this.form.markAsPristine();

    this.inProgress = false;
    this.detectChanges();
  }

  canSubmit(): boolean {
    return this.form.valid && !this.inProgress && !this.form.pristine;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get legacy_messenger() {
    return this.form.get('legacy_messenger');
  }
}
