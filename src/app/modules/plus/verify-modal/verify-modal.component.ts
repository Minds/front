import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';

import { Client } from '../../../common/api/client.service';
import { ToasterService } from '../../../common/services/toaster.service';
/**
 * Opens a modal with a form for Minds+ users to get verified.
 *
 * See it in settings > plus > verify
 */
@Component({
  selector: 'm-plusVerifyModal',
  templateUrl: 'verify-modal.component.html',
  styleUrls: ['verify-modal.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlusVerifyModalComponent {
  form: UntypedFormGroup;
  onCompleted: () => void;
  inProgress: boolean = false;

  constructor(
    private client: Client,
    private cd: ChangeDetectorRef,
    private fb: UntypedFormBuilder,
    private toaster: ToasterService
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
        this.toaster.success('Your verification request has been submitted');

        this.onCompleted?.();
        this.detectChanges();
      })
      .catch(() => {
        this.inProgress = false;
        this.toaster.error('Sorry, something went wrong');
        this.detectChanges();
      });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  /**
   * Modal options
   * @param onCompleted
   * @returns { void }
   */
  public setModalData({ onCompleted }): void {
    this.onCompleted = onCompleted;
  }
}
