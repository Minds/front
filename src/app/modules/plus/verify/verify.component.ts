import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Client } from '../../../common/api/client.service';

/**
 * Opens a modal with a form for Minds+ users to get verified.
 *
 * See it on the /plus marketing page of a user who isn't verified yet.
 */
@Component({
  selector: 'm-plus--verify',
  templateUrl: 'verify.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlusVerifyComponent {
  form: FormGroup;
  onDismiss: () => void;
  inProgress: boolean = false;

  constructor(
    private client: Client,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      link1: ['', Validators.required],
      link2: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  submit(e) {
    this.inProgress = true;
    this.detectChanges();
    this.client
      .post('api/v1/plus/verify', this.form.value)
      .then(() => {
        this.inProgress = false;
        this.onDismiss?.();
        this.detectChanges();
      })
      .catch(() => {
        this.inProgress = false;
        this.detectChanges();
      });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  /**
   * Modal options
   * @param onApply
   * @param onDismissIntent
   */
  setModalData({ onDismiss }) {
    this.onDismiss = onDismiss;
  }
}
